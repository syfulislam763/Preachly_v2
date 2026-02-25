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
// import { googleSignIn, googleSignOut, googleLogin} from './AuthAPI';
import { useNavigation } from '@react-navigation/native';
import Indicator from '../../components/Indicator';
import { onboarding_status } from '../personalization/PersonalizationAPIs';


export default function AuthHome({}) {
  const { login, updateStore } = useAuth();
  const {isLarge, isMedium, isSmall, isFold} = useLayoutDimention()
  const styles = getStyles(isSmall, isMedium, isLarge, isFold)
  const navigation = useNavigation()
  const [loading, setLoading] = useState(false)
  const [isLoginInfo, setIsLoginInfo] = useState(false)
  const [data, setData] = useState({})

  const handleGoogleLogin = () => {
    // googleSignOut(success => {
    //   console.log(success)
    // })
    // return 
    
    googleSignIn((res, success) => {
      if(success){
        const payload = {
          email: res?.user?.email,
          provider: "google",
          name: res?.user?.name
        }
  
        setLoading(true)
        googleLogin(payload, (loginRes, isSuccess) => {
          
          if(isSuccess){
            onboarding_status(loginRes?.data?.access, (statusRes, isOk) => {
              setLoading(false)
              if(isOk){
                updateStore({...loginRes?.data, onboarding_completed:statusRes?.data?.onboarding_completed})
                navigation.navigate("FinishAuthentication")
              }else{
    
              }
            })

            setLoading(false)
            updateStore(loginRes?.data)
            
            navigation.navigate("FinishAuthentication")
          }else{
            console.log("falid login", loginRes)
            setLoading(false)
          }
        })
      }else{
        console.log("error",res)
        setLoading(false)
      }
    })
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
              {/* <Divider text={"or"}/> */}
            </View>

            <View style={styles.googleAppleAuth}
            >
                <TouchableOpacity>
                  <Image 
                    source={require("../../../assets/img/appleAuth.png")}
                    height={50}
                    width={50}
                  />
                </TouchableOpacity>
                <TouchableOpacity 
                  //onPress={handleGoogleLogin}
                >
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