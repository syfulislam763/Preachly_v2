import { getMessaging, onMessage, onTokenRefresh, getToken, deleteToken, onNotificationOpenedApp, getInitialNotification, requestPermission, hasPermission, AuthorizationStatus, getAPNSToken } from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';
import { AppState, Linking, Alert } from 'react-native';
import { useEffect, useState, useCallback } from 'react';

const m = () => getMessaging();

Notifications.setNotificationHandler({
  handleNotification: async () => {
    console.log('[FCM] 🔔 handleNotification triggered'); // ← does this print?
    return {
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    };
  },
});

let fcmInitialized = false;

export function initFCM() {
  if (fcmInitialized) return; // ← prevent duplicate listeners
  fcmInitialized = true;

  const messaging = m();
  console.log('[FCM] initFCM called');

  onMessage(messaging, async (remoteMessage) => {
    console.log('[FCM] ✅ onMessage fired:', JSON.stringify(remoteMessage));
    await Notifications.scheduleNotificationAsync({
      content: {
        title: remoteMessage.notification?.title ?? 'Preachly',
        body: remoteMessage.notification?.body ?? '',
        data: remoteMessage.data ?? {},
        sound: 'default',
      },
      trigger: null,
    });
  });

  onNotificationOpenedApp(messaging, ({ data }) => handleNav(data));
  getInitialNotification(messaging).then((msg) => {
    if (msg) setTimeout(() => handleNav(msg.data), 1000);
  });
}

function handleNav(data) {
  if (!data?.screen) return;
  console.log('[FCM] Navigate to:', data.screen, data);
}

const API = 'https://your-backend.com/api/user/fcm-token';
const authHeader = () => ({ Authorization: `Bearer YOUR_TOKEN` });

const saveToken = (token) =>
  fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeader() },
    body: JSON.stringify({ fcmToken: token }),
  }).catch(console.error);

const removeToken = () =>
  fetch(API, { method: 'DELETE', headers: authHeader() }).catch(console.error);

export function useNotificationPermission() {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  const check = useCallback(async () => {
    const status = await hasPermission(m());
    console.log('[FCM] Permission status on check:', status);
    setEnabled(
      status === AuthorizationStatus.AUTHORIZED ||
      status === AuthorizationStatus.PROVISIONAL
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    check();
    const sub = AppState.addEventListener('change', (s) => {
      if (s === 'active') check();
    });
    return () => sub.remove();
  }, []);

  const toggle = async (value) => {
    setLoading(true);
    const messaging = m();
    console.log('[FCM] Toggle called, value:', value);

    if (!value) {
      await deleteToken(messaging);
      setEnabled(false);
      setLoading(false);
      return;
    }

    const status = await hasPermission(messaging);
    console.log('[FCM] Permission status:', status);
    // 0=NOT_DETERMINED 1=AUTHORIZED 2=DENIED 3=PROVISIONAL

    if (status === AuthorizationStatus.DENIED) {
      console.log('[FCM] ❌ Permission DENIED');
      Alert.alert(
        'Notifications Blocked',
        'Go to Settings → Preachly → Notifications and turn them on.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openURL('app-settings:') },
        ]
      );
      setLoading(false);
      return;
    }

    if (status === AuthorizationStatus.NOT_DETERMINED) {
      console.log('[FCM] Requesting permission...');
      const result = await requestPermission(messaging);
      console.log('[FCM] Permission result:', result);
      const granted =
        result === AuthorizationStatus.AUTHORIZED ||
        result === AuthorizationStatus.PROVISIONAL;
      if (!granted) {
        console.log('[FCM] ❌ Permission not granted');
        setEnabled(false);
        setLoading(false);
        return;
      }
    }

    console.log('[FCM] Getting APNs token...');
    const apns = await getAPNSToken(messaging);
    console.log('[FCM] APNs token:', apns); // null = problem!

    if (!apns) {
      console.log('[FCM] ❌ No APNs token — retrying in 2s...');
      setTimeout(() => toggle(true), 2000);
      return;
    }

    console.log('[FCM] Getting FCM token...');
    const token = await getToken(messaging);
    console.log('[FCM] ✅ FCM Token:', token); // if null = Firebase config issue

    if (!token) {
      console.log('[FCM] ❌ FCM token is null — check GoogleService-Info.plist');
      setLoading(false);
      return;
    }

    onTokenRefresh(messaging, saveToken);
    setEnabled(true);
    setLoading(false);
  };

  return { enabled, loading, toggle };
}