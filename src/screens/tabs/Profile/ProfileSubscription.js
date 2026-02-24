import React, { useEffect, useState } from 'react';
import { View, Text, ImageBackground, StyleSheet, Image, Dimensions} from 'react-native';
import { useAuth } from '../../../context/AuthContext';

import CommonButton from '../../../components/CommonButton';
import PlanSelector from '../../../components/SubscriptionPlan';
import ParagraphIcon from '../../../components/ParagraphIcon';
import config from '../../../../config';
import Purchases from 'react-native-purchases';

const window = Dimensions.get("window")

export default function ProfileSubscription({ navigation }) {
  const { login } = useAuth();
  const [selectedPlanType, setSelectedPlanType] = useState('yearly');

  const revenue_cat_test = async () => {

    const customerInfo = await Purchases.getCustomerInfo();

    const offerings = await Purchases.getOfferings();

    console.log("customer info", JSON.stringify(customerInfo, null, 2))
    console.log("offerings ", JSON.stringify(offerings, null, 2))
  }

  useEffect(() => {
    Purchases.configure({apiKey: config.REVENUECAT_IOS_API_KEY})
    revenue_cat_test();

  }, [])
 

  return (
        <View style={{ flex:1, backgroundColor:'#fff', justifyContent:'space-between'}}>
          


          <View style={styles.content}>
              
              <Text style={{
                  fontFamily:'DMSerifDisplay',
                  fontSize: 28,
                  color:'#0B172A',
                  paddingBottom: 25
              }}>Your Plan</Text>

              <ParagraphIcon
                icon={require("../../../../assets/img/24-sunset.png")}
                text={"Build Confidence in Conversations About Faith"}
                textStyle={{fontFamily:'NunitoSemiBold'}}
              />
              <ParagraphIcon
                icon={require("../../../../assets/img/bird.png")}
                text={"Clarity and Ease When You Need It Most"}
                textStyle={{fontFamily:'NunitoSemiBold'}}
              />
              <ParagraphIcon
                icon={require("../../../../assets/img/piramid.png")}
                text={"Inspire and Strengthen Your Walk with God"}
                textStyle={{fontFamily:'NunitoSemiBold'}}
              />

              <View style={{height:20}}></View>

              <PlanSelector
                  OtherPlan={() => <Text style={{
                      fontSize:20,
                      color: '#0000000',
                      fontWeight:'500',
                      paddingBottom: 15
                      }}>Other Plans</Text>
                  }
              
                  plan={selectedPlanType}
                  setSelectedPlanType={setSelectedPlanType}
              />

              <View style={{height:30}}></View>

          </View>


          <View style={{
              padding:20
          }}>
              <CommonButton
                  btnText={"Manage subscription"}
                  bgColor={"#005A55"}
                  navigation={navigation}
                  route={""}//"SubscriptionConfirmedScreen"
                  handler={() => {}}
                  txtColor={"#fff"}
                  opacity={1}
              />
          </View>

         
      </View>

  );
}


const styles = StyleSheet.create({
  footerHighlighter:{color:'black', textDecorationLine:'underline', fontFamily: 'NunitoExtraBold'},

  footerText:{fontSize:16, color:'#90B2B2', paddingHorizontal: 16, paddingVertical:20, textAlign:'center', fontFamily:'NunitoSemiBold'},

  googleAppleAuth:{
      display:"flex",
      flexDirection:"row",
      width: "30%",
      justifyContent:'space-between',
      padding: 40,
      boxSizing:'content-box'
  },
  background: {
    height: (window.height*40)/100,
    width:'100%'
  },
  content: {
    width:"100%",
    backgroundColor:'#fff',
    
    // justifyContent: 'center',
    // alignItems: 'center',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding:20,
  },
  text: {
    color: 'white',
    fontSize: 24,
  },
  title:{
    textAlign:'center',
    fontSize: 32,
    padding:30,
    fontFamily: 'DMSerifDisplay'
  },
  subtitle:{
    fontSize:16,
    paddingBottom: 50,
    fontFamily: 'NunitoSemiBold'
  }
});

