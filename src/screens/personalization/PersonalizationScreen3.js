import React, { useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import ProgressBar from '../../components/ProgressBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import CommonButton from '../../components/CommonButton';
import { deepGreen, primaryText } from '../../components/Constant';
import SelectableCard from '../../components/SelectableCard';
import { tone_preference } from './PersonalizationAPIs';
import { useNavigation } from '@react-navigation/native';
import Indicator from '../../components/Indicator';
import useAppStore from '@/context/useAppStore';
import ReusableNavigation from '../../components/ReusabeNavigation';
import BackButton from '../../components/BackButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PersonalizationScreen3() {
  const { store } = useAuth();
  const tone_preference_data = useAppStore((s) => s.onboarding.tone_preference_data);
  const insets = useSafeAreaInsets();

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [id, setId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const handleSubmit = () => {
    const payload = { tone_preference_option: id };
    setIsLoading(true);
    tone_preference(payload, (response, success) => {
      setIsLoading(false);
      if (success) {
        navigation.navigate("Personalization4");
      } else {
        console.error("Error submitting tone preference:", response);
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
          <ProgressBar progress={12.5 * 5} />

          <Text
            style={{ fontFamily: 'DMSerifDisplay', lineHeight: 35 }}
            className="text-[26px] text-[#0B172A] text-center  pt-10 pb-4"
          >
            What tone speaks to you?
          </Text>

          <Text
            style={{ fontFamily: 'NunitoSemiBold' }}
            className="text-lg text-[#2B4752] text-center pb-5"
          >
            Personalize how your inspired answers and insights will sound
          </Text>

          {tone_preference_data.map((item, idx) => (
            <SelectableCard
              key={idx}
              title={item.title}
              description={item.description}
              quote={item.quote}
              selected={selectedIndex === idx}
              onSelect={(index) => {
                setSelectedIndex(index);
                setId(item.id);
              }}
              index={idx}
              icon={item.icon}
            />
          ))}
        </ScrollView>

        <View style={{paddingBottom:insets.bottom}}>
          <CommonButton
            btnText={"Select Tone"}
            bgColor={deepGreen}
            navigation={navigation}
            route={""}
            handler={handleSubmit}
            txtColor={primaryText}
            bold='bold'
            opacity={selectedIndex !== null ? 1 : 0.5}
            disabled={selectedIndex === null}
          />
          <Text
            style={{ fontFamily: 'Nunito' }}
            className="text-base text-[#90B2B2] text-center pt-3"
          >
            Not sure? You can change your tone later in your profile settings
          </Text>
        </View>

      </View>

      {isLoading &&
        <Indicator visible={isLoading} onClose={() => setIsLoading(false)}>
          <ActivityIndicator size="large" />
        </Indicator>
      }

    </SafeAreaView>
  );
}