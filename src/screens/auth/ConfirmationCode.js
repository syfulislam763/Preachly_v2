import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Pressable, ActivityIndicator } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { deepGreen, lighgreen } from '../../components/Constant';
import OTPInput from '../../components/OTPInput';
import {verify_email, resentOTP, handleToast, verify_change_email,verify_forget_password} from './AuthAPI'
import Indicator from '../../components/Indicator'
import { useNavigation, useRoute , CommonActions} from '@react-navigation/native';
import { useAuth } from '../../context/AuthContext';

const ConfirmationCode = ({ }) => {
  const [isLoading, setIsloading] = useState(false)
  const route = useRoute()
  const navigation = useNavigation()
  const {email, change, profileSettingData, faith_goal_questions, type} = route.params
  const {updateStore} = useAuth()


  const handleReset = (otp) => {
    setIsloading(true);
    const payload = {
      email: email,
      otp: otp,
    }
    verify_forget_password(payload, (res, success) => {


      if(success){
        navigation.navigate("CreatePassword", {...payload, type:"reset"})
      }

      setIsloading(false);
    })

  }

  const changeEmailVerify = (otp) => {
    setIsloading(true)
    verify_change_email({otp: otp}, (res, success) => {
      if(success){
      
          updateStore({profileSettingData, faith_goal_questions})
          handleToast("info", "Email Changed!",2000, () => {
              // navigation.navigate("SignUp", {resentOPT:true, ...route.params})
              navigation.dispatch(state => {
              
              const routes = state.routes.slice(0,-3);
              
              routes.push({
                name: 'PersonalInfo',
                params: {editMode:false}
              });
              
              return CommonActions.reset({
                ...state,
                index: routes.length - 1,
                routes
              });
            });
          })
      }else{
        console.log(res)
        navigation.goBack()
      }
      setIsloading(false)
    })
  }
  const handleComplete = (otp) => {
    setIsloading(true)
    const payload = {...route.params, otp: otp}
    console.log(payload, " -> payload")
    verify_email(payload, (res, isSuccess) => {
      if(isSuccess){
        
        setIsloading(false)
        updateStore({refreshToken:res?.refresh, accessToken: res?.access})
        navigation.navigate("CreatePassword", payload)
        
      }else{
          handleToast("info", "Your OTP has expired, send again",2000, () => {
              // navigation.navigate("SignUp", {resentOPT:true, ...route.params})
              navigation.dispatch(state => {
              
              const routes = state.routes.slice(0,-3);
              
              routes.push({
                name: 'SignUp',
                params: payload
              });
              
              return CommonActions.reset({
                ...state,
                index: routes.length - 1,
                routes
              });
            });
          })
        setIsloading(false)

      }
    })
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      

      <View style={styles.subContainer}>

        <Text style={styles.title}>Enter confirmation Code</Text>

        <View style={{paddingTop:30, paddingBottom: 80}}>
          <Text style={styles.subtitle}>
          The 4-digit confirmation code has been sent to
          </Text>
          <Text style={styles.email}>{email}</Text>
        </View>
   
        {/* Code Input */}
        <OTPInput 
          length={4}
          onChange={(otp) => console.log('OTP changed:', otp)}
          onComplete={(otp) => {
            if(change){
              changeEmailVerify(otp)
            }
            else if(type == "reset"){
              handleReset(otp)
            }
            else{
              handleComplete(otp)
            }
          }}
          error={false}
          focusColor="#005A55"
          errorColor="#B00020"
        />
        

        {/* Resend Link */}
        <View style={{height:20}}></View>
        <TouchableOpacity style={styles.resendContainer}>
          <Text style={styles.resendText}>
            Didn't get it? <Text style={styles.resendLink}>Resend code</Text>
          </Text>
        </TouchableOpacity>


      </View>


      {isLoading  && 
        <Indicator onClose={() => setIsloading(false)} visible={isLoading}>
          <ActivityIndicator size="large"/>
        </Indicator>
      }
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent:'space-between',
    backgroundColor:'#fff'
  },

  subContainer:{
    padding:20,
    paddingTop:50
  },
  title: {
    fontFamily:'DMSerifDisplay',
    fontSize:32,
    color:'#0B172A'
  },
  subtitle: {
    fontSize: 17,
    color: '#2B4752',
    textAlign: 'center',
    fontFamily:'NunitoSemiBold'
  },
  email: {
    fontSize: 17,
    fontFamily: 'NunitoSemiBold',
    color: '#2B4752',
    textAlign: 'center',
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  codeDigit: {
    width: 50,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  codeText: {
    fontSize:  20,
  },
  underline: {
    height: 1,
    backgroundColor: lighgreen,
    width: '100%',
  },
  resendContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  resendText: {
    fontSize: 16,
    color: lighgreen,
    fontFamily:'NunitoSemiBold'
  },
  resendLink: {
    color: '#005A55',
    fontWeight: 'bold',
    // textDecorationLine:'underline',
    // textDecorationColor:"red"
    
  },
  keypad: {
   display:'flex',
   flexDirection:'column',
   justifyContent:'space-between',
   backgroundColor:'#d0d4dc',
   gap:7,
   padding:10,
   paddingBottom: 100
  },
  keypadRow: {
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    gap:7
  },
  keypadKey: {
    height: 55,
    width: '32%',
    backgroundColor: '#fff',
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    borderRadius: 7,
    borderBottomWidth: .8,
    borderBottomColor: '#000',
    backgroundColor: '#ffffff',

  },
  number:{
    fontSize:25,
    fontWeight:'bold',
  },
  abc:{
    fontSize:12,
    fontWeight:'600'
  }
});

export default ConfirmationCode;