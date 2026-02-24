import React, { useState } from 'react';
import { View, Text, StyleSheet, Image} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import ProgressBar from '../../components/ProgressBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import CommonButton from '../../components/CommonButton';
import { deepGreen, primaryText, lightgreen1 } from '../../components/Constant';
import CustomSelect from '../../components/CustomSelect';
import SelectableCard from '../../components/SelectableCard';
import QuestionSlider from '../../components/QuestionSlider';


export default function Notification({navigation}) {
    

  return (
    <SafeAreaView style={styles.container}>
      
      <View style={{alignItems:'center', justifyContent:'center', backgroundColor:'#fff', height:'80%'}}>
         <Image source={require("../../../assets/img/bell-alert.png")}/>
         <Text style={styles.title}>Turn On Notifications</Text>
         <Text style={styles.subtitle}>Never miss a moment to grow in faith. Get gentle reminders, uplifting messages,and timely insights to keep you inspired on your journey</Text>
      </View>

      <View style={{paddingBottom:45}}>
        <CommonButton
          btnText={"Skip"}
          bgColor={lightgreen1}
          navigation={navigation}
          route={"SubscriptionScreen"}
          txtColor={deepGreen}
          bold='bold'
          opacity={1}
        />
        <View style={{height:10}}/>
        <CommonButton
          btnText={"Continue"}
          bgColor={deepGreen}
          navigation={navigation}
          route={"SubscriptionScreen"}
          txtColor={primaryText}
          bold='bold'
          opacity={1}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex:1,backgroundColor:'#fff',justifyContent:'space-between', padding:10},
  title: {fontFamily:'DMSerifDisplay', fontSize:32, padding: 20, textAlign:'center', color:'#0B172A'},
  subtitle: {fontFamily:'NunitoSemiBold', color:'#2B4752', fontSize:18, textAlign:'center', paddingHorizontal:18, lineHeight: 23}
})