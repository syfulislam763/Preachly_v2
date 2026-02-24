import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import CommonButton from '../../components/CommonButton';
import { deepGreen , primaryText} from '../../components/Constant';
import { useAuth } from '../../context/AuthContext';
import ParagraphIcon from '../../components/ParagraphIcon';


const { width, height } = Dimensions.get('window');

const SubscriptionConfirmedScreen = ({ navigation }) => {

  const {completePersonalization , completeSubscription} = useAuth()


  return (
    <View style={styles.container}>
    
      <View style={styles.textContainer}>
        <Text style={styles.successText}>Subscription Confirmed!</Text>
      
        <Text style={styles.subtitle}>
            Words have power-now you have even more at your fingertips
        </Text>

        <View>
          <ParagraphIcon
              icon={require("../../../assets/img/infinity.png")}
              text={"Unlimited access to Inspired Answers"}
          />
          <ParagraphIcon
              icon={require("../../../assets/img/bulb.png")}
              text={"Save and revisit key insights"}
          />
          <ParagraphIcon
              icon={require("../../../assets/img/message.png")}
              text={"Speak boldly with scriptural wisdom"}
          />
        </View>


      </View>
        <Image
            source={require('../../../assets/img/bg_large1.png')}
            style={{
                height:'100%', 
                width:'100%', 
                objectFit:'contain',
                position:'absolute',
                top: (height*20)/100,
                left:0,
                right:0,
                zIndex: 1
            }}
        />

        <View style={styles.btnContainer}>
            <CommonButton
                btnText={"Find Answers"}
                bgColor={deepGreen}
                navigation={navigation}
                route={""} //MainTabs
                handler={() => {
                  completePersonalization(true);
                  completeSubscription(true)
                }}
                txtColor={primaryText}
                bold='bold'
                opacity={1}
            />
        </View>
      
    </View>
  );
};


export default SubscriptionConfirmedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    position:'relative'
  },
  textContainer: {
    height: height * (1/5),
    width: '100%',
    backgroundColor:'#fff',
    marginTop:'8%',
    paddingHorizontal:20
  },
  imageSection: {
    height: height * (3/4),
    width: '100%',
    backgroundColor: 'green',
  },
  btnContainer:{
    paddingHorizontal: 20,
    position:'absolute',
    bottom: (height*5)/100,
    left:0,
    right:0,
    zIndex: 1
  },
  successText: {
    fontSize: 32,
    fontFamily:'DMSerifDisplay',
    color:"#0B172A"
  },
  welcomeTitle: {
    fontSize: 32,
    fontFamily:'DMSerifDisplay'
  },
  subtitle: {
    color: '#2B4752',
    textAlign: 'center',
    fontFamily:'NunitoSemiBold',
    fontSize: 17,
    padding: 20
  },
  button: {
    backgroundColor: '#005A55',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    width: width * 0.8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
