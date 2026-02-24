import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions, Dimensions, StatusBar } from 'react-native';
import {
  SafeAreaView
} from 'react-native-safe-area-context';
import ImageSlider from '../../components/Slider';
import FooterBar from '../../components/FooterBar';

import CustomCarousel from '../../components/CustomCarousel';
import useLayoutDimention from '../../hooks/useLayoutDimention';
const {height, width} = Dimensions.get("window")

export default function WelcomeScreen({ navigation }) {
  
  

  return (
    <SafeAreaView style={{flex:1, backgroundColor:'#fff', justifyContent:'space-between'}}>
      {/* <ImageSlider /> */}
      <CustomCarousel/>

      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('AuthHome')}> 
          <Text style={styles.btnText}>Begin Your Journey</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  
  btnContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10
  },
  btn: {
    backgroundColor: '#005A55',
    padding: 18,
    borderRadius: 25,
    alignItems: 'center',
    width: '90%',
  },
  btnText: {
    fontSize: 16,
    fontFamily:'NunitoSemiBold',
    color: '#fff',
  }
})
