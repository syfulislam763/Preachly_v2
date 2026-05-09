
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Purchases, { PURCHASES_ERROR_CODE } from 'react-native-purchases';
import CommonButton from '@/components/CommonButton';

import ReusableNavigation from '@/components/ReusabeNavigation';
import BackButton from '@/components/BackButton';
import useAppStore from '@/context/useAppStore';
import { REVENUECAT_IOS_API_KEY, PREMIUM_ENTITLEMENT_ID } from '@/context/Paths';
import ParagraphIcon from '@/components/ParagraphIcon';


const REVENUECAT_ANDROID_API_KEY = '';
const TERMS_URL = 'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/';
const MANAGE_URL = 'https://apps.apple.com/account/subscriptions';




const PlanCard = ({ title, label, price, period, trialText, selected, onPress, saveBadge, disabled, type, active, opacity=1 }) => (
  <TouchableOpacity
        style={[
          planCardStyles.planContainer,
          selected === 'monthly' && planCardStyles.selectedPlan,
          {opacity: opacity}
        ]}
        onPress={onPress}
        disabled={true}
      >
        <View style={{ flex: 1 }}>
          <Text style={planCardStyles.planTitle}>{title}</Text>
          <Text style={planCardStyles.subText}>
            {trialText}
          </Text>
        </View>

        <View style={planCardStyles.rightSection}>
          <Text style={planCardStyles.priceText}>
            {`${price}${period}`}
          </Text>
          <View style={[
            planCardStyles.radioOuter,
            active === type ? planCardStyles.radioOuterSelected: '',
          ]}>
            {active === type && <View style={planCardStyles.radioInner} />}
          </View>
        </View>

        {(type == 'yearly') && (
                  <View style={planCardStyles.badge}>
                    <Text style={planCardStyles.badgeText}>{saveBadge}</Text>
                  </View>
                )}
      </TouchableOpacity>
);


const Bullet = ({ icon, text }) => (
  <View style={styles.bulletRow}>
    <Image source={icon} style={styles.bulletIcon} />
    <Text style={styles.bulletText}>{text}</Text>
  </View>
);


function getSavingsLabel(monthlyStr, annualStr) {
  const parse = (s) => {
    if (!s) return null;
    const n = parseFloat(s.replace(/[^0-9.]/g, ''));
    return isNaN(n) ? null : n;
  };
  const m = parse(monthlyStr);
  const a = parse(annualStr);
  if (m && a) {
    const saving = ((m - a / 12) / m) * 100;
    if (saving > 0) return `Saved ${Math.round(saving)}%`;
  }
  return 'Saved 44%';
}

