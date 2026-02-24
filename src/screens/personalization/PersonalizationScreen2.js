import React from 'react';
import { View, Text, StyleSheet, Image} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import ProgressBar from '../../components/ProgressBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import CommonButton from '../../components/CommonButton';
import { deepGreen, primaryText } from '../../components/Constant';
import QuestionSlider from '../../components/QuestionSlider';
import useLayoutDimention from '../../hooks/useLayoutDimention';
import {getStyles} from './personalizationScreen2Style'
import { useNavigation } from '@react-navigation/native';
import { faith_goal } from './PersonalizationAPIs';
import { ActivityIndicator } from 'react-native';
import Indicator from '../../components/Indicator';

export default function PersonalizationScreen2() {
  const {isSmall, isMedium, isLarge, isFold} = useLayoutDimention()
  const [selectedOptions, setSelectedOptions] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const navigation = useNavigation();

  const handleSubmit = () => {
    setLoading(true);
    const allOptions = selectedOptions.map((id) => ({faith_goal_option: id}))
    const payload = {
      goals: allOptions
    };
    
    console.log(payload, "onboarding")
    faith_goal(payload, (data, success) => {
      setLoading(false);
      if (success) {
        console.log("Faith Goals submitted successfully: ", data);
        navigation.navigate("Personalization3");
      } else {
        console.error("Error submitting Faith Goals: ", data);
      }
    });
  }

  const styles = getStyles(isSmall, isMedium, isLarge, isFold)

  return (
    <View style={styles.container}>
      
      <View>
        <View style={{}}>
          <ProgressBar progress={14.28*3} />
        </View>

        <Text style={styles.title}>What brings you to Preachly</Text>

        <Text style={styles.text}>We'll personalize recommendations based on your goals</Text>


      <QuestionSlider
        savedOptions={selectedOptions}
        setSavedOptions={setSelectedOptions}
      />
        

       
      </View>

      <CommonButton
          btnText={"Continue"}
          bgColor={deepGreen}
          navigation={navigation}
          route={""}
          handler={handleSubmit}
          txtColor={primaryText}
          bold='bold'
          opacity={selectedOptions.length < 3 ? 0.5 : 1}
          disabled={selectedOptions.length < 3 ? true : false}
      />

      {loading && (
        <Indicator>
          <ActivityIndicator size="large"/>
        </Indicator>
      )}
    </View>
  );
}

