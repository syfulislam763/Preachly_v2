import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Keyboard,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  LayoutAnimation
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import CommonInput from '../../components/CommonInput';
import { deepGreen, lightgreen1 } from '../../components/Constant';
import { SafeAreaView } from 'react-native-safe-area-context';
import CommonButton from '../../components/CommonButton';
import { create_password, handleToast, confirm_forget_password } from './AuthAPI';
import { useRoute, useNavigation, CommonActions } from '@react-navigation/native';
import Indicator from '../../components/Indicator';
import { onboarding_status, get_onboarding_all_data } from '../personalization/PersonalizationAPIs';
import useAppStore from '@/context/useAppStore';
import ReusableNavigation from '../../components/ReusabeNavigation';
import BackButton from '../../components/BackButton';

export default function CreatePassword() {
  const { updateStore } = useAuth();
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [keyboardOffset, setKeyboardOffset] = useState(30);

  const setAuth = useAppStore(s => s.setAuth);
  const route = useRoute();
  const navigation = useNavigation();

  const handleResetComplete = () => {
    const payload = {
      email: route.params.email,
      otp: route.params.otp,
      new_password: password,
      new_password2: password,
    };
    setLoading(true);
    confirm_forget_password(payload, (res, success) => {
      if (success) {
        handleToast("info", "Password changed successfully, login again!", 3000, () => {
          navigation.dispatch(state => {
            const routes = state.routes.slice(0, -5);
            routes.push({ name: 'SignIn', params: payload });
            return CommonActions.reset({ ...state, index: routes.length - 1, routes });
          });
        });
      }
      setLoading(false);
    });
  };

  const handleSignUpComplete = () => {
    const payload = { ...route.params, password, password2: password };
    setLoading(true);
    create_password(payload, (res, isSuccess) => {
      if (isSuccess) {
        onboarding_status(res?.data?.access, (statusRes, isOk) => {
          const { access, refresh } = res.data;
          const onboarding_completed = statusRes?.data?.onboarding_completed ?? false;
          setLoading(false);
          if (isOk) {
            setAuth({ access, refresh, onboarding_completed });
            handleToast("success", "User is created!", 2000, () => {
              navigation.navigate("FinishAuthentication");
            });
          }
        });
      } else {
        setLoading(false);
        handleToast("error", "Enter valid password", 3000, () => {});
      }
    });
  };

  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', e => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setKeyboardOffset(Math.min(e.endCoordinates.height, 100));
    });
    const hide = Keyboard.addListener('keyboardDidHide', () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setKeyboardOffset(30);
    });
    return () => { show.remove(); hide.remove(); };
  }, []);

  const isReady = password.length > 8 && password === rePassword;

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-white">

      <ReusableNavigation
        backgroundStyle={{ backgroundColor: '#fff' }}
        leftComponent={() => <BackButton navigation={navigation} />}
        middleComponent={() => <Text />}
        RightComponent={() => <Text />}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <Pressable onPress={() => Keyboard.dismiss()} className="flex-1">

          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="flex-1 px-5 pt-16">

              <Text
                style={{ fontFamily: 'DMSerifDisplay' }}
                className="text-3xl text-[#0B172A] mb-2"
              >
                Create a password
              </Text>

              <Text
                style={{ fontFamily: 'NunitoSemiBold', fontSize: 17 }}
                className="text-[#2B4752] mb-10"
              >
                The password must be longer than 8 characters, contain numbers(0 - 9), letters (A-Z,a-z), and special characters (! # $ &  @)
              </Text>

              <CommonInput
                type='password'
                placeholder="Enter password"
                value={password}
                onChangeText={(e) => setPassword(e)}
                style={{
                  marginBottom: 5,
                  marginTop: 20,
                  borderColor: password.length > 8 ? deepGreen : '#ACC6C5',
                }}
                placeholderColor='#607373'
              />

              <CommonInput
                type='password'
                placeholder="Re enter password"
                value={rePassword}
                onChangeText={(e) => setRePassword(e)}
                style={{
                  marginBottom: 5,
                  marginTop: 20,
                  borderColor: rePassword.length > 8 ? deepGreen : '#ACC6C5',
                }}
                placeholderColor='#607373'
              />

            </View>
          </ScrollView>

          {/* Button pinned at bottom */}
          <View className="px-5" style={{ paddingBottom: keyboardOffset }}>
            <CommonButton
              btnText={"Save"}
              bgColor={isReady ? deepGreen : lightgreen1}
              navigation={navigation}
              route={""}
              handler={() => {
                if (route?.params?.type == "reset") handleResetComplete();
                else handleSignUpComplete();
              }}
              txtColor={isReady ? lightgreen1 : deepGreen}
              bold='bold'
              opacity={1}
              disabled={!isReady}
            />
          </View>

        </Pressable>
      </KeyboardAvoidingView>

      {loading &&
        <Indicator visible={loading} onClose={() => setLoading(false)}>
          <ActivityIndicator size="large" />
        </Indicator>
      }

    </SafeAreaView>
  );
}