export default function ProfileSubscription() {
  const navigation = useNavigation();
  const setPayment  = useAppStore((s) => s.setPayment);
  const auth        = useAppStore((s) => s.auth);
  const userProfile = auth?.user;


  const [selectedPlanType, setSelectedPlanType] = useState('yearly');

  const [isLoading,         setIsLoading]         = useState(true);
  const [isPurchasing,      setIsPurchasing]       = useState(false);
  const [isSubscribed,      setIsSubscribed]       = useState(false);
  const [isNewlySubscribed, setIsNewlySubscribed]  = useState(false);
  const [monthlyPackage,    setMonthlyPackage]     = useState(null);
  const [annualPackage,     setAnnualPackage]      = useState(null);
  const [monthlyIntroOffer, setMonthlyIntroOffer]  = useState(null);
  const [annualIntroOffer,  setAnnualIntroOffer]   = useState(null);
  const [subscriptionInfo,  setSubscriptionInfo]   = useState(null);


  const activePackage    = selectedPlanType === 'monthly' ? monthlyPackage : annualPackage;
  const activeIntroOffer = selectedPlanType === 'monthly' ? monthlyIntroOffer : annualIntroOffer;
  const isFreeIntro      = activeIntroOffer?.price === 0;

  useEffect(() => { initializeRevenueCat(); }, []);

  const initializeRevenueCat = async () => {
    try {
      if (Platform.OS === 'ios') Purchases.configure({ apiKey: REVENUECAT_IOS_API_KEY });
      else Purchases.configure({ apiKey: REVENUECAT_ANDROID_API_KEY });
      await identifyUser();
      await checkSubscriptionStatus();
      await fetchOfferings();
    } catch (e) {
      console.error('RevenueCat init error:', e);
      Alert.alert('Error', 'Failed to load subscription plans. Please restart the app.');
    } finally {
      setIsLoading(false);
    }
  };

  const identifyUser = async () => {
    try {
      const user = userProfile?.user;
      if (user?.email) {
        await Purchases.logIn(user.email);
        if (user.email) await Purchases.setEmail(user.email);
        if (user.name)  await Purchases.setDisplayName(user.name);
        await Purchases.setAttributes({
          user_id:     user._id || user.uid || '',
          signup_date: user.createdAt || new Date().toISOString(),
          user_type:   user.role || 'standard',
        });
      }
    } catch (e) { console.error('identifyUser error:', e); }
  };

  const checkSubscriptionStatus = async () => {
    try {
      const info   = await Purchases.getCustomerInfo();
      const active = info.entitlements.active[PREMIUM_ENTITLEMENT_ID]?.isActive === true;
      setIsSubscribed(active);
      setSubscriptionInfo(info);
      if (active) {
        const plan = info.entitlements.active[PREMIUM_ENTITLEMENT_ID]?.productIdentifier;
        if (plan === 'preachly_monthly_plan') setSelectedPlanType('monthly');
        else if (plan === 'preachly_yearly_plan') setSelectedPlanType('yearly');
        setPayment({ has_subscription: true });
      }
      return active;
    } catch (e) { console.error('checkSubscriptionStatus error:', e); return false; }
  };

  const checkIntroEligibility = async (pkg) => {
      try {
        const productId = pkg.product.identifier;
        const eligibilityMap = await Purchases.checkTrialOrIntroductoryPriceEligibility([productId]);
        const introStatus = eligibilityMap[productId]?.status;
  
        const customerInfo = await Purchases.getCustomerInfo();
        const hasPastEntitlements = Object.keys(customerInfo.entitlements.all).length > 0;
        const hasPurchasedBefore = customerInfo.allPurchaseDates[productId] !== undefined;
  

        return introStatus === 2 && !hasPastEntitlements && !hasPurchasedBefore;
      } catch (error) {
        console.error('Eligibility check error:', error);
        return false;
      }
    };

  const fetchOfferings = async () => {
    try {
      const offerings = await Purchases.getOfferings();
      if (!offerings.current || offerings.current.availablePackages.length === 0) return;
      const { current } = offerings;
      //console.log("offerings ", JSON.stringify(offerings, null, 2))
      const monthly = current.monthly || null;
      if (monthly) {
        setMonthlyPackage(monthly);
        if (monthly.product.introPrice) {
          const eligible = await checkIntroEligibility(monthly);
          if (true) setMonthlyIntroOffer(monthly.product.introPrice);
        }
      }
      const annual = current.annual || null;

      if (annual) {
        setAnnualPackage(annual);
        if (annual.product.introPrice) {
          const eligible = await checkIntroEligibility(annual);
          if (true) setAnnualIntroOffer(annual.product.introPrice);
        }
      }
      if (!monthly && !annual) {
        current.availablePackages.forEach((pkg) => {
          if (pkg.packageType === 'MONTHLY') setMonthlyPackage(pkg);
          else if (pkg.packageType === 'ANNUAL') setAnnualPackage(pkg);
        });
      }
    } catch (e) { console.error('fetchOfferings error:', e); }
  };

  const handleSubscription = async () => {
    if (!activePackage) {
      Alert.alert('Unavailable', 'Subscription package is not available right now.');
      return;
    }
    if (!userProfile?.email) {
      Alert.alert('Login Required', 'Please log in to subscribe.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log In', onPress: () => navigation.navigate('Login') },
      ]);
      return;
    }
    setIsPurchasing(true);
    try {
      const { customerInfo } = await Purchases.purchasePackage(activePackage);
      const hasAccess = customerInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID]?.isActive === true;
      if (hasAccess) {
        setIsSubscribed(true);
        setSubscriptionInfo(customerInfo);
        setIsNewlySubscribed(true);
      } else {
        Alert.alert('Processing', 'Purchase received. Verifying your access...');
        setTimeout(async () => { await checkSubscriptionStatus(); }, 2500);
      }
    } catch (e) { handlePurchaseError(e); }
    finally { setIsPurchasing(false); }
  };

  const handlePurchaseError = (error) => {
    if (error.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) return;
    if (error.code === PURCHASES_ERROR_CODE.PURCHASE_NOT_ALLOWED_ERROR)
      Alert.alert('Not Allowed', 'In-app purchases are disabled on this device.');
    else if (error.code === PURCHASES_ERROR_CODE.PAYMENT_PENDING_ERROR)
      Alert.alert('Payment Pending', 'Your payment is being processed.');
    else
      Alert.alert('Purchase Failed', error.message || 'Something went wrong.');
  };

  const handleRestorePurchases = async () => {
    if (isSubscribed) return;
    setIsPurchasing(true);
    try {
      const info   = await Purchases.restorePurchases();
      const active = info.entitlements.active[PREMIUM_ENTITLEMENT_ID]?.isActive === true;
      if (active) {
        setIsSubscribed(true);
        setSubscriptionInfo(info);
        Alert.alert('Restored!', 'Your subscription has been restored.');
      } else {
        Alert.alert('Nothing Found', 'No active subscriptions found for this account.');
      }
    } catch (e) { Alert.alert('Error', 'Failed to restore purchases.'); }
    finally { setIsPurchasing(false); }
  };

  const getTrialText = useCallback(() => {
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



  const getPriceForPlan = (type) => {
    const pkg = type === 'monthly' ? monthlyPackage : annualPackage;
    return pkg?.product?.priceString ?? null;
  };

  const monthlyPrice = getPriceForPlan('monthly');
  const annualPrice  = getPriceForPlan('yearly');
  const saveBadge    = getSavingsLabel(monthlyPrice, annualPrice);

  const isMonthlyActive = selectedPlanType === 'monthly';


  const activePlan = isMonthlyActive
    ? { title: 'Monthly Plan', price: monthlyPrice, period: '/ Month', trial: getTrialText('preachly_monthly_plan'), type: 'monthly', badge: null }
    : { title: 'Annual Plan',  price: annualPrice,  period: '/ Year',  trial: getTrialText('preachly_yearly_plan'),  type: 'yearly', badge: saveBadge  };

    

  const otherPlan = isMonthlyActive
    ? { title: 'Annual Plan',  price: annualPrice,  period: '/ Year',  trial: getTrialText('preachly_yearly_plan'),  type: 'yearly',  badge: saveBadge }
    : { title: 'Monthly Plan', price: monthlyPrice, period: '/ Month', trial: getTrialText('preachly_monthly_plan'), type: 'monthly', badge: null };

  if (isLoading) {
    return (
      <SafeAreaView edges={['top']} style={styles.safeArea}>
        <NavHeader navigation={navigation} />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#005A55" />
          <Text style={styles.loadingText}>Loading plans…</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isNewlySubscribed) {
    return (
      <SafeAreaView edges={['top', 'bottom']} style={[styles.safeArea, { backgroundColor: '#fff' }]}>
        <ReusableNavigation
          backgroundStyle={{ backgroundColor: '#fff' }}
          leftComponent={() => <Text />}
          middleComponent={() => <Text style={styles.navTitle}>Subscription</Text>}
          RightComponent={() => <Text />}
        />
        <View style={styles.centered}>
          <Text style={styles.confirmedTitle}>You're all set!</Text>
          <Text style={styles.confirmedSub}>Premium access is active.</Text>
          {subscriptionInfo?.latestExpirationDate && (
            <Text style={styles.confirmedDate}>
              {subscriptionInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID]?.willRenew
                ? 'Next billing: ' : 'Access until: '}
              {new Date(subscriptionInfo.latestExpirationDate).toLocaleDateString()}
            </Text>
          )}
        </View>
        <View style={styles.bottomPad}>
          <TouchableOpacity style={styles.ctaBtn} onPress={() => setIsNewlySubscribed(false)}>
            <Text style={styles.ctaBtnText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.safeArea}>
      <NavHeader navigation={navigation} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >


        <Text style={styles.sectionTitle}>Your plan</Text>
        <ParagraphIcon
            icon={require('../../../../assets/img/24-sunset.png')}
            text="Build Confidence in Conversations About Faith"
          />
          <ParagraphIcon
            icon={require('../../../../assets/img/bird.png')}
            text="Clarity and Ease When You Need It Most"
          />
          <ParagraphIcon
            icon={require('../../../../assets/img/piramid.png')}
            text="Inspire and Strengthen Your Walk with God"
          />


        <View className="mt-10"/>
        <PlanCard
          title={activePlan.title}
          price={activePlan.price}
          period={activePlan.period}
          trialText={activePlan.trial}
          selected={true}
          opacity={1}
          onPress={() => {}}
          active={activePlan.type}
          saveBadge={activePlan.badge}
          type={activePlan.type}
          disabled={true}
        />

        <Text style={[styles.sectionTitle, { marginTop: 0 }]}>Other plans</Text>
        <PlanCard
          title={otherPlan.title}
          price={otherPlan.price}
          period={otherPlan.period}
          trialText={otherPlan.trial}
          selected={false}
          active={activePlan.type}
          saveBadge={otherPlan.badge}
          opacity={0.5}
          type={otherPlan.type}
          onPress={() => { if (!isSubscribed) setSelectedPlanType(otherPlan.type); }}
          disabled={isSubscribed}
        />

        {!isSubscribed && (
          <>
            <TouchableOpacity
              style={[styles.ctaBtn, { marginTop: 24 }, (isPurchasing || !activePackage) && styles.ctaBtnDisabled]}
              onPress={handleSubscription}
              disabled={isPurchasing || !activePackage}
              activeOpacity={0.85}
            >
              {isPurchasing
                ? <ActivityIndicator color="#fff" />
                : <Text style={styles.ctaBtnText}>{getCtaText()}</Text>}
            </TouchableOpacity>

            <TouchableOpacity onPress={handleRestorePurchases} style={{ marginTop: 12 }}>
              <Text style={styles.restoreText}>Restore Purchases</Text>
            </TouchableOpacity>

            <Text style={styles.legalText}>
              Cancel anytime. Subscription auto-renews. By subscribing, you agree to our{' '}
              <Text style={styles.legalLink} onPress={() => Linking.openURL(TERMS_URL)}>Terms of Use</Text>
              {' '}and{' '}
              <Text style={styles.legalLink} onPress={() => navigation.navigate('PrivacyPolicy')}>Privacy Policy</Text>.
            </Text>
          </>
        )}
      </ScrollView>

      {isSubscribed && (
        <View className="px-7">
          <CommonButton
            btnText={"Manage subscription"}
            bgColor="#005A55"
            navigation={navigation}
            route=""
            handler={() => {
              Linking.openSettings()
            }}
            //handler={() => logout()}
            txtColor="#fff"
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const NavHeader = ({ navigation }) => {
  const nav = navigation ?? useNavigation();
  return (
    <ReusableNavigation
      backgroundStyle={{ backgroundColor: '#fff' }}
      leftComponent={() => <BackButton cb={() => nav.goBack()} />}
      middleComponent={() => <Text style={styles.navTitle}>Subscription</Text>}
      RightComponent={() => <Text className='ml-12' />}
    />
  );
};

const planCardStyles = StyleSheet.create({
  container: {
    padding: 0,
  },
  planContainer: {
    borderWidth: 1,
    borderColor: '#B0CFCB',
    borderRadius: 20,
    padding: 10,
    paddingHorizontal:15,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    width:'100%',
    
  },
  selectedPlan: {
    borderColor: '#005A55',
  },
  planTitle: {
    fontFamily:'NunitoSemiBold',
    fontSize: 16,
    color: '#0B1D26',
  },
  subText: {
    fontSize: 16,
    color: '#84B3B2',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  priceText: {
    fontSize: 18,
    fontFamily:"NunitoSemiBold",
    color: '#0B172A',
  },
  radioOuter: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#46636A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: '#005F56',
    borderWidth: 1,
  },
  radioInner: {
    width: 23,
    height: 23,
    borderRadius: 23/2,
    backgroundColor: '#005A55',
  },
  badge: {
    position: 'absolute',
    right: 16,
    top: -10,
    backgroundColor: '#005A55',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    color: 'white',
    fontFamily:'NunitoSemiBold',
    fontSize:14
  },
})
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  navTitle: {
    fontFamily: 'NunitoSemiBold',
    color: '#0B172A',
    fontSize: 18,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    fontFamily: 'NunitoSemiBold',
    color: '#0B172A',
    marginTop: 12,
    fontSize: 15,
  },

  confirmedTitle: {
    fontFamily: 'DMSerifDisplay',
    fontSize: 28,
    color: '#0B172A',
    textAlign: 'center',
    marginBottom: 12,
  },
  confirmedSub: {
    fontFamily: 'NunitoSemiBold',
    fontSize: 16,
    color: '#005A55',
    textAlign: 'center',
  },
  confirmedDate: {
    fontFamily: 'NunitoSemiBold',
    color: '#555',
    marginTop: 8,
    fontSize: 13,
  },

  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 32 },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  bulletIcon: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    marginRight: 12,
  },
  bulletText: {
    flex: 1,
    fontFamily: 'NunitoSemiBold',
    fontSize: 14,
    color: '#0B172A',
    lineHeight: 20,
  },

  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginVertical: 16,
  },

  sectionTitle: {
    fontFamily: 'DMSerifDisplay',
    fontSize: 28,
    color: '#0B172A',
    marginBottom: 10,
  },

  card: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    position: 'relative',
    overflow: 'visible',
  },
  cardSelected: {
    borderWidth: 1.5,
    borderColor: '#005A55',
    backgroundColor: '#fff',
  },
  cardDefault: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#fff',
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  planName: {
    fontFamily: 'NunitoBold',
    fontSize: 15,
    color: '#0B172A',
    marginBottom: 2,
  },
  trialText: {
    fontFamily: 'NunitoSemiBold',
    fontSize: 12,
    color: '#90B2B2',
  },
  priceText: {
    fontFamily: 'NunitoBold',
    fontSize: 14,
    color: '#0B172A',
  },

  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: '#C5C5C5',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    backgroundColor: '#005A55',
    borderColor: '#005A55',
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
  },

  saveBadge: {
    position: 'absolute',
    top: -11,
    right: 12,
    backgroundColor: '#005A55',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    zIndex: 10,
  },
  saveBadgeText: {
    fontFamily: 'NunitoBold',
    fontSize: 11,
    color: '#fff',
  },

  ctaBtn: {
    backgroundColor: '#005A55',
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaBtnDisabled: {
    opacity: 0.6,
  },
  ctaBtnText: {
    fontFamily: 'NunitoBold',
    fontSize: 16,
    color: '#fff',
  },

  restoreText: {
    fontFamily: 'NunitoSemiBold',
    color: '#005A55',
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontSize: 13,
  },
  legalText: {
    fontFamily: 'NunitoSemiBold',
    fontSize: 13,
    color: '#90B2B2',
    textAlign: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    lineHeight: 20,
  },
  legalLink: {
    fontFamily: 'NunitoExtraBold',
    textDecorationLine: 'underline',
    color: '#555',
  },


  manageWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    paddingTop: 8,
    backgroundColor: '#fff',
  },
  bottomPad: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
});







