import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useAuth } from '../../../context/AuthContext';
import CommonButton from '../../../components/CommonButton';
import PlanSelector from '../../../components/SubscriptionPlan';
import ParagraphIcon from '../../../components/ParagraphIcon';
import config from '../../../../config';
import Purchases from 'react-native-purchases';
import { SafeAreaView } from 'react-native-safe-area-context';
import ReusableNavigation from '../../../components/ReusabeNavigation';
import BackButton from '../../../components/BackButton';
import { useNavigation } from '@react-navigation/native';

export default function ProfileSubscription() {
  const navigation = useNavigation();
  const { login } = useAuth();
  const [selectedPlanType, setSelectedPlanType] = useState('yearly');

  const revenue_cat_test = async () => {
    const customerInfo = await Purchases.getCustomerInfo();
    const offerings = await Purchases.getOfferings();
    console.log("customer info", JSON.stringify(customerInfo, null, 2));
    console.log("offerings ", JSON.stringify(offerings, null, 2));
  };

  useEffect(() => {
    Purchases.configure({ apiKey: config.REVENUECAT_IOS_API_KEY });
    revenue_cat_test();
  }, []);

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
            Subscription
          </Text>
        )}
        RightComponent={() => <Text />}
      />

      <View className="flex-1 justify-between">

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="w-full bg-white rounded-t-3xl p-5">

            <Text
              style={{ fontFamily: 'DMSerifDisplay' }}
              className="text-[28px] text-[#0B172A] pb-6"
            >
              Your Plan
            </Text>

            <ParagraphIcon
              icon={require("../../../../assets/img/24-sunset.png")}
              text={"Build Confidence in Conversations About Faith"}
              textStyle={{ fontFamily: 'NunitoSemiBold' }}
            />
            <ParagraphIcon
              icon={require("../../../../assets/img/bird.png")}
              text={"Clarity and Ease When You Need It Most"}
              textStyle={{ fontFamily: 'NunitoSemiBold' }}
            />
            <ParagraphIcon
              icon={require("../../../../assets/img/piramid.png")}
              text={"Inspire and Strengthen Your Walk with God"}
              textStyle={{ fontFamily: 'NunitoSemiBold' }}
            />

            <View className="h-5" />

            <PlanSelector
              OtherPlan={() => (
                <Text
                  style={{ fontFamily: 'NunitoSemiBold' }}
                  className="text-xl text-[#0B172A] font-medium pb-4"
                >
                  Other Plans
                </Text>
              )}
              plan={selectedPlanType}
              setSelectedPlanType={setSelectedPlanType}
            />

            <View className="h-8" />

          </View>
        </ScrollView>

        <View className="px-5 pb-8">
          <CommonButton
            btnText={"Manage subscription"}
            bgColor={"#005A55"}
            navigation={navigation}
            route={""}
            handler={() => {}}
            txtColor={"#fff"}
            opacity={1}
          />
        </View>

      </View>

    </SafeAreaView>
  );
}