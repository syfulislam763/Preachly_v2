import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import PreachlyScreen from '../../screens/tabs/Preachly/PreachlyScreen';

const Stack = createNativeStackNavigator();

export default function PreachlyStack() {
  return (
    <Stack.Navigator 
      screenOptions={{
        headerShown:false
      }}
    >
      <Stack.Screen name="PreachlyMain" component={PreachlyScreen} />
    </Stack.Navigator>
  );
}