// import React, { useEffect, useState, useCallback } from 'react';
// import {
//   View,
//   Text,
//   ImageBackground,
//   Dimensions,
//   ScrollView,
//   Alert,
//   ActivityIndicator,
//   Linking,
//   Platform,
//   TouchableOpacity,
// } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useNavigation } from '@react-navigation/native';
// import Purchases, { LOG_LEVEL, PURCHASES_ERROR_CODE } from 'react-native-purchases';

// import CommonButton from '@/components/CommonButton';
// import PlanSelector from '@/components/SubscriptionPlan';
// import ParagraphIcon from '@/components/ParagraphIcon';
// import ReusableNavigation from '@/components/ReusabeNavigation';
// import useAppStore from '@/context/useAppStore';
// import { useNotificationPermission } from '@/context/fcm';
// import { REVENUECAT_IOS_API_KEY, PREMIUM_ENTITLEMENT_ID } from '@/context/Paths';
// import BackButton from '@/components/BackButton';


// const REVENUECAT_ANDROID_API_KEY = ""
// // ────────────────────────────────────────────────────────────────────────────

// const { height } = Dimensions.get('window');

// const TERMS_URL = 'https://www.apple.com/legal/internet-services/itunes/dev/stdeula/';
// const PRIVACY_URL = 'https://yourapp.com/privacy-policy'; // ← update this

