import React from 'react';
import {
  View,
  Text,
  Keyboard,
  Pressable,
  ScrollView,
} from 'react-native';
import { deepGreen } from '../../components/Constant';
import { SafeAreaView } from 'react-native-safe-area-context';
import CommonButton from '../../components/CommonButton';
import { useRoute, useNavigation } from '@react-navigation/native';
import ReusableNavigation from '../../components/ReusabeNavigation';
import BackButton from '../../components/BackButton';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ConfirmationEmail() {
  const route = useRoute();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets()

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
            
          </Text>
        )}
        RightComponent={() => <Text />}
      />

      <Pressable onPress={() => Keyboard.dismiss()} className="flex-1">

        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 px-5 pt-16">

            <Text
              style={{ fontFamily: 'DMSerifDisplay' }}
              className="text-3xl text-[#0B172A] mb-2 flex-wrap"
            >
              Confirmation email has been sent
            </Text>

            <Text
              style={{ fontFamily: 'NunitoSemiBold', lineHeight: 24 }}
              className="text-lg text-[#2B4752] pt-2 pb-8"
            >
              Check your email for{' '}
              <Text style={{ fontFamily: 'NunitoExtraBold' }} className="text-[#0b182a]">
                {route?.params ? route?.params?.email : 'qwerty123@gmail.com'}
              </Text>
              {' '}to which the confirmation email was sent
            </Text>

          </View>
        </ScrollView>

        {/* Button pinned at bottom */}
        <View style={{paddingBottom: insets.bottom+10}} className="px-5">
          <CommonButton
            btnText={"Enter Confirmation Code"}
            bgColor={deepGreen}
            navigation={navigation}
            route={""}
            handler={() => navigation.navigate("ConfirmationCode", route.params)}
            txtColor={"#fff"}
            opacity={1}
          />
        </View>

      </Pressable>

    </SafeAreaView>
  );
}