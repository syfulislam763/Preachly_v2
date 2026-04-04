import React from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import ProgressBar from '../../components/ProgressBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import CommonButton from '../../components/CommonButton';
import { deepGreen, primaryText } from '../../components/Constant';
import QuestionSlider from '../../components/QuestionSlider';
import { useNavigation } from '@react-navigation/native';
import { faith_goal } from './PersonalizationAPIs';
import Indicator from '../../components/Indicator';
import ReusableNavigation from '../../components/ReusabeNavigation';
import BackButton from '../../components/BackButton';

export default function PersonalizationScreen2() {
  const [selectedOptions, setSelectedOptions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const navigation = useNavigation();

  const handleSubmit = () => {
    setLoading(true);
    const allOptions = selectedOptions.map((id) => ({ faith_goal_option: id }));
    const payload = { goals: allOptions };

    console.log(payload, "onboarding");
    faith_goal(payload, (data, success) => {
      setLoading(false);
      if (success) {
        console.log("Faith Goals submitted successfully: ", data);
        navigation.navigate("Personalization3");
      } else {
        console.error("Error submitting Faith Goals: ", data);
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
          <ProgressBar progress={14.28 * 3} />

          <Text
            style={{ fontFamily: 'DMSerifDisplay', lineHeight: 35 }}
            className="text-[32px] text-[#0B172A] text-center px-10 py-10"
          >
            What brings you to Preachly
          </Text>

          <Text
            style={{ fontFamily: 'NunitoSemiBold' }}
            className="text-lg text-[#2B4752] text-center px-5 pb-5"
          >
            We'll personalize recommendations based on your goals
          </Text>

          <QuestionSlider
            savedOptions={selectedOptions}
            setSavedOptions={setSelectedOptions}
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
            opacity={selectedOptions.length < 6 ? 0.5 : 1}
            disabled={selectedOptions.length < 6}
          />
        </View>

      </View>

      {loading && (
        <Indicator>
          <ActivityIndicator size="large" />
        </Indicator>
      )}

    </SafeAreaView>
  );
}