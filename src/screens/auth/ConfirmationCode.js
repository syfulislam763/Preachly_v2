import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, ScrollView, Pressable, Keyboard } from 'react-native';
import { deepGreen, lighgreen } from '../../components/Constant';
import OTPInput from '../../components/OTPInput';
import { verify_email, resentOTP, handleToast, verify_change_email, verify_forget_password } from './AuthAPI';
import Indicator from '../../components/Indicator';
import { useNavigation, useRoute, CommonActions } from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';
import useAppStore from '@/context/useAppStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import ReusableNavigation from '../../components/ReusabeNavigation';
import BackButton from '../../components/BackButton';

const ConfirmationCode = () => {
  const [isLoading, setIsloading] = useState(false);
  const route = useRoute();
  const navigation = useNavigation();
  const { email, change, profileSettingData, faith_goal_questions, type } = route.params;
  const { updateStore } = useAuth();

  const setAuth = useAppStore((s) => s.setAuth);
  const auth = useAppStore((s) => s.auth);
  const setProfileData = useAppStore((s) => s.setProfileData);

  const handleReset = (otp) => {
    setIsloading(true);
    const payload = { email: email, otp: otp };
    verify_forget_password(payload, (res, success) => {
      if (success) {
        navigation.navigate("CreatePassword", { ...payload, type: "reset" });
      }
      setIsloading(false);
    });
  };

  const changeEmailVerify = (otp) => {
    setIsloading(true);
    verify_change_email({ otp: otp }, (res, success) => {
      if (success) {
        setProfileData({ ...profileSettingData, userInfo: { ...profileSettingData.userInfo, email: route.params.email } });
        handleToast("info", "Email Changed!", 2000, () => {
          navigation.dispatch(state => {
            const routes = state.routes.slice(0, -3);
            routes.push({ name: 'PersonalInfo', params: { editMode: false } });
            return CommonActions.reset({ ...state, index: routes.length - 1, routes });
          });
        });
      } else {
        console.log(res);
        navigation.goBack();
      }
      setIsloading(false);
    });
  };

  const handleComplete = (otp) => {
    setIsloading(true);
    const payload = { ...route.params, otp: otp };
    verify_email(payload, (res, isSuccess) => {
      if (isSuccess) {
        setIsloading(false);
        navigation.navigate("CreatePassword", payload);
      } else {
        handleToast("info", "Your OTP has expired, send again", 2000, () => {
          navigation.dispatch(state => {
            const routes = state.routes.slice(0, -3);
            routes.push({ name: 'SignUp', params: payload });
            return CommonActions.reset({ ...state, index: routes.length - 1, routes });
          });
        });
        setIsloading(false);
      }
    });
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-white">

      <ReusableNavigation
        backgroundStyle={{ backgroundColor: '#fff' }}
        leftComponent={() => <BackButton navigation={navigation} />}
        middleComponent={() => <Text />}
        RightComponent={() => <Text />}
      />

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
              Enter confirmation Code
            </Text>

            <View className="pt-8 pb-20">
              <Text style={{ fontFamily: 'NunitoSemiBold', fontSize: 17 }} className="text-[#2B4752]">
                The 4-digit confirmation code has been sent to
              </Text>
              <Text style={{ fontFamily: 'NunitoSemiBold', fontSize: 17 }} className="text-[#2B4752]">
                {email}
              </Text>
            </View>

            <OTPInput
              length={4}
              onChange={(otp) => console.log('OTP changed:', otp)}
              onComplete={(otp) => {
                if (change) changeEmailVerify(otp);
                else if (type == "reset") handleReset(otp);
                else handleComplete(otp);
              }}
              error={false}
              focusColor="#005A55"
              errorColor="#B00020"
            />

            <View className="h-5" />

            <TouchableOpacity className="mb-10 items-center">
              <Text style={{ fontFamily: 'NunitoSemiBold', fontSize: 16, color: lighgreen }}>
                Didn't get it?{' '}
                <Text style={{ color: '#005A55', fontWeight: 'bold' }}>
                  Resend code
                </Text>
              </Text>
            </TouchableOpacity>

          </View>
        </ScrollView>

      </Pressable>

      {isLoading &&
        <Indicator onClose={() => setIsloading(false)} visible={isLoading}>
          <ActivityIndicator size="large" />
        </Indicator>
      }

    </SafeAreaView>
  );
};

export default ConfirmationCode;