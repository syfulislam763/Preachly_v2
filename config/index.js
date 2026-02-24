import Constants from 'expo-constants';


const getEnvVars = () => {
  const ENV = Constants.expoConfig?.extra?.eas?.env || 'development';
  const REVENUECAT_IOS_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY;
  const PREMIUM_ENTITLEMENT_ID = process.env.EXPO_PUBLIC_PREMIUM_ENTITLEMENT_ID;

  return {
    ENV,
    REVENUECAT_IOS_API_KEY,
    PREMIUM_ENTITLEMENT_ID,
  };
};

export default getEnvVars();