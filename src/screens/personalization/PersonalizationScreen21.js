import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import ReusableNavigation from '../../components/ReusabeNavigation';
import BackButton from '../../components/BackButton';
import ProgressBar from '../../components/ProgressBar';
import CommonButton from '../../components/CommonButton';
import { deepGreen, primaryText } from '../../components/Constant';
import GoalInfoScreen from '../../components/GoalInfoScreen';

export default function PersonalizationScreen21() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={styles.container}>

      <ReusableNavigation
        backgroundStyle={{ backgroundColor: '#fff' }}
        leftComponent={() => <BackButton navigation={navigation} />}
        middleComponent={() => <Text />}
        RightComponent={() => <Text />}
      />

      <View style={styles.wrapper}>

        <ProgressBar progress={10 * 4} />

        {/* Dynamic content */}
        <GoalInfoScreen
          title="Faith Conversation Confidence"
          subtitle="Not always sure what to say in the moment?"
          quote="You're not alone, and that uncertainty is frustrating."
          checkItems={[
            "Guidance responding to real faith questions",
            "Find clear, scripture-based answers quickly",
            "Build confidence through consistent conversation",
          ]}
          badgeUrl="https://api.preachly.app/media/checkin/badges/MicrosoftTeams-image_2.png"
        />

        {/* Fixed bottom */}
        <View style={{ paddingBottom: insets.bottom }}>
          <CommonButton
            btnText="Start My Journey"
            bgColor={deepGreen}
            navigation={navigation}
            route={""}
            handler={() => navigation.navigate("Personalization22")}
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