// export default function SubscriptionScreen() {
  
//   const navigation = useNavigation();
//   const setPayment = useAppStore((s) => s.setPayment);
//   const auth = useAppStore((s) => s.auth);
//   const logout = useAppStore((s) => s.logout)
//   const { enabled } = useNotificationPermission();
//   const userProfile = auth?.user;
//   console.log("Auth ", JSON.stringify(auth, null, 2))

//   // ─── Plan selection state ─────────────────────────────────────────────────
//   // 'monthly' | 'yearly'  (maps to RevenueCat monthly / annual packages)
//   const [selectedPlanType, setSelectedPlanType] = useState('yearly');

//   // ─── RevenueCat state ─────────────────────────────────────────────────────
//   const [isLoading, setIsLoading] = useState(true);
//   const [isPurchasing, setIsPurchasing] = useState(false);
//   const [isSubscribed, setIsSubscribed] = useState(false);
//   const [isNewlySubscribed, setIsNewlySubscribed] = useState(false);

//   // Separate packages for each plan
//   const [monthlyPackage, setMonthlyPackage] = useState(null);
//   const [annualPackage, setAnnualPackage] = useState(null);

//   // Intro / trial offers per plan
//   const [monthlyIntroOffer, setMonthlyIntroOffer] = useState(null);
//   const [annualIntroOffer, setAnnualIntroOffer] = useState(null);

