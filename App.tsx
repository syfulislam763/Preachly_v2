import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import RootNavigator from './src/navigation/RootNavigator';
import { AuthProvider } from './src/context/AuthContext';
import 'react-native-gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import FontLoader from './src/components/FontLoader';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { StatusBar } from 'react-native';

export default function App() {

  
  return (
    <FontLoader>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <AuthProvider>
            <SafeAreaView style={{flex:1}} edges={['bottom',]}>
              <StatusBar translucent={false} backgroundColor="#ffffff" barStyle="dark-content" />
              <RootNavigator />
            </SafeAreaView>
          </AuthProvider>
        </NavigationContainer>
      </GestureHandlerRootView>
      <Toast/>
    </FontLoader>
  );
}