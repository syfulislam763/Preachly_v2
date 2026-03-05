import React from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ReusableNavigation from '../../../components/ReusabeNavigation';
import BackButton from '../../../components/BackButton';

const AboutApp = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-white">

      <ReusableNavigation
        backgroundStyle={{ backgroundColor: '#fff' }}
        leftComponent={() => <BackButton navigation={navigation} />}
        middleComponent={() => (
          <Text
            style={{ fontFamily: 'NunitoSemiBold', color: '#0B172A', fontSize: 18 }}
            className="mr-10"
          >
            About App
          </Text>
        )}
        RightComponent={() => <Text />}
      />

      <View className="flex-1 bg-white px-5 py-10">

        {/* App icon + name + version */}
        <View className="flex-col items-center justify-between mb-6">
          <Image
            source={require("../../../../assets/img/AppIcon.png")}
            style={{ height: 90, width: 90, objectFit: 'contain' }}
          />
          <Text
            style={{ fontFamily: 'NunitoBold' }}
            className="text-[20px] text-[#0B172A] pt-8"
          >
            Preachly
          </Text>
          <Text
            style={{ fontFamily: 'NunitoSemiBold' }}
            className="text-base text-[#90B2B2] py-4"
          >
            Version 1.0.0
          </Text>
        </View>

        <Pressable onPress={() => navigation.navigate("PrivacyPolicy")}>
          <View style={styles.settingMenu}>
            <Text style={styles.menuText}>Privacy Policy</Text>
            <Image source={require("../../../../assets/img/CaretRight.png")} style={styles.caretRight} />
          </View>
        </Pressable>

        <View className="h-4" />

        <Pressable onPress={() => navigation.navigate("TermsAndCondition")}>
          <View style={styles.settingMenu}>
            <Text style={styles.menuText}>Terms and Conditions</Text>
            <Image source={require("../../../../assets/img/CaretRight.png")} style={styles.caretRight} />
          </View>
        </Pressable>

      </View>

    </SafeAreaView>
  );
};

export default AboutApp;

const styles = StyleSheet.create({
  menuText: {
    fontFamily: 'NunitoSemiBold',
    color: '#0B172A',
    fontSize: 18,
  },
  settingMenu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F3F8F8',
    padding: 15,
    borderRadius: 20,
  },
  caretRight: {
    width: 20,
    height: 20,
    objectFit: 'contain',
  },
});