//   const [subscriptionInfo, setSubscriptionInfo] = useState(null);

//   // ─── Derived helpers ──────────────────────────────────────────────────────
//   const activePackage = selectedPlanType === 'monthly' ? monthlyPackage : annualPackage;
//   const activeIntroOffer = selectedPlanType === 'monthly' ? monthlyIntroOffer : annualIntroOffer;
//   const isFreeIntro = activeIntroOffer?.price === 0;

//   // ─── Initialise RevenueCat on mount ──────────────────────────────────────
//   useEffect(() => {
//     initializeRevenueCat();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   const initializeRevenueCat = async () => {
//     try {
//       // Logging
//       // if (__DEV__) {
//       //   Purchases.setLogLevel(LOG_LEVEL.VERBOSE);
//       // } else {
//       //   Purchases.setLogLevel(LOG_LEVEL.ERROR);
//       // }

//       // Configure SDK
//       if (Platform.OS === 'ios') {
//         Purchases.configure({ apiKey: REVENUECAT_IOS_API_KEY });
//       } else if (Platform.OS === 'android') {
//         Purchases.configure({ apiKey: REVENUECAT_ANDROID_API_KEY });
//       }

//       // Identify user
//       await identifyUser();

//       // Check existing subscription
//       await checkSubscriptionStatus();

//       // Fetch offerings (packages + intro eligibility)
//       await fetchOfferings();
//     } catch (error) {
//       console.error('RevenueCat init error:', error);
//       Alert.alert('Error', 'Failed to load subscription plans. Please restart the app.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // ─── Identify user with RevenueCat ───────────────────────────────────────
//   const identifyUser = async () => {
//     try {
//       const user = userProfile?.user;
//       if (user?.email) {
//         await Purchases.logIn(user.email);

//         // Optional: sync attributes
//         if (user.email) await Purchases.setEmail(user.email);
//         if (user.name) await Purchases.setDisplayName(user.name);
//         await Purchases.setAttributes({
//           user_id: user._id || user.uid || '',
//           signup_date: user.createdAt || new Date().toISOString(),
//           user_type: user.role || 'standard',
//         });
//       }
//     } catch (error) {
//       console.error('RevenueCat identify error:', error);
//     }
//   };

//   // ─── Check if already subscribed ─────────────────────────────────────────
//   const checkSubscriptionStatus = async () => {
//     try {
//       const customerInfo = await Purchases.getCustomerInfo();
//       const active = customerInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID]?.isActive === true;
//       setIsSubscribed(active);
//       setSubscriptionInfo(customerInfo);
//       console.log("customerInfo -> ", JSON.stringify(customerInfo, null, 2))
//       if(active) {
//         const plan = customerInfo?.entitlements?.active[PREMIUM_ENTITLEMENT_ID]?.productIdentifier;

//         if(plan === "preachly_monthly_plan"){
//           setSelectedPlanType("monthly")
//         }else if(plan == "preachly_yearly_plan"){
//           setSelectedPlanType("yearly")
//         }
        
//         setPayment({ has_subscription: true });
//       }

//       return active;
//     } catch (error) {
//       console.error('checkSubscriptionStatus error:', error);
//       return false;
//     }
//   };

//   // ─── Strict intro-offer eligibility check ────────────────────────────────
//   const checkIntroEligibility = async (pkg) => {
//     try {
//       const productId = pkg.product.identifier;
//       const eligibilityMap = await Purchases.checkTrialOrIntroductoryPriceEligibility([productId]);
//       const introStatus = eligibilityMap[productId]?.status;

