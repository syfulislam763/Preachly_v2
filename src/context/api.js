// api.js
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { ROOT_URL, TOKEN_URL } from './Paths';
import { handleToast } from '../screens/auth/AuthAPI';
import useAppStore from './useAppStore';
import { syncSubscriptionStatus } from './Subscriptionservice';

import { createNavigationContainerRef } from '@react-navigation/native';
export const navigationRef = createNavigationContainerRef();

function navigateTo(name, params) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(name, params);
  }
}

const api = axios.create({
  baseURL: ROOT_URL,
});


// Add any public endpoints here so they don't get blocked
const SUBSCRIPTION_FREE_ROUTES = [
  '/auth/login',
  '/auth/register',
  '/auth/refresh',
  '/auth/logout',
  '/user/profile',       
];

function isSubscriptionFreeRoute(url = '') {
  return SUBSCRIPTION_FREE_ROUTES.some((route) => url.includes(route));
}

api.interceptors.request.use(
  async (config) => {

    if (isSubscriptionFreeRoute(config.url)) {
      return config;
    }

    const { payment, setPayment } = useAppStore.getState();
    const cachedActive = payment.has_subscription;

    console.log("is payment", cachedActive)

    if (!cachedActive) {

      const realActive = await syncSubscriptionStatus();

      if (!realActive) {
        // Cancel the request and redirect
        //navigateTo('Subscription');

        const controller = new AbortController();
        controller.abort();
        return { ...config, signal: controller.signal };
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;

    if (status === 523) {
      // Network/server error — silent
    }

    if (status === 401) {
      delete api.defaults.headers.common['Authorization'];
      await AsyncStorage.clear();
      useAppStore.getState().logout();
      useAppStore.getState().clearPayment();
      // handleToast('error', 'Session expired. Please log in again.', 2000, () => {});
      // navigateTo('Login');
    }

    

    return Promise.reject(error);
  }
);

// ─── Auth helpers (unchanged) ──────────────────────────────────────────────
export const loadAuthToken = async (cb) => {
  const accessToken = await AsyncStorage.getItem('accessToken');
  const refreshToken = await AsyncStorage.getItem('refreshToken');
  const store = await AsyncStorage.getItem('store');

  if (accessToken) {
    api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  }
  cb({
    accessToken,
    refreshToken,
    store: store ? JSON.parse(store) : null,
  });
};

export const getNewAccessToken = async (refreshToken) => {
  try {
    const response = await api.post(TOKEN_URL, { refreshToken });
    const { accessToken } = response.data;
    await setAuthToken(accessToken, refreshToken, () => {});
    return accessToken;
  } catch (error) {
    console.error('Error getting new access token:', error);
    throw error;
  }
};

export const setAuthToken = async (accessToken, refreshToken, cb) => {
  await AsyncStorage.setItem('accessToken', accessToken);
  await AsyncStorage.setItem('refreshToken', refreshToken);
  api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
  cb && cb();
};

export const logoutUser = async (cb) => {
  await AsyncStorage.removeItem('accessToken');
  await AsyncStorage.removeItem('refreshToken');
  await AsyncStorage.removeItem('store');
  await AsyncStorage.clear();
  delete api.defaults.headers.common['Authorization'];
  useAppStore.getState().logout();
  useAppStore.getState().clearPayment();
  cb && cb();
};

export default api;