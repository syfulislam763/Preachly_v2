import {
  getMessaging,
  onMessage,
  onTokenRefresh,
  getToken,
  deleteToken,
  onNotificationOpenedApp,
  getInitialNotification,
  requestPermission,
  hasPermission,
  AuthorizationStatus,
  getAPNSToken,
  setBackgroundMessageHandler
} from '@react-native-firebase/messaging';
import notifee from '@notifee/react-native'; 
import { AppState, Linking, Alert, Platform } from 'react-native';
import { useEffect, useState, useCallback } from 'react';
import api from './api';

const m = () => getMessaging();

const API = '/notifications/fcm-tokens/';
const authHeader = () => ({ Authorization: `Bearer YOUR_TOKEN` });

const saveToken = (token) => {
  return api.post(API, {token: token, device_type: Platform.OS});
}

const getSavedToken = async () => {
  const res = await api.get(API);
  console.log("saved token -> ", JSON.stringify(res.data, null, 2))
}



const removeToken = (tokenId) => api.delete(API+tokenId+"/")

function handleNav(data) {
  if (!data?.screen) return;
  console.log('[FCM] Navigate to:', data.screen, data);
  // navigationRef.navigate(data.screen, data)
}

//Show foreground notification via Notifee
async function showNotification(title, body, data = {}) {
  if (Platform.OS === 'ios') {
    await notifee.displayNotification({
      title: title ?? 'Preachly',
      body: body ?? '',
      data,
      ios: {
        sound: 'default',
        foregroundPresentationOptions: {
          alert: true,
          badge: true,
          sound: true,
          banner: true,
          list: true,
        },
      },
    });
  } else {
    // Android needs a channel
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default',
    });
    await notifee.displayNotification({
      title: title ?? 'Preachly',
      body: body ?? '',
      data,
      android: {
        channelId,
        sound: 'default',
        pressAction: { id: 'default' },
      },
    });
  }
}

let fcmInitialized = false;

export function initFCM() {
  if (fcmInitialized) return;
  fcmInitialized = true;

  const messaging = m();

  onMessage(messaging, async (remoteMessage) => {
    console.log('[FCM] Foreground message:', remoteMessage);
    const { title, body } = remoteMessage.notification ?? {};
    await showNotification(title, body, remoteMessage.data);
  });

  onNotificationOpenedApp(messaging, ({ data }) => handleNav(data));

  getInitialNotification(messaging).then((msg) => {
    if (msg) setTimeout(() => handleNav(msg.data), 1000);
  });

  setBackgroundMessageHandler(messaging, async () => {});
}

// Hook
export function useNotificationPermission() {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  const check = useCallback(async () => {
    const status = await hasPermission(m());
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

    if (!value) {
      await deleteToken(messaging);
      // await removeToken();
      setEnabled(false);
      setLoading(false);
      return;
    }

    const status = await hasPermission(messaging);

    if (status === AuthorizationStatus.DENIED) {
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
      const result = await requestPermission(messaging);
      const granted =
        result === AuthorizationStatus.AUTHORIZED ||
        result === AuthorizationStatus.PROVISIONAL;
      if (!granted) {
        setEnabled(false);
        setLoading(false);
        return;
      }
    }

    const apns = await getAPNSToken(messaging);
    if (!apns) {
      setTimeout(() => toggle(true), 2000);
      return;
    }

    const token = await getToken(messaging);
    if (!token) {
      setLoading(false);
      return;
    }

    console.log('[FCM] FCM Token:', token);
    try{
      const res = await saveToken(token);
      console.log("[FCM] token saved", JSON.stringify(res.data, null, 2))
    }catch(e){
      // console.log("[FCM] token not saved", JSON.stringify(e, null, 2))
      console.log("[FCM] token not saved", e.message)
    }
    getSavedToken();
    onTokenRefresh(messaging, saveToken);
    setEnabled(true);
    setLoading(false);
  };

  return { enabled, loading, toggle };
}