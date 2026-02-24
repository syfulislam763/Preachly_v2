// screens/QuestionScreen.js
import React from 'react';
import { SafeAreaView } from 'react-native';
import FaithQuestionSlider from '../../../components/FaithQuestionSlider';

export default function QuestionScreen() {
  const question = "How confident do you feel about the direction of your faith journey?";

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <FaithQuestionSlider  />
    </SafeAreaView>
  );
}
