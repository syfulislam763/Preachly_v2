
import React, { useState, useEffect } from 'react';
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
  LayoutAnimation
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import CommonInput from '../../components/CommonInput';
import { 
    deepGreen,
    lightgreen1,
  primaryText, 
  primaryTextSize, 
  primaryTitle, 
  primaryTitleSize 
} from '../../components/Constant';
import { SafeAreaView } from 'react-native-safe-area-context';
import CommonButton from '../../components/CommonButton';
import { create_password, handleToast, confirm_forget_password } from './AuthAPI';
import { useRoute } from '@react-navigation/native';
import Indicator from '../../components/Indicator';
import { useNavigation } from '@react-navigation/native';
import { onboarding_status } from '../personalization/PersonalizationAPIs';
import { get_onboarding_all_data } from '../personalization/PersonalizationAPIs';
import { CommonActions } from '@react-navigation/native';

export default function CreatePassword() {
  const { updateStore } = useAuth();
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  const route = useRoute()
  const navigation = useNavigation()
  
  const [loading, setLoading] = useState(false)

  const handleResetComplete = () => {
     const payload = {
      email: route.params.email,
      otp: route.params.otp,
      new_password: password,
      new_password2: password
    }

    setLoading(true);
    console.log(payload, "899")
    confirm_forget_password(payload, (res, success) => {
      console.log(res);
      if(success){
        handleToast("info", "Password changed successfully, login again!",3000, () => {
            // navigation.navigate("SignUp", {resentOPT:true, ...route.params})
            navigation.dispatch(state => {
            
            const routes = state.routes.slice(0,-5);
            
            routes.push({
              name: 'SignIn',
              params: payload
            });
            
          return CommonActions.reset({
            ...state,
            index: routes.length - 1,
            routes
            });
          });
        })
      }

      setLoading(false);
    })




  }


  const handleSignUpComplete = () => {
    const payload = {
      ...route.params,
      password: password,
      password2: password
    }
    
    //
    
    setLoading(true)
    create_password(payload, (res, isSuccess)=>{
      if(isSuccess){
      
        onboarding_status(res?.data?.access, (statusRes, isOk) => {

          setLoading(false)
          if(isOk){
            updateStore({...res?.data, onboarding_completed:statusRes?.data?.onboarding_completed})
            handleToast("success", "User is created!",2000, () => {
              navigation.navigate("FinishAuthentication")
            })
          }else{

          }
        })
        
      }else{
        
        setLoading(false)
        handleToast("error", "Enter valid password", 3000, () => {})
        
      }
    })
  }

  const [keyboardOffset, setKeyboardOffset] = useState(30);
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', e => {
      const height = e.endCoordinates.height;
 
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
            <View style={{paddingTop:16}}></View>
            <Text style={styles.title}>Create a password</Text>
            <Text style={styles.text}>The password must be longer than 8 characters, contain numbers, letters, and special characters</Text>
            
            <CommonInput
              type='password'
              placeholder="Enter password"
              value={password}
              onChangeText={(e) => setPassword(e)}
              style={password.length>8?{...styles.input, borderColor:deepGreen}:styles.input}
              placeholderColor='#607373'
            />
            <CommonInput
              type='password'
              placeholder="Re enter password"
              value={rePassword}
              onChangeText={(e) => setRePassword(e)}
              style={rePassword.length>8?{...styles.input, borderColor:deepGreen}:styles.input}
              placeholderColor='#607373'
            />
          </View>
        </ScrollView>

        <View style={[styles.buttonContainer, { paddingBottom: keyboardOffset }]}>
          <CommonButton
            btnText={"Save"}
            bgColor={(password.length>8 && password === rePassword)?deepGreen:lightgreen1}
            navigation={navigation}
            route={""}
            handler={() => {
              if(route?.params?.type == "reset"){
                handleResetComplete()
              }else{
                handleSignUpComplete()
              }
            }}
            txtColor={(password.length>8 && password === rePassword)?lightgreen1: deepGreen}
            bold='bold'
            opacity={1}
            disabled={password.length<=8 || password !== rePassword}
          />
        </View>
      </Pressable>
      {loading && <Indicator visible={loading} onClose={() => setLoading(false)}>
          <ActivityIndicator size={"large"}/>
        </Indicator>}
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
    padding: 20,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: primaryTitleSize,
    fontFamily:'DMSerifDisplay',
    marginBottom: 8,
    color:'#0B172A'
  }, 
  text: {
    fontSize: 17,
    padding: 20,
    boxSizing: 'content-box',
    fontFamily:'NunitoSemiBold',
    color: '#2B4752',

  },
  input: {
    marginBottom: 5,
    marginTop:20,
    borderColor: '#ACC6C5',
  },
  buttonContainer: {
    padding: 20,
    //paddingBottom: Platform.OS === 'ios' ? 30 : 30,
  }
});