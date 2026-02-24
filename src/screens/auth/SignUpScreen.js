

import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Keyboard, 
  Pressable, 
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  LayoutAnimation,
  StatusBar
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import CommonInput from '../../components/CommonInput';
import { 
  primaryText, 
  primaryTextSize, 
  primaryTitle, 
  primaryTitleSize 
} from '../../components/Constant';
import { SafeAreaView } from 'react-native-safe-area-context';
import CommonButton from '../../components/CommonButton';
import {ROOT_URL, SIGNUP} from '../../context/Paths'
import axios from 'axios';
import { sign_up, resentOTP } from './AuthAPI';
import Indicator from '../../components/Indicator';
import Toast from 'react-native-toast-message';
import { useNavigation, useRoute, } from '@react-navigation/native';
import { handleToast, forget_password } from './AuthAPI';


export default function SignInScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false)
  const [keyboardOffset, setKeyboardOffset] = useState(30);
  const navigation = useNavigation()
  const route = useRoute()

  useEffect(() => {
    if(route?.params?.type == "reset"){
      setEmail(route.params.email);
      navigation.setOptions({title:"Reset password"})
    }
  }, [route.params])
  const isValidEmail = {
    "Invalid email format.":true
  }
  const handleSignUp = () => {
      setIsLoading(true)
      const payload = {
        email: email
      }
      if(route.params?.type == "reset"){
        setIsLoading(true)
        const resent_payload = {
          "email": route.params.email,
        }
        
        forget_password(resent_payload, (res, isSuccess)=>{
          if(isSuccess){
            setIsLoading(false)
            console.log("forget otp", res)

            handleToast("info", "OTP has sent again!",3000, () => {
              navigation.navigate("ConfirmationEmail", {...payload, type:"reset"})
            })
          }else{
            setEmail("")
            navigation.setParams(null)
            handleToast("error", "Use new email", 3000, () => {})
            console.log(res)
            setIsLoading(false)
          }
        })
      }
      else{
        sign_up(payload, (res, isSuccess) => {
          if(isSuccess){
            console.log(JSON.stringify(res, null, 2))
            const data = res?.data
            if(data?.is_sent){
              setIsLoading(false)
              navigation.navigate("ConfirmationEmail", payload)
            }
            else if(isValidEmail[res.message]){
              setIsLoading(false)
              handleToast('error', res?.message,2000, ()=>{})
            }
            else{
              setIsLoading(false)
              handleToast('info', res?.message,3000, () => navigation.navigate("SignIn"))
              //handleToast('info', res?.message, () => navigation.navigate("ConfirmationEmail", payload))

            }
          }else{
            setIsLoading(false)
            console.log(res, "error in signup")
          }
          
        })
      }
  }


  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', e => {
      const height = e.endCoordinates.height;
      console.log(height)
      const safeOffset = Math.min(height, 100); 
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setKeyboardOffset(safeOffset);
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setKeyboardOffset(30);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
    
      <Pressable onPress={() => Keyboard.dismiss()} style={{ flex: 1 }}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <Text style={styles.title}>Enter your email</Text>
            <Text style={styles.text}>The email confirmation will be sent there</Text>
            
            <CommonInput
              type='email'
              placeholder="example@gmail.com"
              value={email}
              onChangeText={(e) => setEmail(e)}
              style={email.length?styles.activeInput:styles.input}
              placeholderColor='#607373'
            />
          </View>
        </ScrollView>

        <View style={[styles.buttonContainer, { paddingBottom: keyboardOffset }]}>
          <CommonButton
            btnText={"Send Confirmation email"}
            bgColor={"#005A55"}
            navigation={navigation}
            route={""}//"ConfirmationEmail"
            txtColor={"#fff"}
            handler={handleSignUp}
            opacity={email.length?1:0.6}
            disabled={email.length?false:true}
          />
        </View>

        {isLoading && 
          <Indicator onClose={() => setIsLoading(false)} visible={isLoading}>
            <ActivityIndicator size="large" />
          </Indicator>
          
        }


      </Pressable>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    flex:1,
    padding: 20,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: primaryTitleSize,
    fontFamily:"DMSerifDisplay",
    marginBottom: 16,
    color: '#0B172A'
  }, 
  text: {
    fontSize: 18,
    paddingTop: 10,
    paddingBottom: 40,
    boxSizing: 'border-box',
    color: '#2B4752',
    fontFamily:'NunitoSemiBold'
  },
  input: {
    marginBottom: 20,
    borderColor: '#ACC6C5',
  },
  activeInput:{
    marginBottom: 20,
    borderColor:"#005A55"
  },
  buttonContainer: {
    padding: 20,
    // paddingBottom: Platform.OS === 'ios' ? 30 : 30,
  }
});