import React from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import CommonButton from '../../components/CommonButton';
import { deepGreen, primaryText } from '../../components/Constant';
import ParagraphIcon from '../../components/ParagraphIcon';
import useAppStore from '@/context/useAppStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import ReusableNavigation from '../../components/ReusabeNavigation';
import BackButton from '../../components/BackButton';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height } = Dimensions.get('window');

const SubscriptionConfirmedScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const setPayment = useAppStore((s) => s.setPayment);

  return (
    <View className="flex-1 bg-white relative" style={{ paddingTop: insets.top }}>

      <ReusableNavigation
        backgroundStyle={{ backgroundColor: '#fff' }}
        leftComponent={() => <Text/>}
        middleComponent={() => (
          <Text
            style={{ fontFamily: 'NunitoSemiBold', color: '#0B172A', fontSize: 18 }}
            className="mr-10"
          >
            Subscription
          </Text>
        )}
        RightComponent={() => <Text />}
      />

      {/* Text block at top */}
      <View
        className="w-full bg-white px-5 mt-5"
      >
        <View className='w-full flex-row justify-center'>
          <Text
          style={{ fontFamily: 'DMSerifDisplay' }}
          className="text-[28px] text-[#0B172A] text-center"
        >
          You're Equipped to Grow
        </Text>
        </View>

        <Text
          style={{ fontFamily: 'NunitoSemiBold', fontSize: 17 }}
          className="text-[#2B4752] text-center p-5"
        >
          Words have power - now you have even more at your fingertips
        </Text>

        <ParagraphIcon
          icon={require("../../../assets/img/infinity.png")}
          text={"Unlimited access to Inspired Answers"}
        />
        <ParagraphIcon
          icon={require("../../../assets/img/bulb.png")}
          text={"Save and revisit meaningful insights"}
        />
        <ParagraphIcon
          icon={require("../../../assets/img/message.png")}
          text={"Speak confidently using scripture"}
        />
      </View>

      {/* Large image — fills from 20% top to bottom */}
      <Image
        source={require('../../../assets/img/bg_large1.png')}
        style={{
          width: '100%',
          height: height * 0.65,
          position: 'absolute',
          top: (height * 42) / 100,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
          resizeMode: 'contain',
        }}
      />

      {/* Button pinned to bottom */}
      <View
        className="absolute left-0 right-0 px-5"
        style={{ bottom: (height * 5) / 100, zIndex: 5 }}
      >
        <CommonButton
          btnText={"Find Answers"}
          bgColor={deepGreen}
          navigation={navigation}
          route={""}
          handler={() => setPayment({ has_subscription: true })}
          txtColor={primaryText}
          bold='bold'
          opacity={1}
        />
      </View>

    </View>
  );
};

export default SubscriptionConfirmedScreen;