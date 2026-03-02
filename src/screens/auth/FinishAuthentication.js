import React, { useState } from 'react';
import { View, Text, Image, Dimensions, ActivityIndicator } from 'react-native';
import CommonButton from '../../components/CommonButton';
import { deepGreen, primaryText } from '../../components/Constant';
import useLayoutDimention from '../../hooks/useLayoutDimention';
import { getStyles } from './authStyles/FinishAuthenticationStyle';
import { setAuthToken } from '../../context/api';
import { get_onboarding_all_data } from '../personalization/PersonalizationAPIs';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Indicator from '../../components/Indicator';

import useAppStore from '@/context/useAppStore';

const { height } = Dimensions.get('window');

const FinishAuthentication = () => {
  const navigation = useNavigation();
  const { isSmall, isMedium, isLarge, isFold } = useLayoutDimention();
  const styles = getStyles(isSmall, isMedium, isLarge, isFold);
  const [loading, setLoading] = useState(false);

  const access = useAppStore((s) => s.auth.access);
  const refresh = useAppStore((s) => s.auth.refresh);
  const onboarding_completed = useAppStore((s) => s.auth.onboarding_completed);
  const setOnboardingData = useAppStore((s) => s.setOnboardingData);
  const setAuth = useAppStore((s) => s.setAuth);
  const onboarding = useAppStore((s) => s.onboarding);


  console.log(refresh, "finish")

  const handleForward = () => {
    setLoading(true);

    get_onboarding_all_data(access, (res, success) => {
      setLoading(false);

      if (!success) {
        console.log('Failed to get onboarding data', res);
        return;
      }

      setOnboardingData(res.data);
      setAuth({access, refresh, isLoggedIn: true})
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.successText}>You're in!</Text>
        <Text style={styles.welcomeTitle}>Welcome to Preachly</Text>
        <Text style={styles.subtitle}>
          Let's tailor your experience to help you grow in faith and confidence.
        </Text>
      </View>

      <Image
        source={require('../../../assets/img/Preachly.png')}
        style={{
          height: '100%',
          width: '100%',
          objectFit: 'contain',
          position: 'absolute',
          top: (height * 17) / 100,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
        }}
      />

      <View style={styles.btnContainer}>
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

      {loading && (
        <Indicator visible={loading} onClose={() => setLoading(false)}>
          <ActivityIndicator size="large" />
        </Indicator>
      )}
    </View>
  );
};

export default FinishAuthentication;