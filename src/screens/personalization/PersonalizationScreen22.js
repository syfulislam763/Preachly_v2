
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

export default function PersonalizationScreen22() {
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

        <ProgressBar progress={10 * 5} />

        {/* Dynamic content */}
        <GoalInfoScreen
          title="Scripture Knowledge"
          subtitle="Want to understand Scripture more clearly?"
          quote="That desire to understand deeply is the beginning of wisdom."
          checkItems={[
            "Understand scripture in meaningful, practical ways",
            "Connect biblical truth to everyday life",
            "Explain God's Word with greater clarity",
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
            handler={() => navigation.navigate("Personalization23")}
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