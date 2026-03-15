import React, { useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import ProgressBar from '../../components/ProgressBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import CommonButton from '../../components/CommonButton';
import { deepGreen, primaryText } from '../../components/Constant';
import CustomSelect from '../../components/CustomSelect';
import { useNavigation } from '@react-navigation/native';
import { bible_version } from './PersonalizationAPIs';
import Indicator from '../../components/Indicator';
import useAppStore from '@/context/useAppStore';
import ReusableNavigation from '../../components/ReusabeNavigation';
import BackButton from '../../components/BackButton';

export default function PersonalizationScreen5() {
  const { store } = useAuth();
  const bible_versions = useAppStore((s) => s.onboarding.bible_versions);

  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSubmit = () => {
    setLoading(true);
    const payload = { bible_version_option: selectedItem.id };
    bible_version(payload, (data, success) => {
      if (success) {
        setLoading(false);
        navigation.navigate("Personalization6");
      } else {
        setLoading(false);
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
          <ProgressBar progress={14.28 * 6} />

          <Text
            style={{ fontFamily: 'DMSerifDisplay', lineHeight: 35 }}
            className="text-[32px] text-[#0B172A] text-center py-10"
          >
            Select your preferred Bible version
          </Text>

          <CustomSelect
            items={bible_versions}
            placeholder='Bible Version'
            onSelect={(item) => setSelectedItem(item)}
          />
        </ScrollView>

        <View className="pb-8">
          <CommonButton
            btnText={"Continue"}
            bgColor={deepGreen}
            navigation={navigation}
            route={""}
            handler={handleSubmit}
            txtColor={primaryText}
            bold='bold'
            opacity={selectedItem === null ? 0.5 : 1}
            disabled={selectedItem === null}
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