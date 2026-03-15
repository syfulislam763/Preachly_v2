import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HistoryScreen from '../../screens/tabs/History/HistoryScreen';
import MessageScreen from '../../screens/tabs/Message/MessageScreen';
import HistoryWrapper from '@/screens/tabs/History/HistoryWrapper';
import HistoryDetails from '@/screens/tabs/History/HistoryDetails';

const Stack = createNativeStackNavigator();

export default function HistoryStack() {
  return (
    <Stack.Navigator 
      screenOptions={{
        headerShown:false
      }}
    >
      <Stack.Screen name="HistoryStack" component={HistoryScreen} />

      <Stack.Screen 
          name="HistoryDetails" 
          component={HistoryDetails} 
          options={{
            headerBackTitleVisible: false
          }}
        />
    </Stack.Navigator>
  );
}