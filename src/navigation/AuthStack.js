import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/welcome/WelcomeScreen';
import SignInScreen from '../screens/auth/SignInScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import AuthHome from '../screens/auth/AuthHome';
import ConfirmationEmail from '../screens/auth/ConfirmationEmail';
import ConfirmationCode from '../screens/auth/ConfirmationCode';
import CreatePassword from '../screens/auth/CreatePassword';
import FinishAuthentication from '../screens/auth/FinishAuthentication';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { backNavigationStyle, commonNavigationOptions } from '../components/Constant';
import BackButton from '../components/BackButton';
import PrivacyPolicy from '@/screens/tabs/Profile/PrivacyPolicy';
import TermsAndCondition from '@/screens/tabs/Profile/TermsAndCondition';


const Stack = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator>

      <Stack.Screen
        options={{ headerShown: false }}
        name="Welcome" 
        component={WelcomeScreen} />
        <Stack.Screen
        options={{ headerShown: false }}
        name="AuthHome" 
        component={AuthHome} />

      <Stack.Screen  
        options={({ navigation }) => ({
        headerShown:false,
        title: "Sign Up",
        headerTitleAlign: "center",
        headerShadowVisible: false,
        headerTitleStyle: {
          fontFamily: 'NunitoSemiBold',
          color: '#0b172A',
          fontSize: 16
        },
        headerStyle: {
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
          backgroundColor: '#fff',
        },
        headerLeft: () => <BackButton navigation={navigation}/>,
      })} 
      name="SignUp" 
      component={SignUpScreen} 
      />

      <Stack.Screen 
        options={{headerShown:false}}
        name="ConfirmationEmail" 
        component={ConfirmationEmail} 
      />
        <Stack.Screen
        options={{headerShown:false}}
        name="ConfirmationCode" 
        component={ConfirmationCode} 
      />

      <Stack.Screen 
        options={{headerShown:false}}
        name="CreatePassword" 
        component={CreatePassword} 
      />
      <Stack.Screen 
      options={{headerShown:false}}
      name="FinishAuthentication" 
      component={FinishAuthentication} 
      />
      <Stack.Screen 
        options={{headerShown:false}}
        name="TermsAndCondition" 
        component={TermsAndCondition} 
      />
      <Stack.Screen 
        options={{headerShown:false}}
        name="PrivacyPolicy" 
        component={PrivacyPolicy} 
      />

      <Stack.Screen 
      options={({ navigation }) => ({
        headerShown:false,
          title: "Log in",
          headerTitleAlign: "center",
          headerShadowVisible: false,
          headerTitleStyle: {
            fontFamily: 'NunitoSemiBold',
            color: '#0b172A',
            fontSize: 16
          },
          headerStyle: {
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
            backgroundColor: '#fff',
          },
          headerLeft: () => <BackButton navigation={navigation}/>,
        })}   
      name="SignIn" 
      component={SignInScreen} 
      />
    </Stack.Navigator>
  );
}
