import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HistoryScreen from '../../screens/tabs/History/HistoryScreen';
import MessageScreen from '../../screens/tabs/Message/MessageScreen';

const Stack = createNativeStackNavigator();

export default function HistoryStack() {
  return (
    <Stack.Navigator 
      screenOptions={{
        headerShown:false
      }}
    >
      <Stack.Screen name="HistoryStack" component={HistoryScreen} />

      {/* <Stack.Screen 
          name="MessageScreen" 
          component={MessageScreen} 
          options={{
            presentation: 'modal',
            headerBackTitleVisible: false
          }}
        /> */}
    </Stack.Navigator>
  );
}