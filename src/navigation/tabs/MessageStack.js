import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MessageScreen from '../../screens/tabs/Message/MessageScreen';

const Stack = createNativeStackNavigator();

export default function MessageStack() {
  return (
    <Stack.Navigator 
      screenOptions={{
        headerShown:false
      }}
    >
      <Stack.Screen 
        name="MessageScreen" 
        component={MessageScreen} 
        options={{
          //presentation: 'modal',
          headerBackTitleVisible: false
        }}
      />
    </Stack.Navigator>
  );
}