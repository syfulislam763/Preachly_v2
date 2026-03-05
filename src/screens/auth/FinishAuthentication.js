import React, { useState } from 'react';
import { View, Text, Image, Dimensions, ActivityIndicator } from 'react-native';
import CommonButton from '../../components/CommonButton';
import { deepGreen, primaryText } from '../../components/Constant';
import useLayoutDimention from '../../hooks/useLayoutDimention';
import { get_onboarding_all_data } from '../personalization/PersonalizationAPIs';
import { useNavigation } from '@react-navigation/native';
import Indicator from '../../components/Indicator';
import useAppStore from '@/context/useAppStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import ReusableNavigation from '../../components/ReusabeNavigation';
import BackButton from '@/components/BackButton';

const { height } = Dimensions.get('window');

const FinishAuthentication = () => {
  const navigation = useNavigation();
  const { isSmall } = useLayoutDimention();
  const [loading, setLoading] = useState(false);

  const access = useAppStore((s) => s.auth.access);
  const refresh = useAppStore((s) => s.auth.refresh);
  const onboarding_completed = useAppStore((s) => s.auth.onboarding_completed);
  const setOnboardingData = useAppStore((s) => s.setOnboardingData);
  const setAuth = useAppStore((s) => s.setAuth);

  console.log(refresh, "finish");

  const handleForward = () => {
    setLoading(true);
    get_onboarding_all_data(access, (res, success) => {
      setLoading(false);
      if (!success) {
        console.log('Failed to get onboarding data', res);
        return;
      }
      setOnboardingData(res.data);
      setAuth({ access, refresh, isLoggedIn: true });
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

      {/* Main container — relative so image and button can be absolutely positioned */}
      <View className="flex-1 bg-white relative">

        {/* Text block at top */}
        <View
          className="w-full bg-white items-center px-5"
          style={{ marginTop: isSmall ? 0 : '8%' }}
        >
          <Text
            style={{ fontFamily: 'DMSerifDisplay' }}
            className={`text-[#0B172A] ${isSmall ? 'text-[28px]' : 'text-[32px]'}`}
          >
            You're in!
          </Text>

          <Text
            style={{ fontFamily: 'DMSerifDisplay' }}
            className={`text-[#005A55] ${isSmall ? 'text-[28px]' : 'text-[32px]'}`}
          >
            Welcome to Preachly
          </Text>

          <Text
            style={{ fontFamily: 'NunitoSemiBold', lineHeight: 22 }}
            className={`text-[#2B4752] text-center ${isSmall ? 'text-base pt-2 pb-2 px-5' : 'text-lg p-5'}`}
          >
            Let's tailor your experience to help you grow in faith and confidence.
          </Text>
        </View>

        {/* Large image — bottom touched, fills downward from ~17% top */}
        <Image
          source={require('../../../assets/img/Preachly.png')}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            position: 'absolute',
            top: (height * 17) / 100,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1,
          }}
        />

        {/* Button pinned to bottom, sits above image */}
        <View
          className="absolute left-0 right-0 px-5"
          style={{ bottom: (height * 6) / 100, zIndex: 5 }}
        >
          <CommonButton
            btnText={onboarding_completed ? 'Go to home' : 'Go to personalization'}
            bgColor={deepGreen}
            navigation={navigation}
            route=""
            handler={handleForward}
            txtColor={primaryText}
            bold="bold"
            opacity={1}
          />
        </View>

      </View>

      {loading && (
        <Indicator visible={loading} onClose={() => setLoading(false)}>
          <ActivityIndicator size="large" />
        </Indicator>
      )}

    </SafeAreaView>
  );
};

export default FinishAuthentication;