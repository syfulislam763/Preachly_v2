
import React, { useLayoutEffect } from 'react'
import { View, Text, Image, StyleSheet, Pressable} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AboutApp = () => {


  const navigation = useNavigation();

  return (
    <View style={{
      flex:1, backgroundColor:'#fff',paddingHorizontal:20, paddingVertical:40
    }}>
        <View style={{
          display:'flex',
          flexDirection:'column',
          alignItems:'center',
          justifyContent:'space-between',
        }}>
          <Image 
            source={require("../../../../assets/img/AppIcon.png")}
            style={{
              height:90,
              width:90,
              objectFit:'contain',
            }}
          />
          <Text style={{
            color:'#0B172A',
            fontFamily:'NunitoBold',
            fontSize:20,
            paddingTop: 30
          }}>Preachly</Text>
          <Text style={{
            color:'#90B2B2',
            fontFamily:'NunitoSemiBold',
            fontSize:16,
            paddingVertical: 15
          }}>Version 1.0.0</Text>
        </View>
        
        <Pressable 
            onPress={() => {navigation.navigate("PrivacyPolicy")}}
        >
            <View style={styles.settingMenu}>
            <Text style={styles.menuText}>Privacy Policy</Text>
            <Image
                source={require("../../../../assets/img/CaretRight.png")}
                style={styles.caretRight}
            />
            </View>
        </Pressable>
        <View style={{height:15}}></View>
        <Pressable 
            onPress={() => {navigation.navigate("TermsAndCondition")}}
        >
            <View style={styles.settingMenu}>
            <Text style={styles.menuText}>Terms and Conditions</Text>
            <Image
                source={require("../../../../assets/img/CaretRight.png")}
                style={styles.caretRight}
            />
            </View>
        </Pressable>

    </View>
  )
}

export default AboutApp

const styles = StyleSheet.create({
  menuText:{
    fontFamily:'NunitoSemiBold',
    color:'#0B172A',
    fontSize: 18
  },
  settingMenu:{
    display: 'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    backgroundColor:'#F3F8F8',
    padding: 15,
    borderRadius: 20
  },
  caretRight:{
    width:20,
    height:20,
    objectFit:"contain"
  },
});
