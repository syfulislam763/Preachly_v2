import React, { useEffect, useState } from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, Dimensions, Image, ActivityIndicator } from 'react-native';
import CommonButton from '../../components/CommonButton';
import { deepGreen , primaryText} from '../../components/Constant';
import { useAuth } from '../../context/AuthContext';
import useLayoutDimention from '../../hooks/useLayoutDimention';
import { getStyles } from './authStyles/FinishAuthenticationStyle';
import { setAuthToken } from '../../context/api';
import { onboarding_complete } from '../personalization/PersonalizationAPIs';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Indicator from '../../components/Indicator';
import { get_onboarding_all_data } from '../personalization/PersonalizationAPIs';

const { width, height } = Dimensions.get('window');

const FinishAuthentication = () => {
  const navigation = useNavigation();
  const {login, store, updateStore} = useAuth()
  const {isSmall, isMedium, isLarge, isFold} = useLayoutDimention();
  const [loading, setLoading] = useState(false);

  const styles = getStyles(isSmall, isMedium, isLarge, isFold)

  const handleForward = () => {

    setLoading(true);

    get_onboarding_all_data(store?.access, (res, success) => {
      setLoading(false)
      if(success){
          const denominations = [...res?.data?.denominations];
          denominations.push({
              "id": 0,
              "name": "None",
              "is_active": false,
              is_selected: false,
          })
          let faith_journey_reasons = [...res?.data?.journey_reasons];
          faith_journey_reasons = faith_journey_reasons.map(item => ({...item, name: item?.option}));

          let bible_versions = [...res?.data?.bible_versions];
          bible_versions = bible_versions.map(item => ({...item, name: item?.title}));
          
          const bible_familiarity_data = [...res?.data?.bible_familiarity];
          
          
          const tone_preference_data = [...res?.data?.tone_preferences];

          const faith_goal_questions = [...res?.data?.faith_goal_questions];
          const temp = {...store,denominations, faith_goal_questions, faith_journey_reasons, bible_versions, bible_familiarity_data, tone_preference_data }
          updateStore(temp);
          console.log(JSON.stringify(temp, null, 2), "test")

          setAuthToken(store?.access, store?.refresh, async () => {
            await AsyncStorage.setItem('store', JSON.stringify(temp));
            login();
          })
      }else{
        console.log(res);
      }
    })
    
  }


  return (
    <View style={styles.container}>
    
      <View style={styles.textContainer}>
        <Text style={styles.successText}>You're in!</Text>
        <Text style={styles.welcomeTitle}>Welcome to Preachly</Text>
        <Text style={styles.subtitle}>
          Let's tailor your experience to help you grow in faith and confidence.
        </Text>
      </View>
        <Image
            source={require('../../../assets/img/Preachly.png')}
            style={{
                height:'100%', 
                width:'100%', 
                objectFit:'contain',
                position:'absolute',
                top: (height*17)/100,
                left:0,
                right:0,
                bottom:0,
                zIndex: 1
            }}
        />

        <View style={styles.btnContainer}>
            <CommonButton
                btnText={store?.onboarding_completed?"Go to home": "Go to personalization"}
                bgColor={deepGreen}
                navigation={navigation}
                route={""}
                handler={() => handleForward()}
                txtColor={primaryText}
                bold='bold'
                opacity={1}
            />
        </View>

        {loading && <Indicator visible={loading} onClose={() => setLoading(false)}>
          <ActivityIndicator size={"large"}/>
        </Indicator>}
    </View>
  );
};


export default FinishAuthentication;