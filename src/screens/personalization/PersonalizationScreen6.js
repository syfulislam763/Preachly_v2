import React from 'react';
import { View, Text, Image, ActivityIndicator, ScrollView } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import ProgressBar from '../../components/ProgressBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import CommonButton from '../../components/CommonButton';
import { deepGreen, primaryText } from '../../components/Constant';
import WeeklyCalendar from '../../components/WeeklyCalendar';
import { onboarding_complete } from './PersonalizationAPIs';
import { useNavigation } from '@react-navigation/native';
import Indicator from '../../components/Indicator';
import useAppStore from '@/context/useAppStore';
import ReusableNavigation from '../../components/ReusabeNavigation';
import BackButton from '../../components/BackButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PersonalizationScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = React.useState(false);
  const { store, updateStore } = useAuth();
  const setOnboardingCompleted = useAppStore((s) => s.setOnboardingCompleted);
  const insets = useSafeAreaInsets()

  const handleSubmit = () => {
    setLoading(true);
    onboarding_complete((data, success) => {
      setLoading(false);
      if (success) {
        navigation.navigate("Notification");
      } else {
        console.error(data);
      }
    });
  };

  return (
    <SafeAreaView  className="flex-1 bg-white">

      <ReusableNavigation
        backgroundStyle={{ backgroundColor: '#fff' }}
        leftComponent={() => <BackButton navigation={navigation} />}
        middleComponent={() => <Text />}
        RightComponent={() => <Text />}
      />

      <View className="flex-1 justify-between px-5 py-2.5">

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <ProgressBar progress={100} />

          <Text
            style={{ fontFamily: 'DMSerifDisplay', lineHeight: 35 }}
            className="text-[26px] text-[#0B172A] text-center pt-7"
          >
            Grow in Faith.
          </Text>
          <Text
            style={{ fontFamily: 'DMSerifDisplay', lineHeight: 35 }}
            className="text-[26px] text-[#0B172A] text-center pb-7"
          >
            Speak with Confidence.
          </Text>

          {/* Text block */}
          <View className="items-center pb-4">
            <Text style={{ fontFamily: 'NunitoSemiBold' }} className="text-base text-[#2B4752] text-center">
              Build a daily rhythm of scripture, reflection, and confidence for real faith conversations. Unlock unique badges that reflect your growth
            </Text>
          </View>

          {/* Weekly Calendar */}
          <View className="pt-2">
            <WeeklyCalendar />
          </View>

          {/* Fire streak caption */}
          <View className="flex-row items-center px-5 pt-4 pb-2">
            <Image
              source={require("../../../assets/img/Fire.png")}
            />
            <Text style={{ fontFamily: 'NunitoSemiBold', fontSize: 14 }} className="text-[#2B4752] ml-2">
              You're on{' '}
              <Text style={{ fontFamily: 'NunitoBold', color: '#2B4752' }}>Day 1</Text>
              {' '}of growing your faith confidence!
            </Text>
          </View>

          {/* Rooted image */}
          <Image
            source={require("../../../assets/img/rooted.png")}
            className="w-full my-3"
            style={{ resizeMode: 'contain', height: 145 }}
          />

          {/* Footer text */}
          <Text
            style={{ fontFamily: 'NunitoSemiBold' }}
            className="text-base text-[#90B2B2] text-center px-5 pt-2 pb-4"
          >
            Confidence grows with consistency. Keep showing up.
          </Text>

        </ScrollView>

        <View style={{paddingBottom:insets.bottom}}>
          <CommonButton
            btnText={"Continue"}
            bgColor={deepGreen}
            navigation={navigation}
            route={""}
            handler={handleSubmit}
            txtColor={primaryText}
            bold='bold'
            opacity={1}
          />
        </View>

      </View>

      {loading &&
        <Indicator onClose={() => setLoading(false)} visible={loading}>
          <ActivityIndicator size="large" />
        </Indicator>
      }

    </SafeAreaView>
  );
}