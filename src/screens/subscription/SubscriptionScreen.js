import React, { useState } from 'react';
import { View, Text, ImageBackground, Dimensions, ScrollView } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import CommonButton from '../../components/CommonButton';
import PlanSelector from '../../components/SubscriptionPlan';
import ParagraphIcon from '../../components/ParagraphIcon';
import { useNavigation } from '@react-navigation/native';
import BackButton from '../../components/BackButton';
import useAppStore from '@/context/useAppStore';
import ReusableNavigation from '../../components/ReusabeNavigation';
import { SafeAreaView } from 'react-native-safe-area-context';


const { height } = Dimensions.get("window");

export default function SubscriptionScreen() {
  const { login, completePersonalization, completeSubscription } = useAuth();
  const navigation = useNavigation();
  const [selectedPlanType, setSelectedPlanType] = useState('yearly');
  const setPayment = useAppStore((s) => s.setPayment);

  const handleSubscription = () => {
    navigation.navigate("SubscriptionConfirmedScreen")
  };

  return (
    <SafeAreaView edges={["top"]} className='flex-1 bg-[#FFEAC2]'>

      {/* Navigation header — same pattern as all other screens */}
      <ReusableNavigation
        backgroundStyle={{ backgroundColor: '#FFE9BD' }}
        leftComponent={() => <Text/>}
        middleComponent={() => (
          <Text
            style={{ fontFamily: 'NunitoSemiBold', color: '#0B172A', fontSize: 18 }}
            className=""
          >
            Subscription
          </Text>
        )}
        RightComponent={() => <Text />}
      />

      <View className="flex-1 relative">

        {/* Background image — top 28% of remaining space */}
        <ImageBackground
          source={require('../../../assets/img/bg_large2.png')}
          style={{ height: height * 0.28, width: '100%' }}
          resizeMode="cover"
        >
          <Text
            style={{ fontFamily: 'DMSerifDisplay', lineHeight: 35 }}
            className="text-[32px] text-[#0B172A] text-center px-8 pt-2"
          >
            Inspired Answers, When You're Lost for Words
          </Text>
        </ImageBackground>

        {/* Content card — overlaps image with rounded top corners */}
        <ScrollView
          style={{
            position: 'absolute',
            top: height * 0.22,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#fff',
            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
          }}
          contentContainerStyle={{ padding: 20, paddingBottom: 60 }}
          showsVerticalScrollIndicator={false}
        >
          <ParagraphIcon
            icon={require("../../../assets/img/24-sunset.png")}
            text={"Know what to say when faith conversations matter most"}
          />
          <ParagraphIcon
            icon={require("../../../assets/img/bird.png")}
            text={"Understand scripture with clarity and context"}
          />
          <ParagraphIcon
            icon={require("../../../assets/img/piramid.png")}
            text={"Share what you believe with confidence"}
          />

          <PlanSelector
            plan={selectedPlanType}
            setSelectedPlanType={setSelectedPlanType}
          />

          <CommonButton
            btnText={"Start My Free Trial"}
            bgColor={"#005A55"}
            navigation={navigation}
            route={""}
            handler={handleSubscription}
            txtColor={"#fff"}
            opacity={1}
          />

          <Text
            style={{ fontFamily: 'NunitoSemiBold' }}
            className="text-base text-[#90B2B2] text-center px-4 py-5"
          >
            Cancel anytime. Subscription auto-renews. By subscribing, you agree to{' '}
            <Text style={{ fontFamily: 'NunitoExtraBold' }} className="text-black underline">
              Privacy Policy
            </Text>
          </Text>

        </ScrollView>

      </View>

    </SafeAreaView>
  );
}