//       const customerInfo = await Purchases.getCustomerInfo();
//       const hasPastEntitlements = Object.keys(customerInfo.entitlements.all).length > 0;
//       const hasPurchasedBefore = customerInfo.allPurchaseDates[productId] !== undefined;

//       // status 2 = ELIGIBLE; must also have no prior entitlements / purchases
//       return introStatus === 2 && !hasPastEntitlements && !hasPurchasedBefore;
//     } catch (error) {
//       console.error('Eligibility check error:', error);
//       return false;
//     }
//   };

//   // ─── Fetch offerings from RevenueCat ─────────────────────────────────────
//   const fetchOfferings = async () => {
//     try {
//       const offerings = await Purchases.getOfferings();

//       console.log("offerings ", JSON.stringify(offerings, null, 2))
//       if (!offerings.current || offerings.current.availablePackages.length === 0) {
//         console.warn('No offerings available');
//         return;
//       }

//       const { current } = offerings;

//       // Monthly package
//       const monthly = current.monthly || null;
//       if (monthly) {
//         setMonthlyPackage(monthly);
//         if (monthly.product.introPrice) {
//           const eligible = await checkIntroEligibility(monthly);
//           console.log("eli monthly", eligible)
//           if (eligible) setMonthlyIntroOffer(monthly.product.introPrice);
//         }
//       }

//       // Annual package
//       const annual = current.annual || null;
//       if (annual) {
//         setAnnualPackage(annual);
//         if (annual.product.introPrice) {
//           const eligible = await checkIntroEligibility(annual);
//           console.log("eli annual", eligible)
//           if (eligible) setAnnualIntroOffer(annual.product.introPrice);
//         }
//       }

//       // Fallback: if specific keys don't exist, spread all available packages
//       if (!monthly && !annual && current.availablePackages.length > 0) {
//         // Try to guess monthly vs annual by period
//         current.availablePackages.forEach((pkg) => {
//           const period = pkg.packageType; // 'MONTHLY' | 'ANNUAL' | 'SIX_MONTH' etc.
//           if (period === 'MONTHLY') setMonthlyPackage(pkg);
//           else if (period === 'ANNUAL') setAnnualPackage(pkg);
//         });
//       }
//     } catch (error) {
//       console.error('fetchOfferings error:', error);
//     }
//   };

//   // ─── Handle purchase ──────────────────────────────────────────────────────
//   const handleSubscription = async () => {
//     if (!activePackage) {
//       Alert.alert('Unavailable', 'Subscription package is not available right now. Please try again.');
//       return;
//     }

//     const user = userProfile;
//     if (!user?.email) {
//       Alert.alert(
//         'Login Required',
//         'Please log in to subscribe.',
//         [
//           { text: 'Cancel', style: 'cancel' },
//           { text: 'Log In', onPress: () => navigation.navigate('Login') },
//         ]
//       );
//       return;
//     }

//     setIsPurchasing(true);
//     try {
//       const { customerInfo } = await Purchases.purchasePackage(activePackage);
//       const hasAccess = customerInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID]?.isActive === true;

//       if (hasAccess) {
//         setIsSubscribed(true);
//         setSubscriptionInfo(customerInfo);
//         setIsNewlySubscribed(true);
//         // userProfile?.setIsSubscribed?.(true);
//         // userProfile?.setSubscriptionInfo?.(customerInfo);
//         // setPayment({ has_subscription: true });

//         // Alert.alert(
//         //   'Welcome!',
//         //   isFreeIntro
//         //     ? `Your free trial has started! Enjoy ${getTrialPeriodText()} free.`
//         //     : 'Your subscription is now active. Enjoy premium access!',
//         //   [{ text: 'Continue', onPress: () => navigation.navigate('SubscriptionConfirmedScreen') }]
//         // );
//       } else {
//         // Access not immediately confirmed — poll
//         Alert.alert('Processing', 'Purchase received. Verifying your access...');
//         setTimeout(async () => {
//           const active = await checkSubscriptionStatus();
//           //if (active) navigation.navigate('SubscriptionConfirmedScreen');
//         }, 2500);
//       }
//     } catch (error) {
//       handlePurchaseError(error);
//     } finally {
//       setIsPurchasing(false);
//     }
//   };

//   // ─── Purchase error handler ───────────────────────────────────────────────
//   const handlePurchaseError = (error) => {
//     if (error.code === PURCHASES_ERROR_CODE.PURCHASE_CANCELLED_ERROR) {
//       // User cancelled — no alert needed
//       return;
//     }
//     if (error.code === PURCHASES_ERROR_CODE.PURCHASE_NOT_ALLOWED_ERROR) {
//       Alert.alert('Not Allowed', 'In-app purchases are disabled on this device.');
//     } else if (error.code === PURCHASES_ERROR_CODE.PAYMENT_PENDING_ERROR) {
//       Alert.alert('Payment Pending', 'Your payment is being processed. Check back shortly.');
//     } else {
//       Alert.alert('Purchase Failed', error.message || 'Something went wrong. Please try again.');
//     }
//   };

