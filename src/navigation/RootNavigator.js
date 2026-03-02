import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';
import PersonalizationStack from './PersonalizationStack';
import MainTabs from './MainTabs';
import SubscriptionScreen from '../screens/subscription/SubscriptionScreen';
import { useAuth } from '../context/AuthContext';
import PreachlyScreen from '../screens/tabs/Preachly/PreachlyScreen';
import useAppStore from '@/context/useAppStore';
import { View , Text} from 'react-native';

export default function RootNavigator() {
  
  const { isAuthenticated, isPersonalized, isSubscribed } = useAuth();
  const isLoggedIn = useAppStore(s => s.auth.isLoggedIn);


  return !isLoggedIn?<AuthStack/>: <PersonalizationStack/>


}

const Test = () => {
  return <View className="flex-1 justify-center items-center">
    <Text>Hello</Text>
  </View>
}