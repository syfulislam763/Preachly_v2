
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

export default function PersonalizationScreen23() {
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

        <ProgressBar progress={10 * 6} />

        {/* Dynamic content */}
        <GoalInfoScreen
          title="Faith Depth & Influence"
          subtitle="Want your faith to grow so you can encourage and inspire others?"
          quote="Strong faith starts with a solid foundation."
          checkItems={[
            "Deepen your personal faith and understanding",
            "Share meaningful insights with confidence",
            "Encourage others through truth and wisdom",
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