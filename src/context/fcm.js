import messaging from '@react-native-firebase/messaging';
import * as Notifications from 'expo-notifications';
import { AppState, Linking, Platform, Alert } from 'react-native';
import { useEffect, useState, useCallback } from 'react';

// ─── Show notification when app is open ───────────────────────────────────────
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// ─── Call once in App.js ──────────────────────────────────────────────────────
export function initFCM() {
  // Android channel
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'Default',
      importance: Notifications.AndroidImportance.MAX,
      sound: 'default',
    });
  }

  // Foreground: show notification manually
  messaging().onMessage(async ({ notification, data }) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: notification?.title ?? 'Preachly',
        body: notification?.body ?? '',
        data: data ?? {},
        sound: 'default',
      },
      trigger: null,
    });
  });

  // Background/killed tap: handle navigation
  messaging().onNotificationOpenedApp(({ data }) => handleNav(data));
  messaging().getInitialNotification().then((msg) => {
    if (msg) setTimeout(() => handleNav(msg.data), 1000);
  });

  // Background message handler (required)
  messaging().setBackgroundMessageHandler(async () => {});
}

// ─── Navigation on tap ────────────────────────────────────────────────────────
function handleNav(data) {
  if (!data?.screen) return;
  // Replace with your navigationRef.navigate(data.screen, data)
  console.log('[FCM] Navigate to:', data.screen, data);
}

// ─── Save/remove token on backend ─────────────────────────────────────────────
async function saveToken(token) {
  // Replace URL and auth header with yours
  await fetch('https://your-backend.com/api/user/fcm-token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer YOUR_TOKEN`,
    },
    body: JSON.stringify({ fcmToken: token }),
  }).catch(console.error);
}

async function deleteToken() {
  await fetch('https://your-backend.com/api/user/fcm-token', {
    method: 'DELETE',
    headers: { Authorization: `Bearer YOUR_TOKEN` },
  }).catch(console.error);
}

// ─── Hook: use this in your permission toggle component ───────────────────────
export function useNotificationPermission() {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  const check = useCallback(async () => {
    const s = await messaging().hasPermission();
    setEnabled(
      s === messaging.AuthorizationStatus.AUTHORIZED ||
      s === messaging.AuthorizationStatus.PROVISIONAL
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    check();
    const sub = AppState.addEventListener('change', (s) => {
      if (s === 'active') check(); // re-check when returning from Settings
    });
    return () => sub.remove();
  }, []);

  const toggle = async (value) => {
    setLoading(true);

    if (!value) {
      // Turn OFF → delete token
      await messaging().deleteToken();
      await deleteToken();
      setEnabled(false);
      setLoading(false);
      return;
    }

    // Turn ON → check permission state
    const status = await messaging().hasPermission();

    if (status === messaging.AuthorizationStatus.DENIED) {
      // Already hard-denied → must go to device settings
      Alert.alert(
        'Notifications Blocked',
        'Enable notifications from your device settings.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Open Settings',
            onPress: () =>
              Platform.OS === 'ios' ? Linking.openURL('app-settings:') : Linking.openSettings(),
          },
        ]
      );
      setLoading(false);
      return;
    }

    // Not determined → ask; or already granted → skip ask
    if (status === messaging.AuthorizationStatus.NOT_DETERMINED) {
      const result = await messaging().requestPermission();
      const granted =
        result === messaging.AuthorizationStatus.AUTHORIZED ||
        result === messaging.AuthorizationStatus.PROVISIONAL;
      if (!granted) { setLoading(false); return; }
    }

    // Get token and save
    const token = await messaging().getToken();
    await saveToken(token);
    messaging().onTokenRefresh(saveToken); // keep token fresh
    setEnabled(true);
    setLoading(false);
  };

  return { enabled, loading, toggle };
}