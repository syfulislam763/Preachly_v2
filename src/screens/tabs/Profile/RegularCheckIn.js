import React, { useState } from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import CommonButton from '../../../components/CommonButton';
import { deepGreen, primaryText } from '../../../components/Constant';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import QuestionModal from './QuestionModal';
import ReusableNavigation from '../../../components/ReusabeNavigation';
import BackButton from '../../../components/BackButton';

const { width, height } = Dimensions.get("window");

const RegularCheckIn = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { title } = route.params;
  const [modalVisible, setModalVisible] = useState(false);

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
            {title}
          </Text>
        )}
        RightComponent={() => <Text />}
      />

      <View className="flex-1 justify-between px-5 pb-11">

        <View className="flex-1 items-center justify-center">
          <Image
            source={require("../../../../assets/img/create_weekly_check_in.png")}
            style={{ width: width * 0.8, height: height * 0.35, resizeMode: 'contain' }}
          />

          <Text
            style={{ fontFamily: 'DMSerifDisplay', lineHeight: 35 }}
            className="text-[32px] text-[#0B172A] text-center pt-6 pb-3"
          >
            Time for a heart check!
          </Text>

          <Text
            style={{ fontFamily: 'NunitoSemiBold', lineHeight: 22 }}
            className="text-base text-[#2B4752] text-center px-2"
          >
            Take a moment to reflect on your faith journey this week. Your growth, clarity, and connection matter—this isn't just a habit, it's a step toward a more powerful, confident faith
          </Text>
        </View>

        <CommonButton
          btnText={"Start Check-In"}
          bgColor={deepGreen}
          navigation={navigation}
          route={""}
          txtColor={primaryText}
          bold='bold'
          handler={() => setModalVisible(true)}
          opacity={1}
        />

      </View>

      {modalVisible && (
        <QuestionModal
          modalVisible={modalVisible}
          setModalVisible={() => setModalVisible(false)}
          navigation={navigation}
        />
      )}

    </SafeAreaView>
  );
};

export default RegularCheckIn;