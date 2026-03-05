import React, { useEffect, useState } from 'react';
import {
  View, Text, Keyboard, Pressable,
  KeyboardAvoidingView, Platform, ScrollView,
  ActivityIndicator, LayoutAnimation,
} from 'react-native';
import CommonInput from '../../components/CommonInput';
import { deepGreen, lightgreen1 } from '../../components/Constant';
import { SafeAreaView } from 'react-native-safe-area-context';
import CommonButton from '../../components/CommonButton';
import { handleToast, login } from './AuthAPI';
import Indicator from '../../components/Indicator';
import { useNavigation } from '@react-navigation/native';
import { onboarding_status, get_onboarding_all_data } from '../personalization/PersonalizationAPIs';
import { setAuthToken } from '../../context/api';
import { get_payment_status } from './AuthAPI';
import useAppStore from '@/context/useAppStore';
import ReusableNavigation from '../../components/ReusabeNavigation';
import BackButton from '../../components/BackButton';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [keyboardOffset, setKeyboardOffset] = useState(30);
  const navigation = useNavigation();

  const setAuth = useAppStore((s) => s.setAuth);
  const setOnboardingData = useAppStore((s) => s.setOnboardingData);
  const setPayment = useAppStore((s) => s.setPayment);
  const setOnboardingCompleted = useAppStore((s) => s.setOnboardingCompleted);

  const handleLogin = () => {
    setLoading(true);

    login({ email, password }, (res, success) => {
      if (!success) {
        setLoading(false);
        handleToast('error', res.message, 3000, () => {});
        return;
      }

      const { access, refresh } = res.data;

      onboarding_status(access, (statusRes, isOk) => {
        if (!isOk) {
          setLoading(false);
          handleToast('error', 'Onboarding status error', 3000, () => {});
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
            setOnboardingCompleted(onboarding_completed);

            if (onboarding_completed) {
              setAuth({
                access,
                refresh,
                onboarding_completed,
                isLoggedIn: true,
                user: res.data?.user,
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

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', (e) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setKeyboardOffset(Math.min(e.endCoordinates.height, 100));
    });
    const hide = Keyboard.addListener('keyboardDidHide', () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setKeyboardOffset(30);
    });
    return () => { show.remove(); hide.remove(); };
  }, []);

  const isReady = email.length > 0 && password.length > 0;

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-white">

      {/* Navigation Header — matches SignUp pattern */}
      <ReusableNavigation
        backgroundStyle={{ backgroundColor: '#fff' }}
        leftComponent={() => <BackButton navigation={navigation} />}
        middleComponent={() => (
          <Text
            style={{ fontFamily: 'NunitoSemiBold', color: '#0B172A', fontSize: 18 }}
            className="mr-10"
          >
            Sign In
          </Text>
        )}
        RightComponent={() => <Text />}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <Pressable onPress={Keyboard.dismiss} className="flex-1">

          {/* Full ScrollView so content never gets cut off */}
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="flex-1 px-5 pt-16">

              <Text
                style={{ fontFamily: 'NunitoSemiBold' }}
                className="text-base text-[#2B4752] mb-1"
              >
                Email
              </Text>
              <CommonInput
                type="email"
                placeholder=""
                value={email}
                onChangeText={setEmail}
                style={{
                  marginBottom: 20,
                  height: 57,
                  borderWidth: 1,
                  borderColor: email.length > 0 ? '#005A55' : '#ACC6C5',
                }}
              />

              <Text
                style={{ fontFamily: 'NunitoSemiBold' }}
                className="text-base text-[#2B4752] mb-1"
              >
                Password
              </Text>
              <CommonInput
                type="password"
                placeholder="Enter password"
                value={password}
                onChangeText={setPassword}
                style={{
                  marginBottom: 20,
                  height: 57,
                  borderWidth: 1,
                  borderColor: password.length > 0 ? '#005A55' : '#ACC6C5',
                }}
                placeholderColor="#607373"
              />

              <Pressable onPress={() => navigation.navigate('SignUp', { type: 'reset', email })}>
                <Text
                  style={{ fontFamily: 'NunitoExtraBold' }}
                  className="text-base text-[#0B172A] underline"
                >
                  Forgot password?
                </Text>
              </Pressable>

            </View>
          </ScrollView>

          {/* Button pinned at bottom — matches SignUp spacing exactly */}
          <View className="px-5" style={{ paddingBottom: keyboardOffset }}>
            <CommonButton
              btnText="Log in"
              bgColor={!isReady ? lightgreen1 : deepGreen}
              navigation={navigation}
              route=""
              handler={handleLogin}
              txtColor={!isReady ? deepGreen : 'white'}
              disabled={!isReady}
              opacity={1}
            />
          </View>

        </Pressable>
      </KeyboardAvoidingView>

      {loading && (
        <Indicator visible={loading} onClose={() => setLoading(false)}>
          <ActivityIndicator size="large" />
        </Indicator>
      )}

    </SafeAreaView>
  );
}