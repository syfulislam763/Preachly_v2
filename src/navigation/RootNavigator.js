import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';
import PersonalizationStack from './PersonalizationStack';
import MainTabs from './MainTabs';
import SubscriptionScreen from '../screens/subscription/SubscriptionScreen';
import { useAuth } from '../context/AuthContext';
import PreachlyScreen from '../screens/tabs/Preachly/PreachlyScreen';

export default function RootNavigator() {
  
  const { isAuthenticated, isPersonalized, isSubscribed } = useAuth();
  



  return !isAuthenticated?<AuthStack/>:<PersonalizationStack/>


}