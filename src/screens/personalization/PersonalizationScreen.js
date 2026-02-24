import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ImageBackground, ActivityIndicator} from 'react-native';
import ProgressBar from '../../components/ProgressBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import CommonButton from '../../components/CommonButton';
import { deepGreen, primaryText } from '../../components/Constant';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import { journey_reason, onboarding_options } from './PersonalizationAPIs';
import { useNavigation } from '@react-navigation/native';
import Indicator from '../../components/Indicator';
import { handleToast } from '../auth/AuthAPI';
import { logoutUser } from '../../context/api';
import { useAuth } from '../../context/AuthContext';
import useStaticData from '../../hooks/useStaticData';


export default function PersonalizationScreen() {
 
  const { logout, store } = useAuth();

  const [cardOne, setCardOne] = useState(false)
  const [cardTwo, setCardTwo] = useState(false)
  const [loading, setLoading] = useState(false);
  const [id, setId] = useState(-1)

  const navigation = useNavigation();


  const handleIsActive = (id, toggle) => {
    if(toggle){
      setCardOne(true);
      setCardTwo(false);
    }else{
      setCardOne(false);
      setCardTwo(true);
    }
    setId(id)
  }

  const handleJourneyReason = () => {
    const payload = {
      "journey_reason": id
    } 

 
    
    setLoading(true);
    journey_reason(payload, (res, status) => {
      if(status) {
        
        setLoading(false);
        navigation.navigate("Personalization1");
      } else if(res.response && res.response.status === 401) {
        setLoading(false);
        handleToast("error", "Session expired. Please login again.", 2000, () => {
          logoutUser(() => {
            logout();
          }, () => {
            setLoading(false)
          });
        });

      }else {
        console.log("Error fetching journey reason: ", res.response.status);
        setLoading(false);
      }
    });
  }



  return (
    <SafeAreaView style={styles.container}>
      
      <View>
        <View style={{marginTop:"10%"}}>
          <ProgressBar progress={14.28} />
        </View>

        <Text style={styles.title}>Your Journey Matters. Let's discover how Preachly can empower your faith</Text>

        <Text style={styles.text}>When it comes to your faith, what do you need most right now?</Text>


        <View style={styles.imageContainer}>
            <PhotoCard
              isActive={cardOne}
              setIsActive={() => handleIsActive(store?.faith_journey_reasons[0]?.id, true)}
              img={require("../../../assets/img/card_bg1.png")}
              text={store?.faith_journey_reasons[0]?.name}
            />
            <PhotoCard
              isActive={cardTwo}
              setIsActive={() => handleIsActive(store?.faith_journey_reasons[1]?.id, false)}
              img={require("../../../assets/img/card_bg2.png")}
              text={store?.faith_journey_reasons[1]?.name}
            />
            
        </View>

        {(id==-1) && <View style={{
          display:'flex',
          flexDirection:'row',
          alignItems:'center',
          justifyContent:'center',
          height:"25%",
          width:"100%"
        }}>
          <Text style={
            {fontFamily:'NunitoSemiBold', fontSize:18, color: '#2B4752', textAlign:'center', flexWrap:'wrap'}
          }>Select an option</Text>
          </View>}
      </View>

      <CommonButton
          btnText={"Continue"}
          bgColor={deepGreen}
          navigation={navigation}
          route={""}
          txtColor={primaryText}
          handler={handleJourneyReason}
          bold='bold'
          opacity={id==-1?0.7:1}
          disabled={id==-1?true:false}
      />
      {loading && <Indicator>
        <ActivityIndicator size="large" />
      </Indicator>}
    </SafeAreaView>
  );
}


const PhotoCard = ({isActive, setIsActive, img, text}) => {

  return <Pressable onPress={setIsActive} style={
    isActive?styles.imgWrap:{...styles.imgWrap, borderWidth:0}
  }>
          <View style={isActive?styles.imgWrapper:{...styles.imgWrapper, opacity:0.5}}>
            <ImageBackground
              source={img}
              style={styles.img}
            >
              <Text style={{
                flexWrap:'wrap',
                fontFamily:"NunitoSemiBold",
                textAlign:'center',
                fontSize:hp("2%")
              }}>{text}</Text>
            </ImageBackground>
          </View>
      </Pressable>
}

const styles = StyleSheet.create({
  container: {flex:1, backgroundColor:'#fff', justifyContent:'space-between', padding: 20, paddingBottom:27},
  title: {fontFamily:'DMSerifDisplay', fontSize:30, textAlign:'center', flexWrap:'wrap', paddingTop: 40, paddingBottom: 30,color:'#0B172A', lineHeight: 35},
  text: {fontFamily:'NunitoBold', fontSize:18, color: '#2B4752', textAlign:'center', flexWrap:'wrap', paddingBottom: 50},
  img: { 
    height:hp("12%"),
    width: wp("42%"), 
    objectFit:'contain', 
    padding:15,
    justifyContent:'center',
    alignItems:"center"
  },
  imgWrapper:{
    height:hp("12%"),
    width: wp("42%"), 
    objectFit:'contain', 
    borderRadius:hp("1.5%"),
    backgroundColor:'#fff',
    opacity:1,
    overflow:'hidden'
  },
  imgWrap:{
    backgroundColor: "#fff",
    padding:5,
    borderWidth:2,
    borderColor:"#bda58a",
    borderRadius:hp("2%"),
    boxSizing:'border-box',
    overflow:"hidden"
  },
  imageContainer: {display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between', backgroundColor: '#fff', }

})