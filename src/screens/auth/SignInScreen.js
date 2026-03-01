import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Keyboard, Pressable,
  KeyboardAvoidingView, Platform, ScrollView,
  ActivityIndicator, LayoutAnimation,
} from 'react-native';
import CommonInput from '../../components/CommonInput';
import { deepGreen, lightgreen1, primaryText } from '../../components/Constant';
import { SafeAreaView } from 'react-native-safe-area-context';
import CommonButton from '../../components/CommonButton';
import { handleToast, login } from './AuthAPI';
import Indicator from '../../components/Indicator';
import { useNavigation } from '@react-navigation/native';
import { onboarding_status, get_onboarding_all_data } from '../personalization/PersonalizationAPIs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setAuthToken } from '../../context/api';
import { get_payment_status } from './AuthAPI';


import useAppStore from '@/context/useAppStore';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
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


  const [keyboardOffset, setKeyboardOffset] = useState(30);
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
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Pressable onPress={Keyboard.dismiss} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <Text style={styles.label}>Email</Text>
            <CommonInput
              type="email"
              placeholder=""
              value={email}
              onChangeText={setEmail}
              style={email.length > 0 ? { ...styles.input, ...styles.activeInput } : styles.input}
            />

            <Text style={styles.label}>Password</Text>
            <CommonInput
              type="password"
              placeholder="Enter password"
              value={password}
              onChangeText={setPassword}
              style={password.length > 0 ? { ...styles.input, ...styles.activeInput } : styles.input}
              placeholderColor="#607373"
            />

            <Pressable onPress={() => navigation.navigate('SignUp', { type: 'reset', email })}>
              <Text style={styles.forgotPass}>Forgot password?</Text>
            </Pressable>
          </View>
        </ScrollView>

        <View style={[styles.buttonContainer, { paddingBottom: keyboardOffset }]}>
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

      {loading && (
        <Indicator visible={loading} onClose={() => setLoading(false)}>
          <ActivityIndicator size="large" />
        </Indicator>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { flexGrow: 1, padding: 20 },
  content: { flex: 1, backgroundColor: '#fff', paddingVertical: 35 },
  label: { fontFamily: 'NunitoSemiBold', fontSize: 16, color: '#2B4752' },
  input: {
    marginBottom: 20, height: 57,
    borderWidth: 1, borderColor: '#ACC6C5',
  },
  activeInput: { borderColor: '#005A55' },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 30 : 90,
  },
  forgotPass: {
    fontFamily: 'NunitoExtraBold', fontSize: 16,
    textDecorationLine: 'underline', color: '#0B172A',
  },
});