//   // ─── Restore purchases ────────────────────────────────────────────────────
//   const handleRestorePurchases = async () => {
//     if(isSubscribed) return;
//     setIsPurchasing(true);
//     try {
//       const customerInfo = await Purchases.restorePurchases();
//       const active = customerInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID]?.isActive === true;
//       if (active) {
//         setIsSubscribed(true);
//         setSubscriptionInfo(customerInfo);
//         // userProfile?.setIsSubscribed?.(true);
//         // userProfile?.setSubscriptionInfo?.(customerInfo);
//         Alert.alert('Restored!', 'Your subscription has been restored.');
//       } else {
//         Alert.alert('Nothing Found', 'No active subscriptions were found for this account.');
//       }
//     } catch (error) {
//       Alert.alert('Error', 'Failed to restore purchases. Please try again.');
//     } finally {
//       setIsPurchasing(false);
//     }
//   };

//   // ─── Helpers ──────────────────────────────────────────────────────────────
//   const getTrialPeriodText = (identifier) => {

//     if(isSubscribed) {
//       const plan = subscriptionInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID].productIdentifier;
//       if(plan === identifier.id){
//         return "Active"
//       }else{
//         return null
//       }
//     }

//     if (!activeIntroOffer) return 'Free Trial Expired';
    

//     const { periodNumberOfUnits: count, periodUnit } = activeIntroOffer;
//     switch (periodUnit) {
//       case 'DAY':   return count === 1 ? '1-Day Free Trial'   : `${count} Days Free Trial`;
//       case 'WEEK':  return count === 1 ? '7-Day Free Tri'  : `${count} Weeks Free Trial`;
//       case 'MONTH': return count === 1 ? '30-Day Free Trial' : `${count} Months Free Trial`;
//       case 'YEAR':  return count === 1 ? '1 Year Free Trial'  : `${count} Years Free Trial`;
//       default:      return activeIntroOffer.period;
//     }
//   };

//   const getCtaText = () => {
//     if (isPurchasing) return null; // shows spinner
//     if(isSubscribed) return `${subscriptionInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID]?.willRenew
//                 ? 'Next billing: '
//                 : 'Access until: '}${new Date(subscriptionInfo.latestExpirationDate).toLocaleDateString()}`
//     if (isFreeIntro) return `Start My Free Trial`;
//     if (activeIntroOffer) return `Try for ${activeIntroOffer.priceString}`;
//     return 'Subscribe';
//   };

//   const getPriceForPlan = (planType) => {
//     const pkg = planType === 'monthly' ? monthlyPackage : annualPackage;
//     if (!pkg) return null;
//     return pkg.product.priceString;
//   };

//   // ─── Loading state ────────────────────────────────────────────────────────
//   if (isLoading) {
//     return (
//       <SafeAreaView edges={['top']} className="flex-1 bg-[#FFEAC2]">
//         <ReusableNavigation
//           backgroundStyle={{ backgroundColor: '#FFE9BD' }}
//           leftComponent={() => <Text />}
//           middleComponent={() => (
//             <Text style={{ fontFamily: 'NunitoSemiBold', color: '#0B172A', fontSize: 18 }}>
//               Subscription
//             </Text>
//           )}
//           RightComponent={() => <Text />}
//         />
//         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//           <ActivityIndicator size="large" color="#005A55" />
//           <Text style={{ fontFamily: 'NunitoSemiBold', color: '#0B172A', marginTop: 12, fontSize: 15 }}>
//             Loading plans...
//           </Text>
//         </View>
//       </SafeAreaView>
//     );
//   }

//   // ─── Subscribed state ─────────────────────────────────────────────────────
//   if (isNewlySubscribed) {
//     return (
//       <SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-[white]">
//         <ReusableNavigation
//           backgroundStyle={{ backgroundColor: 'white' }}
//           leftComponent={() => <Text/>}
//           middleComponent={() => (
//             <Text style={{ fontFamily: 'NunitoSemiBold', color: '#0B172A', fontSize: 18 }}>
//               Subscription
//             </Text>
//           )}
//           RightComponent={() => <Text className='ml-12'></Text>}
//         />
//         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
//           <Text style={{ fontFamily: 'DMSerifDisplay', fontSize: 28, color: '#0B172A', textAlign: 'center', marginBottom: 12 }}>
//             You're all set! 
//           </Text>
//           <Text style={{ fontFamily: 'NunitoSemiBold', fontSize: 16, color: '#005A55', textAlign: 'center' }}>
//             Premium access is active.
//           </Text>
//           {subscriptionInfo?.latestExpirationDate && (
//             <Text style={{ fontFamily: 'NunitoSemiBold', color: '#555', marginTop: 8, fontSize: 13 }}>
//               {subscriptionInfo.entitlements.active[PREMIUM_ENTITLEMENT_ID]?.willRenew
//                 ? 'Next billing: '
//                 : 'Access until: '}
//               {new Date(subscriptionInfo.latestExpirationDate).toLocaleDateString()}
//             </Text>
//           )}
          
