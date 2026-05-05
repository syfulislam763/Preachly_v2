// services/subscriptionService.js
import Purchases, { LOG_LEVEL } from 'react-native-purchases';
import { Platform } from 'react-native';
import useAppStore from './useAppStore';
import { PREMIUM_ENTITLEMENT_ID, REVENUECAT_IOS_API_KEY } from './Paths';

const REVENUECAT_ANDROID_API_KEY = ''; // add yours
const CACHE_TTL_MS = 5 * 60 * 1000;   // 5 minutes

let isConfigured = false;

export async function configureRevenueCat(userEmail) {
  try {
    if (__DEV__) {
      Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
    } else {
      Purchases.setLogLevel(LOG_LEVEL.ERROR);
    }

    if (!isConfigured) {
      if (Platform.OS === 'ios') {
        Purchases.configure({ apiKey: REVENUECAT_IOS_API_KEY });
      } else if (Platform.OS === 'android') {
        Purchases.configure({ apiKey: REVENUECAT_ANDROID_API_KEY });
      }
      isConfigured = true;
    }

    if (userEmail) {
      await Purchases.logIn(userEmail);
    }
  } catch (error) {
    console.error('[subscriptionService] configureRevenueCat error:', error);
  }
}


export async function syncSubscriptionStatus(force = false) {
  const { payment, setPayment, auth } = useAppStore.getState();

  if (!force && payment.last_checked) {
    const age = Date.now() - payment.last_checked;
    if (age < CACHE_TTL_MS && payment.has_subscription !== null) {
      return payment.has_subscription;
    }
  }

  try {
    const userEmail = auth?.user?.email;
    await configureRevenueCat(userEmail);

    const customerInfo = await Purchases.getCustomerInfo();
    const entitlement = customerInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID];
    const isActive = entitlement?.isActive === true;

    setPayment({
      has_subscription: isActive,
      expiry_date: customerInfo.latestExpirationDate ?? null,
      will_renew: entitlement?.willRenew ?? false,
      product_identifier: entitlement?.productIdentifier ?? null,
      last_checked: Date.now(),
    });

    return isActive;
  } catch (error) {
    console.error('[subscriptionService] syncSubscriptionStatus error:', error);

    return payment.has_subscription;
  }
}


export function isSubscribedSync() {
  return useAppStore.getState().payment.has_subscription === true;
}