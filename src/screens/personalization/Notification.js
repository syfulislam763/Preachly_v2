import React from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CommonButton from '../../components/CommonButton';
import { deepGreen, primaryText, lightgreen1 } from '../../components/Constant';
import useAppStore from '@/context/useAppStore';
import ReusableNavigation from '../../components/ReusabeNavigation';
import BackButton from '../../components/BackButton';
import { useNavigation } from '@react-navigation/native';

export default function Notification() {
  const navigation = useNavigation();
  const setOnboardingCompleted = useAppStore((s) => s.setOnboardingCompleted);

  const finishOnboarding = () => {
    setOnboardingCompleted(true);
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-white">

      <ReusableNavigation
        backgroundStyle={{ backgroundColor: '#fff' }}
        leftComponent={() => <BackButton navigation={navigation} />}
        middleComponent={() => <Text />}
        RightComponent={() => (
          <TouchableOpacity onPress={() => finishOnboarding()}>
            <Text
              style={{ fontFamily: 'NunitoSemiBold', color: '#0B172A', fontSize: 15 }}
              className="mr-5 underline"
            >
              Skip
            </Text>
          </TouchableOpacity>
        )}
      />

      <View className="flex-1 justify-between px-5 py-2.5">

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ flexGrow: 1 }}
        >
          <View className="flex-1 items-center justify-center px-5 py-10">
            <Image source={require("../../../assets/img/bell-alert.png")} />

            <Text
              style={{ fontFamily: 'DMSerifDisplay' }}
              className="text-[26px] text-[#0B172A] text-center px-5 pt-5 pb-2"
            >
              Turn On Notifications
            </Text>

            <Text
              style={{ fontFamily: 'NunitoSemiBold', lineHeight: 23 }}
              className="text-base text-[#2B4752] text-center px-4"
            >
              Never miss a moment to grow in faith. Get gentle reminders, uplifting messages, and timely insights to keep you inspired on your journey
            </Text>
          </View>
        </ScrollView>

        <View className="pb-16">
          
          <CommonButton
            btnText={"Continue"}
            bgColor={deepGreen}
            navigation={navigation}
            route={""}
            handler={finishOnboarding}
            txtColor={primaryText}
            bold='bold'
            opacity={1}
          />
        </View>

      </View>

    </SafeAreaView>
  );
}