//         </View>
//         <View className='px-5'>
//           <CommonButton
//             btnText="Continue"
//             bgColor="#005A55"
//             navigation={navigation}
//             route=""
//             handler={() => setIsNewlySubscribed(false)}
//             //handler={() => logout()}
//             txtColor="#fff"
//           />
//         </View>
//       </SafeAreaView>
//     );
//   }

//   // ─── Main UI ──────────────────────────────────────────────────────────────
//   return (
//     <SafeAreaView edges={['top']} className="flex-1 bg-[#FFEAC2]">

//       {/* Navigation header */}
//       <ReusableNavigation
//         backgroundStyle={{ backgroundColor: '#FFE9BD' }}
//         leftComponent={() => <BackButton customStyle={{backgroundColor:'#FFE9BD'}} cb={() => navigation.goBack()}/>}
//         middleComponent={() => (
//           <Text
//             style={{ fontFamily: 'NunitoSemiBold', color: '#0B172A', fontSize: 18 }}
//           >
//             Subscription
//           </Text>
//         )}
//         RightComponent={() => <Text className='ml-12' />}
//       />

//       <View className="flex-1 relative">

//         {/* Background image */}
//         <ImageBackground
//           source={require('../../../../assets/img/bg_large2.png')}
//           style={{ height: height * 0.28, width: '100%' }}
//           resizeMode="cover"
//         >
//           <Text
//             style={{ fontFamily: 'DMSerifDisplay', lineHeight: 35 }}
//             className="text-[32px] text-[#0B172A] text-center px-8 pt-2"
//           >
//             Inspired Answers, When You're Lost for Words
//           </Text>
//         </ImageBackground>

//         {/* Content card */}
//         <ScrollView
//           style={{
//             position: 'absolute',
//             top: height * 0.22,
//             left: 0,
//             right: 0,
//             bottom: 0,
//             backgroundColor: '#fff',
//             borderTopLeftRadius: 25,
//             borderTopRightRadius: 25,
//           }}
//           contentContainerStyle={{ padding: 20, paddingBottom: 60 }}
//           showsVerticalScrollIndicator={false}
//         >
//           {/* Feature bullets */}
//           <ParagraphIcon
//             icon={require('../../../../assets/img/24-sunset.png')}
//             text="Know what to say when faith conversations matter most"
//           />
//           <ParagraphIcon
//             icon={require('../../../../assets/img/bird.png')}
//             text="Understand scripture with clarity and context"
//           />
//           <ParagraphIcon
//             icon={require('../../../../assets/img/piramid.png')}
//             text="Share what you believe with confidence"
//           />

//           {/* ── Plan Selector ── */}
//           {/*
//             PlanSelector now receives live price strings from RevenueCat.
//             Pass them as props so the component can display real prices
//             instead of hardcoded ones.
//           */}
//           <PlanSelector
//             plan={selectedPlanType}
//             setSelectedPlanType={setSelectedPlanType}
//             isSubscribed={isSubscribed}
//             monthlyPrice={getPriceForPlan('monthly')}   // e.g. "$11.99"
//             annualPrice={getPriceForPlan('yearly')}     // e.g. "$79.99"
//             monthlyTrialText={
//               getTrialPeriodText({id:"preachly_monthly_plan", type:"monthly"})
//             }
//             annualTrialText={
//               getTrialPeriodText({id:"preachly_yearly_plan", type:"yearly"})
//             }
//           />

//           {/* ── CTA Button ── */}
//           <CommonButton
//             btnText={
//               isPurchasing
//                 ? <ActivityIndicator color="#fff" />
//                 : getCtaText()
//             }
//             bgColor="#005A55"
//             navigation={navigation}
//             route=""
//             handler={handleSubscription}
//             //handler={() => logout()}
//             txtColor="#fff"
//             opacity={isPurchasing || !activePackage || isSubscribed ? 0.6 : 1}
//             disabled={isPurchasing || !activePackage || isSubscribed}
//           />

//           {/* ── Restore Purchases ── */}
//           <TouchableOpacity onPress={handleRestorePurchases}>
//             <Text
//               style={{
//                 fontFamily: 'NunitoSemiBold',
//                 color: '#005A55',
//                 textAlign: 'center',
//                 textDecorationLine: 'underline',
//                 fontSize: 13,
//                 marginTop: 12,
//               }}
//             >
//               Restore Purchases
//             </Text>
//           </TouchableOpacity>

//           {/* ── Legal footer ── */}
//           <Text
//             style={{ fontFamily: 'NunitoSemiBold' }}
//             className="text-base text-[#90B2B2] text-center px-4 py-5"
//           >
//             Cancel anytime. Subscription auto-renews. By subscribing, you agree to our{' '}
//             <Text
//               style={{ fontFamily: 'NunitoExtraBold', textDecorationLine: 'underline', color: '#555' }}
//               onPress={() => Linking.openURL(TERMS_URL)}
//             >
//               Terms of Use
//             </Text>
//             {' '}and{' '}
//             <Text
//               style={{ fontFamily: 'NunitoExtraBold', textDecorationLine: 'underline', color: '#555' }}
//               onPress={() => navigation.navigate("PrivacyPolicy")}
//             >
//               Privacy Policy
//             </Text>
//             .
//           </Text>

//         </ScrollView>
//       </View>
//     </SafeAreaView>
//   );
// }