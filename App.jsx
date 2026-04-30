import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import { AuthProvider } from './src/context/AuthContext';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import FontLoader from './src/components/FontLoader';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View } from 'react-native';
import Toast from 'react-native-toast-message';
import { StatusBar } from 'react-native';
import 'global.css'
import { initFCM } from '@/context/fcm';
import { getMessaging, setBackgroundMessageHandler } from '@react-native-firebase/messaging';

setBackgroundMessageHandler(getMessaging(), async () => {});

export default function App() {

  useEffect(() => {
    initFCM();
  }, [])
  
  return (
    <FontLoader>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <AuthProvider>
            <View style={{flex:1}}>
              <StatusBar translucent={false} backgroundColor="#ffffff" barStyle="dark-content" />
              <RootNavigator />
            </View>
          </AuthProvider>
        </NavigationContainer>
      </GestureHandlerRootView>
      <Toast/>
    </FontLoader>
  );
}