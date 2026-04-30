import React, { useCallback, useState } from 'react';
import { View, Text, ImageBackground, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import CommonButton from '../../components/CommonButton';
import Divider from '../../components/Divider';
import { getStyles } from './authStyles/AuthHomeStyle';
import useLayoutDimention from '../../hooks/useLayoutDimention';
import { googleSignIn, googleLogin } from './AuthAPI';
import { appleSignIn } from './appleAuth';
import { AppleButton } from '@invertase/react-native-apple-authentication';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Indicator from '../../components/Indicator';
import { get_onboarding_all_data, onboarding_status } from '../personalization/PersonalizationAPIs';
import { get_payment_status, setAuthToken } from './AuthAPI';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { initFCM } from '@/context/fcm';
import { useNotificationPermission } from '@/context/fcm';
import useAppStore from '@/context/useAppStore';

const AuthHome = () => {
  const { isLarge, isMedium, isSmall, isFold } = useLayoutDimention();
  const styles = getStyles(isSmall, isMedium, isLarge, isFold);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const insets = useSafeAreaInsets();
  const { toggle, enabled} = useNotificationPermission();

  const setAuth = useAppStore((s) => s.setAuth);
  const setOnboardingData = useAppStore((s) => s.setOnboardingData);
  const setPayment = useAppStore((s) => s.setPayment);
  const setOnboardingCompleted = useAppStore((s) => s.setOnboardingCompleted);


  useFocusEffect(
    useCallback(() => {
      toggle(true)
    }, [])
  )

  console.log("nofication enabled", enabled)

  const handleLogin = (payload) => {
    setLoading(true);

    googleLogin(payload, (res, success) => {
      if (!success) {
        console.log('Login failed', JSON.stringify(res, null, 2));
        setLoading(false);
        return;
      }

      const { access, refresh } = res.data;

      onboarding_status(access, (statusRes, isOk) => {
        if (!isOk) {
          setLoading(false);
          return;
        }

        get_onboarding_all_data(access, (allData, isFine) => {
          if (!isFine) {
            setLoading(false);
            return;
          }

          get_payment_status(access, (payment, isPayment) => {
            setLoading(false);

            if (!isPayment) return;

            const onboarding_completed = statusRes?.data?.onboarding_completed ?? false;

            setOnboardingData(allData.data);
            setPayment(payment.data);
            
            if (onboarding_completed) {
              setAuth({
                access,
                refresh,
                onboarding_completed,
                user: res.data?.user,
                isLoggedIn: true
              });
            } else {
              setAuth({
                access,
                refresh,
                onboarding_completed,
                user: res.data?.user,
              });
              navigation.navigate('FinishAuthentication');
              
            }
          });
        });
      });
    });
  };

  const handleGoogleLogin = () => {
    googleSignIn((res, success) => {
      if (success) {
        handleLogin({
          email: res?.user?.email,
          provider: 'google',
          name: res?.user?.name || '',
        });
      } else {
        console.log('Google sign-in error', res);
      }
    });
  };

  const handleAppleLogin = (data, success) => {
    if (success) {
      handleLogin({
        email: data?.email,
        provider: 'apple',
        name: data?.fullName?.givenName || '',
      });
    } else {
      console.log('Apple sign-in failed:', data);
    }
  };

  return (
    <View style={{ position: 'relative', flex: 1, backgroundColor: '#fff' }}>
      <ImageBackground
        source={require('../../../assets/img/bg_img2.png')}
        style={styles.background}
        resizeMode="cover"
      />

      <View  style={{...styles.content, paddingBottom: insets.bottom}}>
        <Text style={styles.title}>Inspired Answers are just a step away</Text>
        <Text style={styles.subtitle}>Equip your faith. Empower your words</Text>

        <CommonButton
          btnText="Sign up"
          bgColor="#005A55"
          navigation={navigation}
          route="SignUp"
          txtColor="#fff"
          opacity={1}
        />

        <View style={{ height: 10 }} />

        <CommonButton
          btnText="Log In"
          bgColor="#EDF3F3"
          navigation={navigation}
          route="SignIn"
          txtColor="#2B4752"
          opacity={1}
        />

        <View style={styles.divider}>
          <Divider text="or" />
        </View>


        <View style={styles.googleAppleAuth}>
          {/* Apple — image visible, AppleButton transparent on top */}
          <TouchableOpacity onPress={() => appleSignIn(handleAppleLogin)}> 
            <Image
              source={require('../../../assets/img/appleAuth.png')}
              height={50}
              width={50}
            />
            
          </TouchableOpacity>

          {/* Google */}
          <TouchableOpacity onPress={handleGoogleLogin}>
            <Image
              source={require('../../../assets/img/googleAuth.png')}
              height={50}
              width={50}
            />
          </TouchableOpacity>
        </View>

        <View className={`flex-row items-center justify-center flex-wrap px-7`}>
          <Text className="text-[#90B2B2]">By singing up, you agree to the app's {' '}</Text>
          <TouchableOpacity onPress={() => {
            navigation.navigate("TermsAndCondition")
          }} ><Text className='text-black font-[NunitoSemiBold] mr-3 underline' >Terms of Use</Text></TouchableOpacity>
          <Text className="text-[#90B2B2]" >and {' '}</Text>
          <TouchableOpacity onPress={() => {
            navigation.navigate("PrivacyPolicy")
          }}><Text className='text-black font-[NunitoSemiBold] mr-3 underline' >Privacy Policy</Text></TouchableOpacity>
        </View>
      </View>
      <Indicator onClose={() => setLoading(false)} visible={loading}>
        <ActivityIndicator size="large" />
      </Indicator>
    </View>
  );
};

export default AuthHome;