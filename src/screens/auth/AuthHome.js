import React, { useEffect, useState } from 'react';
import { View, Text, ImageBackground, StyleSheet, Image, Dimensions, TouchableOpacity, ActivityIndicator} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import {
  SafeAreaView
} from 'react-native-safe-area-context';
import FooterBar from '../../components/FooterBar';
import CommonButton from '../../components/CommonButton';
import Divider from '../../components/Divider';
import { getStyles } from './authStyles/AuthHomeStyle';
import useLayoutDimention from '../../hooks/useLayoutDimention';
import { googleSignIn, googleSignOut, googleLogin} from './AuthAPI';
import { useNavigation } from '@react-navigation/native';
import Indicator from '../../components/Indicator';
import { onboarding_status } from '../personalization/PersonalizationAPIs';
import { appleSignIn } from './appleAuth';
import { AppleButton } from '@invertase/react-native-apple-authentication';
import { get_onboarding_all_data } from '../personalization/PersonalizationAPIs';
import { get_payment_status } from './AuthAPI';
import { setAuthToken } from '@/context/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthHome = ({}) => {
  const context = useAuth();
  const {isLarge, isMedium, isSmall, isFold} = useLayoutDimention()
  const styles = getStyles(isSmall, isMedium, isLarge, isFold)
  const navigation = useNavigation()
  const [loading, setLoading] = useState(false)
  const [isLoginInfo, setIsLoginInfo] = useState(false)
  const [data, setData] = useState({})



  const handleLogin = (payload) => {
    setLoading(true)
    googleLogin(payload, (res, success) => {
      
      if(success){

        console.log(JSON.stringify(res.data, null, 2), "login") ;
        onboarding_status(res?.data?.access, (statusRes, isOk) => {
          
          if(isOk){
            console.log(JSON.stringify(statusRes, null, 2), "status") ;
            get_onboarding_all_data(res?.data?.access, (all_data, isFine) => {
              if(isFine){
                console.log(JSON.stringify(all_data, null, 2), "onboarding") ;
                get_payment_status(res?.data?.access, (payment, isPayment) => {
                  setLoading(false);
                  if(isPayment){
                    console.log(JSON.stringify(payment, null, 2), "payment") ;
                    const denominations = [...all_data?.data?.denominations];
                    denominations.push({
                        "id": 0,
                        "name": "None",
                        "is_active": false,
                        is_selected: false,
                    })
                    let faith_journey_reasons = [...all_data?.data?.journey_reasons];
                    faith_journey_reasons = faith_journey_reasons.map(item => ({...item, name: item?.option}));

                    let bible_versions = [...all_data?.data?.bible_versions];
                    bible_versions = bible_versions.map(item => ({...item, name: item?.title}));
                    
                    const bible_familiarity_data = [...all_data?.data?.bible_familiarity];
                    
                    
                    const tone_preference_data = [...all_data?.data?.tone_preferences];

                    const faith_goal_questions = [...all_data?.data?.faith_goal_questions];
                    const store = {...res?.data ,denominations, faith_goal_questions, faith_journey_reasons, bible_versions, bible_familiarity_data, tone_preference_data, onboarding_completed:statusRes?.data?.onboarding_completed, payment:payment.data}


                    console.log("culprit")
                    console.log(JSON.stringify(store, null, 2), "my store __")
                    if(store?.onboarding_completed){
                      context.completePersonalization(true);
                      if(payment?.data?.is_active){
                        context.completeSubscription(payment?.data?.is_active)
                      }
      
                      context.updateStore(store)
                      setAuthToken(store?.access, store?.refresh, async () => {
                        await AsyncStorage.setItem('store', JSON.stringify(store));
                        context.login()
                      })
                      
                    }else{
                      
                      context.updateStore(store)
                      setAuthToken(store?.access, store?.refresh, async () => {
                        await AsyncStorage.setItem('store', JSON.stringify(store));
                        console.log("hello")
                        navigation.navigate("FinishAuthentication")
                      })
                      
                    }


                  }else{
                    setLoading(false);
                  }
                })
              }else{
                setLoading(false);
              }
            })
           
            
          }else{
            setLoading(false);
          }
        })

      }else{
        console.log("wrong")
        setLoading(false);
      }

    })
  }

  const handleGoogleLogin = () => {
    
    googleSignIn((res, success) => {
      if(success){
        const payload = {
          email: res?.user?.email,
          provider: "google",
          name: res?.user?.name || ""
        }

        handleLogin(payload)
       

     
      }else{
        console.log("error",res)
        setLoading(false)
      }
    })
  }

  const handleAppleLogin = (data, success) => {
 
    if (success) {
        const payload = {
          email: data?.email,
          provider: "apple",
          name: data?.fullname?.givenName || ""
        }
        console.log('Apple user:', JSON.stringify(payload, null, 2));
        handleLogin(payload)
    } else {
        console.log('Apple sign-in failed:', data);
    }
  }


  return (
    <View style={{position:'relative', flex:1, backgroundColor:'#fff'}}>
        
         <ImageBackground
            source={require('../../../assets/img/bg_img2.png')}
            style={styles.background}
            resizeMode="cover" 
        >
        </ImageBackground>

        <View style={styles.content}>
            <Text style={styles.title}>Inspired Answers are just a step away</Text>
            <Text style={styles.subtitle}>Equip your faith. Empower your words</Text>
            <CommonButton
                btnText={"Sign up"}
                bgColor={"#005A55"}
                navigation={navigation}
                route={"SignUp"}
                txtColor={"#fff"}
                opacity={1}
            />

            <View style={{height:10}}></View>
            <CommonButton
                btnText={"Log In"}
                bgColor={"#EDF3F3"}
                navigation={navigation}
                route={"SignIn"}
                txtColor={"#2B4752"}
                opacity={1}
            />

            <View style={styles.divider}>
              <Divider text={"or"}/>
            </View>

            <View style={styles.googleAppleAuth}>

                <View style={{ position: 'relative' }}>
                  <Image 
                    source={require("../../../assets/img/appleAuth.png")}
                    height={50}
                    width={50}
                  />
               
                  <AppleButton
                    buttonStyle={AppleButton.Style.BLACK}
                    buttonType={AppleButton.Type.SIGN_IN}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: 50,
                      height: 50,
                      opacity: 0.1,
                    }}
                    onPress={() => appleSignIn(handleAppleLogin)}
                  />
                </View>

                <TouchableOpacity onPress={handleGoogleLogin}>
                  <Image 
                    source={require("../../../assets/img/googleAuth.png")}
                    height={50}
                    width={50}
                  />
                </TouchableOpacity>

            </View>
        
            <Text style={styles.footerText}>By singing up, you agree to the app's <Text style={styles.footerHighlighter}>Terms of Use</Text> and <Text style={styles.footerHighlighter}>Privacy Policy</Text></Text>

        </View>

        <Indicator onClose={() => setLoading(false)} visible={loading}>
          <ActivityIndicator size={"large"}/>
        </Indicator>
    </View>
  );
}


export default AuthHome;