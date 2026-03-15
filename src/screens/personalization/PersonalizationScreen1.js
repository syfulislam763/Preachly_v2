import React, { useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import ProgressBar from '../../components/ProgressBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import CommonButton from '../../components/CommonButton';
import { deepGreen, primaryText } from '../../components/Constant';
import CustomSelect from '../../components/CustomSelect';
import { denomination } from './PersonalizationAPIs';
import Indicator from '../../components/Indicator';
import { useNavigation } from '@react-navigation/native';
import useAppStore from '@/context/useAppStore';
import ReusableNavigation from '../../components/ReusabeNavigation';
import BackButton from '../../components/BackButton';

export default function PersonalizationScreen1() {
  const { store } = useAuth();
  const denominations = useAppStore((s) => s.onboarding.denominations);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleDenomination = () => {
    setLoading(true);
    const payload = { denomination_option: selectedItem.id };
    denomination(payload, (data, success) => {
      setLoading(false);
      if (success) {
        console.log("Denomination saved successfully", data);
        navigation.navigate("Personalization2");
      } else {
        console.error("Error saving denomination", data);
      }
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">

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
          <ProgressBar progress={14.28 * 2} />

          <Text
            style={{ fontFamily: 'DMSerifDisplay', lineHeight: 35 }}
            className="text-[32px] text-[#0B172A] text-center px-10 py-10"
          >
            Select your denomination
          </Text>

          <CustomSelect
            items={denominations}
            placeholder='Select Denomination'
            onSelect={(item) => setSelectedItem(item)}
          />
        </ScrollView>

        <View className="pb-8">
          <CommonButton
            btnText={"Continue"}
            bgColor={deepGreen}
            navigation={navigation}
            route={""}
            txtColor={primaryText}
            bold='bold'
            handler={handleDenomination}
            opacity={selectedItem === null ? 0.5 : 1}
            disabled={selectedItem === null}
          />
        </View>

      </View>

      {loading &&
        <Indicator visible={loading} onClose={() => setLoading(false)}>
          <ActivityIndicator size="large" />
        </Indicator>
      }

    </SafeAreaView>
  );
}