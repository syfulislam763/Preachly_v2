import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, Pressable, ImageBackground, ActivityIndicator} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import ProgressBar from '../../components/ProgressBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import CommonButton from '../../components/CommonButton';
import { deepGreen, primaryText } from '../../components/Constant';
import useLayoutDimention from '../../hooks/useLayoutDimention';
import { getStyles } from './PersonalizationScreen4Style';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import { useNavigation } from '@react-navigation/native';
import Indicator from '../../components/Indicator';
import { bible_familiarity} from './PersonalizationAPIs';
import useStaticData from '../../hooks/useStaticData';


export default function PersonalizationScreen() {
  const {store} = useAuth();

  const {isSmall, isMedium, isLarge, isFold} = useLayoutDimention()
  const styles = getStyles(isSmall, isMedium, isLarge, isFold)
  const [isLoading, setIsLoading] = useState(false)
  const [index, setIndex] = useState(-1);
  const [id, setId] = useState(null);
  const navigation = useNavigation();
  const handleSubmit = () => {
    const payload = {
      "bible_familiarity_option": id
    };
    setIsLoading(true);
    bible_familiarity(payload, (response, success) => {
      setIsLoading(false);
      if (success) {
        navigation.navigate("Personalization5");
      } else {
        console.error("Error submitting bible familiarity:", response);
      }
    })
  }


  return (
    <View style={styles.container}>
      
      <View>
        <View style={{}}>
          <ProgressBar progress={14.28*5} />
        </View>

        <Text style={styles.title}>How familiar are you with the Bible</Text>


        <View style={styles.imageContainer}>

            <PhotoCard 
              isActive={index==0}
              setIsActive={() => {
                setIndex(0);
                setId(store?.bible_familiarity_data[0].id)
              }}
              text={store?.bible_familiarity_data[0].label}
              img={require("../../../assets/img/card_bg1.png")}
            />
            <PhotoCard 
              isActive={index==1}
              setIsActive={() => {
                setIndex(1);
                setId(store?.bible_familiarity_data[1].id)
              }}
              text={store?.bible_familiarity_data[1].label}
              img={require("../../../assets/img/card_bg2.png")}
            />
            <PhotoCard 
              isActive={index==2}
              setIsActive={() => {
                setIndex(2);
                setId(store?.bible_familiarity_data[2].id)
              }}
              text={store?.bible_familiarity_data[2].label}
              img={require("../../../assets/img/card_bg3.png")}
            />
          
        </View>

        
        <Content
          styles={styles}
          data={store?.bible_familiarity_data[index]}
        />
        



      </View>

      <CommonButton
          btnText={"Continue"}
          bgColor={deepGreen}
          navigation={navigation}
          route={""}
          handler={handleSubmit}
          txtColor={primaryText}
          bold='bold'
          opacity={index==-1?0.7:1}
          disabled={index==-1?true:false}

      />
      {isLoading && <Indicator visible={isLoading} onClose={() => setIsLoading(false)}  ><ActivityIndicator size="large" /></Indicator>}
    </View>
  );
}



const Content = ({styles, data}) => {
  return <View>
          <View style={styles.textContainer}>
              <Text style={styles.text}>{data?.text1}</Text>
              {!data && <Text style={styles.text}>{"Select an option"}</Text>}
              <View style={{height:15}}></View>
              {data?.text2 && <Text style={styles.text}>{data?.text2}</Text>}
          </View>

          <View style={{alignItems:'center'}}>
              <Text style={styles.subtitle}>{data?.title}</Text>

              <Text style={styles.semitext}>{data?.caption}</Text>
          </View>
    </View>
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
                fontFamily:"NunitoExtraBold",
                textAlign:'center',
                fontSize:hp("2%")
              }}>{text}</Text>
            </ImageBackground>
          </View>
      </Pressable>
}

const styles = StyleSheet.create({
  img: { 
    height:hp("12%"),
    width: wp("27%"), 
    objectFit:'contain', 
    padding:15,
    justifyContent:'center',
    alignItems:"center"
  },
  imgWrapper:{
    height:hp("12%"),
    width: wp("27%"), 
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

})