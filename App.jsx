import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import { AuthProvider } from './src/context/AuthContext';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import FontLoader from './src/components/FontLoader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';
import Toast from 'react-native-toast-message';
import { StatusBar } from 'react-native';
import 'global.css'
import { initFCM } from '@/context/fcm';
import { getMessaging, setBackgroundMessageHandler } from '@react-native-firebase/messaging';
import { PREMIUM_ENTITLEMENT_ID } from '@/context/Paths';
import useAppStore from '@/context/useAppStore';
import { configureRevenueCat, syncSubscriptionStatus } from '@/context/Subscriptionservice';
import { navigationRef } from '@/context/api';


setBackgroundMessageHandler(getMessaging(), async () => {});

export default function App() {
  const auth = useAppStore((s) => s.auth);
  const setPayment = useAppStore((s) => s.setPayment);

  useEffect(() => {
    initFCM();
  }, [])
 
  useEffect(() => {

    if (!auth?.user?.email) return;
 
    let customerInfoListener;
 
    const setup = async () => {

      await configureRevenueCat(auth.user.email);
 
      await syncSubscriptionStatus(true);
 
      customerInfoListener = Purchases.addCustomerInfoUpdateListener(
        (customerInfo) => {
          const entitlement = customerInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID];
          const isActive = entitlement?.isActive === true;
 
          setPayment({
            has_subscription: isActive,
            expiry_date: customerInfo.latestExpirationDate ?? null,
            will_renew: entitlement?.willRenew ?? false,
            product_identifier: entitlement?.productIdentifier ?? null,
            last_checked: Date.now(),
          });
 
          // if (!isActive && navigationRef.isReady()) {
          //   navigationRef.navigate('Subscription');
          // }
        }
      );
    };
 
    setup();
 
    return () => {
      customerInfoListener?.remove();
    };
  }, [auth?.user?.email]); 
  
  return (
    <FontLoader>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <AuthProvider>
            <View style={{flex:1}}>
              <StatusBar translucent={false} backgroundColor="#ffffff" barStyle="dark-content" />
              <RootNavigator />
            </View>
          </AuthProvider>
        </NavigationContainer>
      </GestureHandlerRootView>
      <Toast/>
    </FontLoader>
  );
}