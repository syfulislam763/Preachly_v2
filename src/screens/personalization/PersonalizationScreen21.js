import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import ReusableNavigation from '../../components/ReusabeNavigation';
import BackButton from '../../components/BackButton';
import ProgressBar from '../../components/ProgressBar';
import CommonButton from '../../components/CommonButton';
import { deepGreen, primaryText } from '../../components/Constant';
import GoalInfoScreen from '../../components/GoalInfoScreen';
import { faith_goal, get_onboarding_user_data } from './PersonalizationAPIs';
const scripture = require("../../../assets/img/scripture.png");
const conversation = require("../../../assets/img/conversation.png");
const share_faith = require("../../../assets/img/share_faith.png");

const goal_type = {
  "conversation": {
    title:"Faith Conversation Confidence",
    subtitle:"Not always sure what to say in the moment?",
    quote:"You're not alone, and that uncertainty is frustrating.",
    checkItems:[
      "Guidance responding to real faith questions",
      "Find clear, scripture-based answers quickly",
      "Build confidence through consistent conversation",
    ],
    badgeUrl:conversation,
  },

  "scripture": {
    title:"Scripture Knowledge",
    subtitle:"Want to understand Scripture more clearly?",
    quote:"That desire to understand deeply is the beginning of wisdom.",
    checkItems:[
      "Understand scripture in meaningful, practical ways",
      "Connect biblical truth to everyday life",
      "Explain God's Word with greater clarity",
    ],
    badgeUrl: scripture
  },

  "share_faith": {
      title:"Faith Depth & Influence",
      subtitle:"Want your faith to grow so you can encourage and inspire others?",
      quote:"Strong faith starts with a solid foundation.",
      checkItems:[
        "Deepen your personal faith and understanding",
        "Share meaningful insights with confidence",
        "Encourage others through truth and wisdom",
      ],
      badgeUrl: share_faith
  }



}





export default function PersonalizationScreen21() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [goal, setGoal] = useState("")


  useFocusEffect(
    useCallback(() => {
      get_onboarding_user_data(res => {
        console.log(JSON.stringify(res, null, 2), "ob")
        if(res){
          const goal_type = res?.data?.current_goal?.goal_type  ?? "";
          setGoal(goal_type)
        }
      })



    }, [])
  )





  return (
    <SafeAreaView style={styles.container}>

      <ReusableNavigation
        backgroundStyle={{ backgroundColor: '#fff' }}
        leftComponent={() => <BackButton navigation={navigation} />}
        middleComponent={() => <Text />}
        RightComponent={() => <Text />}
      />

      <View style={styles.wrapper}>

        <ProgressBar progress={12.5 * 4} />

        <View className='flex-row justify-center items-center mt-5'>
          <Text className='text-[#3F5862] text-xl font-[NunitoSemiBold]'>Your Selected Path:</Text>
        </View>
        {/* Dynamic content */}
        <GoalInfoScreen
          title={goal_type[goal]?.title}
          subtitle={goal_type[goal]?.subtitle}
          quote={goal_type[goal]?.quote}
          checkItems={goal_type[goal]?.checkItems}
          badgeUrl={goal_type[goal]?.badgeUrl}
        />

        {/* Fixed bottom */}
        <View style={{ paddingBottom: insets.bottom }}>
          <CommonButton
            btnText="Start My Journey"
            bgColor={deepGreen}
            navigation={navigation}
            route={""}
            handler={() => navigation.navigate("Personalization3")}
            txtColor={primaryText}
            bold="bold"
          />
        </View>

      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  wrapper: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
});