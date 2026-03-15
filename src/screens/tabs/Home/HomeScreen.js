
import React, { useCallback, useEffect, useState } from 'react';
import {
  View, Text, ScrollView, ImageBackground,
  StyleSheet, Image, TouchableOpacity, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Share from 'react-native-share';

import HomepageHeader from '../../../components/HomepageHeader';
import useLogout from '../../../hooks/useLogout';
import { get_onboarding_user_data } from '../../personalization/PersonalizationAPIs';
import { get_profile_info } from '../../auth/AuthAPI';
import {
  get_random_verses, finish_share,
  get_notifications, get_profile_dashboard_data,
  get_current_goal,
  show_daily_modal,
  daily_check_in
} from '../TabsAPI';
import CommonCard from './CommonCard';
import HomeModal from './HomeModal';
import { useAuth } from '@/context/AuthContext';
import useAppStore from '@/context/useAppStore';
import Indicator from '@/components/Indicator';


export default function HomeScreen() {

 
  const {socket} = useAuth();
  
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);
  const [randomVerse, setRandomVerse] = useState({});
  const [showDailyModal, setDailyModal] = useState(false);

  const access = useAppStore((s) => s.auth.access);
  const profile = useAppStore((s) => s.profile);
  const goal = useAppStore((s) => s.goal);
  const onboarding = useAppStore((s) => s.onboarding);

  const setProfileData = useAppStore((s) => s.setProfileData);
  const setDashboard = useAppStore((s) => s.setDashboard);
  const resolveProfileSettings = useAppStore((s) => s.resolveProfileSettings);
  const setCurrentGoal = useAppStore((s) => s.setCurrentGoal);
  const setLoading = useAppStore((s) => s.setLoading);
  const isDailyLoading = useAppStore((s) => s.ui.isDailyLoading)
  

  console.log("profile -> ", JSON.stringify(profile, null, 2))
  // console.log("goal -> ", JSON.stringify(goal, null, 2));



  useFocusEffect(
    useCallback(() => {
      get_random_verses((res, success) => {
        if (success) setRandomVerse(res?.data?.data ?? {});
      });
      daily_check_in((res, success) => {})
    }, [])
  );

  useEffect(() => {
    get_notifications((res, success) => {
      if (success) {
        socket.setNotifications(res?.data ?? []);
        if (access && !socket.isNotificationSocketConnected) {
          socket.initiateNotificationSocket(access);
        }
      }
    });

    get_current_goal((res, success) => {
      if (success) setCurrentGoal(res?.data ?? {});
    });
  }, [access]);



  

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
  
  useEffect(() => {
    setModalVisible(true);
    get_onboarding_user_data((res, success) => {
      if (!success) {
        setModalVisible(false);
        return;
      }

      get_profile_info((res1, success1) => {
        if (!success1) {
          setModalVisible(false);
          return;
        }

        get_profile_dashboard_data((dashboardRes, dashSuccess) => {
          setModalVisible(false);
          if (dashSuccess) {
            resolveProfileSettings(res?.data, res1?.data, dashboardRes?.data);
            show_daily_modal((modal, isResOk) => {
              if (isResOk && modal.show_modal ) {
                setLoading("isDailyLoading", true)
              }
            });
            
          }
        });
      });
    });
  }, []);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: '#fff', paddingHorizontal: 20 }}>
      <HomepageHeader dashboard={profile.dashboard} userInfo={profile.userInfo} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Verse Card */}
        <ImageBackground
          source={require('../../../../assets/img/Background.png')}
          style={styles.bgImageContainer}
        >
          <View style={styles.bgImageWrapper}>
            <Text style={styles.bgImageCaption}>({randomVerse?.verse_reference})</Text>
            <Text style={styles.bgImageCaptionTitle}>"{randomVerse?.verse_text}"</Text>
            <TouchableOpacity onPress={() => handleShare(randomVerse?.verse_text)} style={styles.bgImageFooter}>
              <Image source={require('../../../../assets/img/24-share.png')} style={styles.bgImageFooterIcon} />
              <Text style={styles.bgImageFooterText}>Share This</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>

        {/* Question Prompt */}
        <View style={styles.questionContainer}>
          <View style={{ width: '20%' }}>
            <Image source={require('../../../../assets/img/Objects.png')} style={styles.messageIcon} />
          </View>
          <View style={{ width: '80%' }}>
            <Text style={styles.questionTitle1}>Have a question on your heart?</Text>
            <Text style={styles.questionTitle2}>Ask & Get Inspired Answers Now</Text>
            <TouchableOpacity onPress={() => navigation.navigate('MessageScreen')}>
              <Text style={styles.questionTitle3}>Give it a try</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quick Links */}
        <View style={styles.multiImageContainer}>
          <TouchableOpacity onPress={() => navigation.navigate('Preachly')} style={styles.commonMultiImage}>
            <Image source={require('../../../../assets/img/OpenBook.png')} style={styles.multiImage} />
            <Text style={styles.multiText}>Explore Scriptures</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('MessageScreen')} style={styles.commonMultiImage}>
            <Image source={require('../../../../assets/img/BrightsSun.png')} style={styles.multiImage} />
            <Text style={styles.multiText}>Find Inspiration</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('History')} style={styles.commonMultiImage}>
            <Image source={require('../../../../assets/img/ReligeousBook.png')} style={styles.multiImage} />
            <Text style={styles.multiText}>Saved Answers</Text>
          </TouchableOpacity>
        </View>

        {/* Popular Questions */}
        <View>
          <Text style={{ fontFamily: 'NunitoBold', fontSize: 20, marginTop: 20 }}>
            Popular Faith Questions
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity onPress={() => navigation.navigate('MessageScreen', { question: "What's the proof that God exists?" })}>
              <Image source={require('../../../../assets/img/ThemeCard.png')} style={styles.imageHorizontalScroll} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('MessageScreen', { question: 'How do I explain the resurrection?' })}>
              <Image source={require('../../../../assets/img/card8.png')} style={styles.imageHorizontalScroll} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('MessageScreen', { question: "Can't people be good without believing in God?" })}>
              <Image source={require('../../../../assets/img/card9.png')} style={styles.imageHorizontalScroll} />
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Weekly Goal Card */}
        <CommonCard
          title="Don't forget to reflect on this week's progress and earn your badge!"
          text={`Days left ${goal?.days_remaining ?? 0} days`}
          onPress={() => navigation.navigate('WeeklyCheckIn')}
        />
      </ScrollView>

      <HomeModal
        modalVisible={isDailyLoading}
        setModalVisible={() => setLoading("isDailyLoading", false)}
        current_streak={profile.dashboard?.streak?.current_streak}
      />

      {modalVisible && <Indicator visible={modalVisible} onClose={() => setModalVisible(false)}>
        <ActivityIndicator size={"large"}/>
      </Indicator>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  imageHorizontalScroll: { height: 170, width: 200, objectFit: 'contain', marginRight: 20 },
  multiText: { fontFamily: 'NunitoSemiBold', fontSize: 12, color: '#2B4752', textAlign: 'center' },
  commonMultiImage: { width: '31%' },
  multiImage: { height: 80, width: '100%', objectFit: 'contain' },
  multiImageContainer: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'flex-start', width: '100%', marginTop: 20,
  },
  questionTitle3: { fontSize: 16, color: '#fff', fontFamily: 'NunitoSemiBold', textDecorationLine: 'underline', textDecorationColor: '#fff', marginTop: 8 },
  questionTitle2: { fontSize: 17, fontFamily: 'NunitoSemiBold', color: '#62E2E2', marginTop: 3 },
  questionTitle1: { fontSize: 17, fontFamily: 'NunitoSemiBold', color: '#fff' },
  messageIcon: { height: 50, width: 50, objectFit: 'contain' },
  questionContainer: {
    flexDirection: 'row', width: '100%', alignItems: 'flex-start',
    justifyContent: 'space-between', backgroundColor: '#00202B',
    padding: 20, borderRadius: 20, marginTop: 20,
  },
  bgImageContainer: { height: 'auto', width: '100%', borderRadius: 20, overflow: 'hidden' },
  bgImageWrapper: { paddingHorizontal: 20, paddingVertical: 10, alignItems: 'center' },
  bgImageCaption: { color: '#966F44', fontFamily: 'NunitoSemiRegular', fontSize: 13 },
  bgImageCaptionTitle: { fontFamily: 'DMSerifDisplay', fontSize: 18, color: '#503524', paddingVertical: 8 },
  bgImageFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: 100 },
  bgImageFooterIcon: { height: 18, width: 18, objectFit: 'contain' },
  bgImageFooterText: { color: '#966F44', fontFamily: 'NunitoBold', fontSize: 15, textDecorationLine: 'underline', textDecorationColor: '#966F44' },
});