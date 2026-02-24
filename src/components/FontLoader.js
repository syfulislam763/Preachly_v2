
import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import * as Font from 'expo-font';

const FontLoader = ({ children }) => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'DMSerifDisplay': require('../../assets/fonts/DMSerifDisplay-Regular.ttf'),
        'Nunito': require('../../assets/fonts/Nunito-VariableFont_wght.ttf'),
        'NunitoSemiBold': require('../../assets/fonts/Nunito-SemiBold.ttf'),
        'NunitoRegular': require('../../assets/fonts/Nunito-Regular.ttf'),
        'NunitoExtraBold': require("../../assets/fonts/Nunito-ExtraBold.ttf"),
        'NunitoBold': require("../../assets/fonts/Nunito-Bold.ttf")
      });
      setFontsLoaded(true);
    }
    
    loadFonts();
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return children;
};

export default FontLoader;