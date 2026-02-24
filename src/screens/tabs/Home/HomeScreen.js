import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, ImageBackground, StyleSheet, Image, ActivityIndicator, Pressable } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import HomepageHeader from '../../../components/HomepageHeader';
import { loadAuthToken } from '../../../context/api';
import Indicator from '../../../components/Indicator';
import { useAuth } from '../../../context/AuthContext';
import useStaticData from '../../../hooks/useStaticData';
import useLogout from '../../../hooks/useLogout';
import { useFocusEffect, useRoute } from '@react-navigation/native';  
import { get_onboarding_user_data } from '../../personalization/PersonalizationAPIs';
import { get_profile_info } from '../../auth/AuthAPI';
import Share from 'react-native-share';
import { useNavigation } from '@react-navigation/native';
import { get_random_verses, finish_share, get_notifications, get_profile_dashboard_data} from '../TabsAPI';
import CommonCard from './CommonCard';
import { get_current_goal } from '../TabsAPI';
import HomeModal from './HomeModal';



const goals = {
  "conversation":"Confidence Goal",
  "scripture": "Scripture Knowledge",
  "share_faith": "Inspiration Goal"
}
export default function HomeScreen() {
  useLogout()
  const [loading,setLoading] = useState(false);

  const {store, socket, updateStore, currentGoal, setCurrentGoal} = useAuth();
  const [randomVerse, setRandomVerse] = useState({});
  const [profileInfo, setProfileInfo] = useState({})
  const [dashboard, setDashboard] = useState({})
  const navigation = useNavigation();
  
  const {
    denominations,
    bible_versions,
    tone_preference_data,
    faith_journey_reasons,
    bible_familiarity_data
  } = store;

  useFocusEffect(
    useCallback(() => {
      get_random_verses((res, success) =>{
        if(success){
          setRandomVerse(res?.data.data);
          //updateStore({random_verse:res?.data?.data})
        }
      })
    }, [])
  )


  
  useFocusEffect(
    useCallback(() => {
      
      setProfileInfo(store?.profileSettingData?.userInfo)
    }, [store])
  )

  const handleShare = async (message) =>{
    const options = {
      message: message
    }
    try{
      await Share.open(options)
      finish_share((res,success) => {
        
      })
    }catch(e){
      console.log("share error ", e);
    }
  }
  
  const handle_get_notification = () =>{
    get_notifications((res, success) => {
      if(success){
        const temp = res?.data;
        socket.setNotifications(temp);
        if((store?.access) && !(socket?.isNotificationSocketConnected) ){
          
          socket.initiateNotificationSocket(store.access);
        }
      }
    })
  }
  
  const handle_get_current_goal = () => {
    get_current_goal((res, success) => {
        if(success){
            setCurrentGoal(res?.data);
        }

        //setLoading(false);
    })
  }
  useEffect(() => {

    handle_get_notification();
    handle_get_current_goal()
    
  }, [store]);

  //useFocusEffect(
  useEffect(() => {
       
    setLoading(true)
    get_onboarding_user_data((res, success) => {
      if(success){
        get_profile_info((res1, success1) => {
          if(success1){
            get_profile_dashboard_data((dashboard, success) => {
              if(success){
                const userInfo = res1?.data
                const denomination = denominations.filter(item => item.id === res?.data?.denomination?.denomination_option)
                const bible_version = bible_versions.filter(item => item.id === res?.data?.bible_version?.bible_version_option)
                const tone_preference = tone_preference_data.filter(item => item.id === res?.data?.tone_preference?.tone_preference_option)
                const faith_reason = faith_journey_reasons.filter(item => item.id === res?.data?.journey_reason?.journey_reason)
                const bible_familiarity = bible_familiarity_data.filter(item => item.id === res?.data?.bible_familiarity?.bible_familiarity_option)
                const faith_goal_questions = res?.data.faith_goals.map(item => {
                  return {
                    ...item,
                    options: item.options.map(op => {
                      return {
                        ...op,
                        name: op.option
                      }
                    })
                  }
                })
                
                const goal_preference = {
                  ...res?.data?.goal_preference,
                  name: goals[res?.data?.goal_preference?.goal_type]
                };
                

                const profileSettingData = {
                  userInfo:userInfo || {},
                  denomination: denomination[0] || {},
                  bible_version: bible_version[0] || {},
                  tone_preference: tone_preference[0] || {},
                  faith_reason: faith_reason[0] || {},
                  bible_familiarity: bible_familiarity[0] || {},
                  goal_preference: goal_preference || {}
                }
                console.log(JSON.stringify(profileSettingData, null, 2), "tesintg phase")
                updateStore({ profileSettingData, faith_goal_questions, profile_dashboard: dashboard?.data})
                setProfileInfo(userInfo)

              }
              else{
                console.log("eer", dashboard);
              }
              //setLoading(false);
            })
          }else{
            //setLoading(false)
            console.log(res1, "profile")
          }
        })
      }else{
        //setLoading(false)
        console.log("onboarding", JSON.stringify(res, null, 2))
      }
  })
  
  
  
  
  
        
      }, [])
   // );


  return (
    <SafeAreaView style={{flex:1, backgroundColor:'#fff', paddingHorizontal:20}}>
        <HomepageHeader dashboard={dashboard} userInfo={profileInfo}/>
        <ScrollView showsVerticalScrollIndicator={false}>

          <ImageBackground
            source={require('../../../../assets/img/Background.png')}
            style={styles.bgImageContainer}
          >
            <View style={styles.bgImageWrapper}>
              <Text style={styles.bgImageCaption}>({randomVerse?.verse_reference})</Text>
              <Text 
                style={styles.bgImageCaptionTitle}
              >“{randomVerse?.verse_text}”</Text>
              <Pressable onPress={()=>handleShare(randomVerse?.verse_text)} style={styles.bgImageFooter}>
                <Image 
                  source={require("../../../../assets/img/24-share.png")}
                  style={styles.bgImageFooterIcon}
                />
                <Text
                  style={styles.bgImageFooterText}
                >Share This</Text>
              </Pressable>
            </View>
          </ImageBackground>


          <View 
            style={styles.questionContainer}
          
          >
              <View style={{
                width:'20%',
              }}>
                  <Image 
                  source={require("../../../../assets/img/Objects.png")}
                  style={styles.messageIcon}
                />
              </View>
              <View style={{
                width: "80%",
              }}>
                <Text style={styles.questionTitle1}>Have a question on your heart?</Text>
                <Text style={styles.questionTitle2}>Ask & Get Inspired Answers Now</Text>
                <Pressable 
                  onPress={()=>{
                    navigation.navigate("MessageScreen")
                  }}
                >
                  <Text 
                    style={styles.questionTitle3}
                  >Give it a try</Text>
                </Pressable>
              </View>
          </View>
            

          <View style={styles.multiImageContainer}>
              <Pressable onPress={() => navigation.navigate("Preachly")} style={styles.commonMultiImage}>
                <Image
                  source={require("../../../../assets/img/OpenBook.png")}
                  style={styles.multiImage}
                />
                <Text style={styles.multiText}>Explore Scriptures</Text>
              </Pressable>
              <Pressable onPress={() => navigation.navigate("MessageScreen")} style={styles.commonMultiImage}>
                <Image
                  source={require("../../../../assets/img/BrightsSun.png")}
                  style={styles.multiImage}
                />
                <Text style={styles.multiText}>Find Inspiration</Text>
              </Pressable>

              <Pressable onPress={()=>navigation.navigate("History")} style={styles.commonMultiImage}>
                <Image
                  source={require("../../../../assets/img/ReligeousBook.png")}
                  style={styles.multiImage}
                />
                <Text style={styles.multiText}>Saved Answers</Text>
              </Pressable>


          </View>

          <View>
              <Text style={{
                fontFamily:'NunitoBold',
                fontSize: 20,
                marginTop: 20,
              }}>Popular Faith Questions</Text>
          
            <ScrollView contentContainerStyle={{
              backgroundColor:'#fff'
            }} horizontal  showsHorizontalScrollIndicator={false}>
                  <Pressable onPress={() => navigation.navigate("MessageScreen", {question:"Whats the proof that God exists?"})}>
                    <Image 
                      source={require("../../../../assets/img/ThemeCard.png")}
                      style={styles.imageHorizontalScroll}
                    />
                  </Pressable>
                  <Pressable onPress={() =>navigation.navigate("MessageScreen", {question: "How do i explain the resurrection?"})}>
                    <Image 
                    source={require("../../../../assets/img/card8.png")}
                    style={styles.imageHorizontalScroll}
                  />
                  </Pressable>
                  <Pressable onPress={()=>navigation.navigate("MessageScreen", {question: "Can't people be good without believing in God?"})}>
                    <Image 
                      source={require("../../../../assets/img/card9.png")}
                      style={styles.imageHorizontalScroll}
                    />
                  </Pressable>
            </ScrollView>
          </View>



          <CommonCard 
            title={`Don't forget to reflect on this week's progress and earn your badge!`}
            text={`Days left ${currentGoal?.days_remaining || 0} days`}
            onPress={()=> navigation.navigate("WeeklyCheckIn")}
          />
          
      
        </ScrollView>
        <HomeModal modalVisible={loading} setModalVisible={()=>setLoading(false)} current_streak={store?.profile_dashboard?.streak?.current_streak} />
        {/* {loading && <Indicator onClose={() => setLoading(false)} visible={loading}>
          <ActivityIndicator size={"large"}/>
        </Indicator>} */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  bgProgress:{
    height:120,
    width: 'auto',
    objectFit:'contain'
  },
  imageHorizontalScroll:{
    height:170,
    width:200,
    objectFit:'contain',
    marginRight:20
  },
  multiText:{
    fontFamily:'NunitoSemiBold',
    fontSize: 12,
    color:'#2B4752',
    textAlign:'center'
  },
  commonMultiImage:{
    width:"31%"
  },
  multiImage:{
    height:80,
    width: "100%",
    objectFit:'contain'
  },
  multiImageContainer:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'flex-start',
    width: '100%',
    marginTop: 20,
    height: "auto",
  },
  questionTitle3:{
    fontSize: 16,
    color: "#fff",
    fontFamily:'NunitoSemiBold',
    textDecorationLine:'underline',
    textDecorationColor: '#fff',
    marginTop:8
  },
  questionTitle2:{
    fontSize: 17,
    fontFamily: 'NunitoSemiBold',
    color:'#62E2E2',
    marginTop:3
  },
  questionTitle1:{
    fontSize: 17,
    fontFamily:'NunitoSemiBold',
    color:'#fff',
    
  },
  messageIcon:{
    height:50,
    width:50,
    objectFit:'contain'
  },
  questionContainer:{
    display:'flex',
    flexDirection:'row',
    width:"100%",
    alignItems:'flex-start',
    justifyContent:'space-between',
    backgroundColor:'#00202B',
    height:'auto',
    padding: 20,
    borderRadius: 20,
    marginTop: 20
  },
  bgImageContainer:{
    height:"auto",
    width:"100%",
    objectFit: 'contain',
    borderRadius: 20,
    overflow:'hidden',
  },
  bgImageWrapper:{
    paddingHorizontal:20,
    paddingVertical:10,
    alignItems:'center'
  },
  bgImageCaption:{
    color:'#966F44',
    fontFamily:'NunitoSemiRegular',
    fontSize: 13
  },
  bgImageCaptionTitle:{
    fontFamily:'DMSerifDisplay',
    fontSize: 18,
    color:'#503524',
    paddingVertical:8
  },
  bgImageFooter:{
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    width:100
  },
  bgImageFooterIcon:{
    height:18,
    width:18,
    objectFit:'contain'
  },
  bgImageFooterText:{
    color: '#966F44',
    fontFamily:'NunitoBold',
    fontSize: 15,
    textDecorationColor: '#966F44',
    textDecorationLine: 'underline'
  }
})