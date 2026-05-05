import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ImageBackground,
  Dimensions,
  ScrollView,
  Alert,
  ActivityIndicator,
  Linking,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Purchases, { LOG_LEVEL, PURCHASES_ERROR_CODE } from 'react-native-purchases';

import { useAuth } from '../../context/AuthContext';
import CommonButton from '../../components/CommonButton';
import PlanSelector from '../../components/SubscriptionPlan';
import ParagraphIcon from '../../components/ParagraphIcon';
import ReusableNavigation from '../../components/ReusabeNavigation';
import useAppStore from '@/context/useAppStore';
import { useNotificationPermission } from '@/context/fcm';
import { REVENUECAT_IOS_API_KEY, PREMIUM_ENTITLEMENT_ID } from '@/context/Paths';


const REVENUECAT_ANDROID_API_KEY = ""
// ────────────────────────────────────────────────────────────────────────────

const { height } = Dimensions.get('window');

const TERMS_URL = 'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/';
const PRIVACY_URL = 'https://yourapp.com/privacy-policy'; // ← update this

export default function SubscriptionScreen() {
  
  const navigation = useNavigation();
  const setPayment = useAppStore((s) => s.setPayment);
  const auth = useAppStore((s) => s.auth);
  const logout = useAppStore((s) => s.logout)
  const { enabled } = useNotificationPermission();
  const userProfile = auth?.user;
  console.log("Auth ", JSON.stringify(auth, null, 2))

  // ─── Plan selection state ─────────────────────────────────────────────────
  // 'monthly' | 'yearly'  (maps to RevenueCat monthly / annual packages)
  const [selectedPlanType, setSelectedPlanType] = useState('yearly');

  // ─── RevenueCat state ─────────────────────────────────────────────────────
  const [isLoading, setIsLoading] = useState(true);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Separate packages for each plan
  const [monthlyPackage, setMonthlyPackage] = useState(null);
  const [annualPackage, setAnnualPackage] = useState(null);

  // Intro / trial offers per plan
  const [monthlyIntroOffer, setMonthlyIntroOffer] = useState(null);
  const [annualIntroOffer, setAnnualIntroOffer] = useState(null);

  const [subscriptionInfo, setSubscriptionInfo] = useState(null);

  // ─── Derived helpers ──────────────────────────────────────────────────────
  const activePackage = selectedPlanType === 'monthly' ? monthlyPackage : annualPackage;
  const activeIntroOffer = selectedPlanType === 'monthly' ? monthlyIntroOffer : annualIntroOffer;
  const isFreeIntro = activeIntroOffer?.price === 0;

  // ─── Initialise RevenueCat on mount ──────────────────────────────────────
  useEffect(() => {
    initializeRevenueCat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initializeRevenueCat = async () => {
    try {
      // Logging
      if (__DEV__) {
        Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
      } else {
        Purchases.setLogLevel(LOG_LEVEL.ERROR);
      }

      // Configure SDK
      if (Platform.OS === 'ios') {
        Purchases.configure({ apiKey: REVENUECAT_IOS_API_KEY });
      } else if (Platform.OS === 'android') {
        Purchases.configure({ apiKey: REVENUECAT_ANDROID_API_KEY });
      }

      // Identify user
      await identifyUser();

      // Check existing subscription
      await checkSubscriptionStatus();

      // Fetch offerings (packages + intro eligibility)
      await fetchOfferings();
    } catch (error) {
      console.error('RevenueCat init error:', error);
      Alert.alert('Error', 'Failed to load subscription plans. Please restart the app.');
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Identify user with RevenueCat ───────────────────────────────────────
  const identifyUser = async () => {
    try {
      const user = userProfile?.user;
      if (user?.email) {
        await Purchases.logIn(user.email);

        // Optional: sync attributes
        if (user.email) await Purchases.setEmail(user.email);
        if (user.name) await Purchases.setDisplayName(user.name);
        await Purchases.setAttributes({
          user_id: user._id || user.uid || '',
          signup_date: user.createdAt || new Date().toISOString(),
          user_type: user.role || 'standard',
        });
      }
    } catch (error) {
      console.error('RevenueCat identify error:', error);
    }
  };

  // ─── Check if already subscribed ─────────────────────────────────────────
  const checkSubscriptionStatus = async () => {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      const active = customerInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID]?.isActive === true;
      setIsSubscribed(active);
      setSubscriptionInfo(customerInfo);
      if(active) {
        setPayment({ has_subscription: true });
      }

      return active;
    } catch (error) {
      console.error('checkSubscriptionStatus error:', error);
      return false;
    }
  };

  // ─── Strict intro-offer eligibility check ────────────────────────────────
  const checkIntroEligibility = async (pkg) => {
    try {
      const productId = pkg.product.identifier;
      const eligibilityMap = await Purchases.checkTrialOrIntroductoryPriceEligibility([productId]);
      const introStatus = eligibilityMap[productId]?.status;

      const customerInfo = await Purchases.getCustomerInfo();
      const hasPastEntitlements = Object.keys(customerInfo.entitlements.all).length > 0;
      const hasPurchasedBefore = customerInfo.allPurchaseDates[productId] !== undefined;

      // status 2 = ELIGIBLE; must also have no prior entitlements / purchases
      return introStatus === 2 && !hasPastEntitlements && !hasPurchasedBefore;
    } catch (error) {
      console.error('Eligibility check error:', error);
      return false;
    }
  };

  // ─── Fetch offerings from RevenueCat ─────────────────────────────────────
  const fetchOfferings = async () => {
    try {
      const offerings = await Purchases.getOfferings();

      console.log("offerings ", JSON.stringify(offerings, null, 2))
      if (!offerings.current || offerings.current.availablePackages.length === 0) {
        console.warn('No offerings available');
        return;
      }

      const { current } = offerings;

      // Monthly package
      const monthly = current.monthly || null;
      if (monthly) {
        setMonthlyPackage(monthly);
        if (monthly.product.introPrice) {
          const eligible = await checkIntroEligibility(monthly);
          if (eligible) setMonthlyIntroOffer(monthly.product.introPrice);
        }
      }

      // Annual package
      const annual = current.annual || null;
      if (annual) {
        setAnnualPackage(annual);
        if (annual.product.introPrice) {
          const eligible = await checkIntroEligibility(annual);
          if (eligible) setAnnualIntroOffer(annual.product.introPrice);
        }
      }

      // Fallback: if specific keys don't exist, spread all available packages
      if (!monthly && !annual && current.availablePackages.length > 0) {
        // Try to guess monthly vs annual by period
        current.availablePackages.forEach((pkg) => {
          const period = pkg.packageType; // 'MONTHLY' | 'ANNUAL' | 'SIX_MONTH' etc.
          if (period === 'MONTHLY') setMonthlyPackage(pkg);
          else if (period === 'ANNUAL') setAnnualPackage(pkg);
        });
      }
    } catch (error) {
      console.error('fetchOfferings error:', error);
    }
  };

  // ─── Handle purchase ──────────────────────────────────────────────────────
  const handleSubscription = async () => {
    if (!activePackage) {
      Alert.alert('Unavailable', 'Subscription package is not available right now. Please try again.');
      return;
    }

    const user = userProfile;
    if (!user?.email) {
      Alert.alert(
        'Login Required',
        'Please log in to subscribe.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Log In', onPress: () => navigation.navigate('Login') },
        ]
      );
      return;
    }

    setIsPurchasing(true);
    try {
      const { customerInfo } = await Purchases.purchasePackage(activePackage);
      const hasAccess = customerInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID]?.isActive === true;

      if (hasAccess) {
        setIsSubscribed(true);
        setSubscriptionInfo(customerInfo);
        // userProfile?.setIsSubscribed?.(true);
        // userProfile?.setSubscriptionInfo?.(customerInfo);
        // setPayment({ has_subscription: true });

        // Alert.alert(
        //   'Welcome!',
        //   isFreeIntro
        //     ? `Your free trial has started! Enjoy ${getTrialPeriodText()} free.`
        //     : 'Your subscription is now active. Enjoy premium access!',
        //   [{ text: 'Continue', onPress: () => navigation.navigate('SubscriptionConfirmedScreen') }]
        // );
      } else {
        // Access not immediately confirmed — poll
        Alert.alert('Processing', 'Purchase received. Verifying your access...');
        setTimeout(async () => {
          const active = await checkSubscriptionStatus();
          //if (active) navigation.navigate('SubscriptionConfirmedScreen');
        }, 2500);
      }
    } catch (error) {
      handlePurchaseError(error);
    } finally {
      setIsPurchasing(false);
    }
  };

  // ─── Purchase error handler ───────────────────────────────────────────────
  const handlePurchaseError = (error) => {
    if (error.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) {
      // User cancelled — no alert needed
      return;
    }
    if (error.code === PURCHASES_ERROR_CODE.PURCHASE_NOT_ALLOWED_ERROR) {
      Alert.alert('Not Allowed', 'In-app purchases are disabled on this device.');
    } else if (error.code === PURCHASES_ERROR_CODE.PAYMENT_PENDING_ERROR) {
      Alert.alert('Payment Pending', 'Your payment is being processed. Check back shortly.');
    } else {
      Alert.alert('Purchase Failed', error.message || 'Something went wrong. Please try again.');
    }
  };

  // ─── Restore purchases ────────────────────────────────────────────────────
  const handleRestorePurchases = async () => {
    setIsPurchasing(true);
    try {
      const customerInfo = await Purchases.restorePurchases();
      const active = customerInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID]?.isActive === true;
      if (active) {
        setIsSubscribed(true);
        setSubscriptionInfo(customerInfo);
        // userProfile?.setIsSubscribed?.(true);
        // userProfile?.setSubscriptionInfo?.(customerInfo);
        Alert.alert('Restored!', 'Your subscription has been restored.');
        navigation.navigate('SubscriptionConfirmedScreen');
      } else {
        Alert.alert('Nothing Found', 'No active subscriptions were found for this account.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to restore purchases. Please try again.');
    } finally {
      setIsPurchasing(false);
    }
  };

  // ─── Helpers ──────────────────────────────────────────────────────────────
  const getTrialPeriodText = useCallback(() => {
    if (!activeIntroOffer) return 'Free Trial Expired';
    const { periodNumberOfUnits: count, periodUnit } = activeIntroOffer;
    switch (periodUnit) {
      case 'DAY':   return count === 1 ? '1-Day Free Trial'   : `${count} Days Free Trial`;
      case 'WEEK':  return count === 1 ? '7-Day Free Trial'  : `${count} Weeks Free Trial`;
      case 'MONTH': return count === 1 ? '30-Day Free Trial' : `${count} Months Free Trial`;
      case 'YEAR':  return count === 1 ? '1 Year Free Trial'  : `${count} Years Free Trial`;
      default:      return activeIntroOffer.period;
    }
  }, [activeIntroOffer]);

  const getCtaText = () => {
    if (isPurchasing) return null; // shows spinner
    if (isFreeIntro) return `Start My Free Trial`;
    if (activeIntroOffer) return `Try for ${activeIntroOffer.priceString}`;
    return 'Subscribe';
  };

  const getPriceForPlan = (planType) => {
    const pkg = planType === 'monthly' ? monthlyPackage : annualPackage;
    if (!pkg) return null;
    return pkg.product.priceString;
  };

  // ─── Loading state ────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <SafeAreaView edges={['top']} className="flex-1 bg-[#FFEAC2]">
        <ReusableNavigation
          backgroundStyle={{ backgroundColor: '#FFE9BD' }}
          leftComponent={() => <Text />}
          middleComponent={() => (
            <Text style={{ fontFamily: 'NunitoSemiBold', color: '#0B172A', fontSize: 18 }}>
              Subscription
            </Text>
          )}
          RightComponent={() => <Text />}
        />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#005A55" />
          <Text style={{ fontFamily: 'NunitoSemiBold', color: '#0B172A', marginTop: 12, fontSize: 15 }}>
            Loading plans...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ─── Subscribed state ─────────────────────────────────────────────────────
  if (isSubscribed) {
    return (
      <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-[white]">
        <ReusableNavigation
          backgroundStyle={{ backgroundColor: 'white' }}
          leftComponent={() => <Text />}
          middleComponent={() => (
            <Text style={{ fontFamily: 'NunitoSemiBold', color: '#0B172A', fontSize: 18 }}>
              Subscription
            </Text>
          )}
          RightComponent={() => <Text />}
        />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <Text style={{ fontFamily: 'DMSerifDisplay', fontSize: 28, color: '#0B172A', textAlign: 'center', marginBottom: 12 }}>
            You're all set! 
          </Text>
          <Text style={{ fontFamily: 'NunitoSemiBold', fontSize: 16, color: '#005A55', textAlign: 'center' }}>
            Premium access is active.
          </Text>
          {subscriptionInfo?.latestExpirationDate && (
            <Text style={{ fontFamily: 'NunitoSemiBold', color: '#555', marginTop: 8, fontSize: 13 }}>
              {subscriptionInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID]?.willRenew
                ? 'Next billing: '
                : 'Access until: '}
              {new Date(subscriptionInfo.latestExpirationDate).toLocaleDateString()}
            </Text>
          )}
          
        </View>
        <View className='px-5'>
          <CommonButton
            btnText="Continue"
            bgColor="#005A55"
            navigation={navigation}
            route=""
            handler={() => navigation.navigate('SubscriptionConfirmedScreen')}
            //handler={() => logout()}
            txtColor="#fff"
          />
        </View>
      </SafeAreaView>
    );
  }

  // ─── Main UI ──────────────────────────────────────────────────────────────
  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-[#FFEAC2]">

      {/* Navigation header */}
      <ReusableNavigation
        backgroundStyle={{ backgroundColor: '#FFE9BD' }}
        leftComponent={() => <Text />}
        middleComponent={() => (
          <Text
            style={{ fontFamily: 'NunitoSemiBold', color: '#0B172A', fontSize: 18 }}
          >
            Subscription
          </Text>
        )}
        RightComponent={() => <Text className='ml-12' />}
      />

      <View className="flex-1 relative">

        {/* Background image */}
        <ImageBackground
          source={require('../../../assets/img/bg_large2.png')}
          style={{ height: height * 0.28, width: '100%' }}
          resizeMode="cover"
        >
          <Text
            style={{ fontFamily: 'DMSerifDisplay', lineHeight: 35 }}
            className="text-[32px] text-[#0B172A] text-center px-8 pt-2"
          >
            Inspired Answers, When You're Lost for Words
          </Text>
        </ImageBackground>

        {/* Content card */}
        <ScrollView
          style={{
            position: 'absolute',
            top: height * 0.22,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#fff',
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
          }}
          contentContainerStyle={{ padding: 20, paddingBottom: 60 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Feature bullets */}
          <ParagraphIcon
            icon={require('../../../assets/img/24-sunset.png')}
            text="Know what to say when faith conversations matter most"
          />
          <ParagraphIcon
            icon={require('../../../assets/img/bird.png')}
            text="Understand scripture with clarity and context"
          />
          <ParagraphIcon
            icon={require('../../../assets/img/piramid.png')}
            text="Share what you believe with confidence"
          />

          {/* ── Plan Selector ── */}
          {/*
            PlanSelector now receives live price strings from RevenueCat.
            Pass them as props so the component can display real prices
            instead of hardcoded ones.
          */}
          <PlanSelector
            plan={selectedPlanType}
            setSelectedPlanType={setSelectedPlanType}
            isSubscribed={false}
            monthlyPrice={getPriceForPlan('monthly')}   // e.g. "$11.99"
            annualPrice={getPriceForPlan('yearly')}     // e.g. "$79.99"
            monthlyTrialText={
              monthlyIntroOffer?.price === 0
                ? `${getTrialPeriodText()} Free Trial`
                : null
            }
            annualTrialText={
              annualIntroOffer?.price === 0
                ? `${getTrialPeriodText()} Free Trial`
                : null
            }
          />

          {/* ── CTA Button ── */}
          <CommonButton
            btnText={
              isPurchasing
                ? <ActivityIndicator color="#fff" />
                : getCtaText()
            }
            bgColor="#005A55"
            navigation={navigation}
            route=""
            handler={handleSubscription}
            //handler={() => logout()}
            txtColor="#fff"
            opacity={isPurchasing || !activePackage ? 0.6 : 1}
            disabled={isPurchasing || !activePackage}
          />

          {/* ── Restore Purchases ── */}
          {/* <Text
            onPress={handleRestorePurchases}
            style={{
              fontFamily: 'NunitoSemiBold',
              color: '#005A55',
              textAlign: 'center',
              textDecorationLine: 'underline',
              fontSize: 13,
              marginTop: 12,
            }}
          >
            Restore Purchases
          </Text> */}

          {/* ── Legal footer ── */}
          <Text
            style={{ fontFamily: 'NunitoSemiBold' }}
            className="text-base text-[#90B2B2] text-center px-4 py-5"
          >
            Cancel anytime. Subscription auto-renews. By subscribing, you agree to our{' '}
            <Text
              style={{ fontFamily: 'NunitoExtraBold', textDecorationLine: 'underline', color: '#555' }}
              onPress={() => Linking.openURL(TERMS_URL)}
            >
              Terms of Use
            </Text>
            {' '}and{' '}
            <Text
              style={{ fontFamily: 'NunitoExtraBold', textDecorationLine: 'underline', color: '#555' }}
              onPress={() => Linking.openURL(PRIVACY_URL)}
            >
              Privacy Policy
            </Text>
            .
          </Text>

        </ScrollView>
      </View>
    </SafeAreaView>
  );
}