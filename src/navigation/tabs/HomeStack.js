import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../../screens/tabs/Home/HomeScreen';
import Calender from '../../screens/tabs/Profile/Calendar'
import CurrentGoals from '../../screens/tabs/Profile/CurrentGoals';
import BackButton from '../../components/BackButton';
import WeeklyCheckIn from '../../screens/tabs/Profile/WeeklyCheckIn';
import WeeklyCheckIn_ from '../../screens/tabs/Profile/WeeklyCheckIn_';
import RegularCheckIn from '../../screens/tabs/Profile/RegularCheckIn';
import ProfileFaith from '../../screens/tabs/Profile/ProfileFaith';
import QuestionScreen from '../../screens/tabs/Profile/QuestionScreen';
import MessageScreen from '../../screens/tabs/Message/MessageScreen';

const Stack = createNativeStackNavigator();

export default function HistoryStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown:false
      }}
    >
      <Stack.Screen name="HistoryStack" component={HomeScreen} />



      <Stack.Screen name='Calendar' component={Calender}/>


      <Stack.Screen options={({navigation}) => ({
        title: 'Weekly Check-In',
        headerTitleAlign: "center",
        headerShown:true,
        headerShadowVisible: false,
        headerTitleStyle: {
          fontFamily: 'NunitoBold',
          color: '#0b172A',
          fontSize: 18
        },
        headerStyle: {
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
          backgroundColor: '#fff',
        },
        headerLeft: () => <BackButton navigation={navigation}/>
      })} name="WeeklyCheckIn" component={WeeklyCheckIn} />


      <Stack.Screen options={({navigation}) => ({
        headerShown:false,
        title: 'Weekly Check-In',
        headerTitleAlign: "center",
        headerShadowVisible: false,
        headerTitleStyle: {
          fontFamily: 'NunitoBold',
          color: '#0b172A',
          fontSize: 18
        },
        headerStyle: {
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
          backgroundColor: '#fff',
        },
        headerLeft: () => <BackButton navigation={navigation}/>
      })} name="WeeklyCheckIn_" component={WeeklyCheckIn_} />


      <Stack.Screen 
        options={({navigation}) => ({
          headerTitleAlign: "center",
          headerShadowVisible: false,
          headerTitleStyle: {
            fontFamily: 'NunitoBold',
            color: '#0b172A',
            fontSize: 18
          },
          headerStyle: {
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
            backgroundColor: '#fff',
          },
          headerLeft: () => <BackButton navigation={navigation}/>
      })}
      
      name="RegularCheckIn" component={RegularCheckIn} />

      


      <Stack.Screen 
        options={({navigation}) => ({
          headerShown:false
      })}
      
      name="PorfileFaith" component={ ProfileFaith } />

      <Stack.Screen
        options={()=>({
          headerShown:true
        })}
        name='QuestionScreen'
        component={QuestionScreen}
      />


      <Stack.Screen options={({navigation}) => ({
        title: 'Your Current Goals',
        headerTitleAlign: "center",
        headerShown: true,
        headerShadowVisible: false,
        headerTitleStyle: {
          fontFamily: 'NunitoBold',
          color: '#0b172A',
          fontSize: 18
        },
        headerStyle: {
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
          backgroundColor: '#fff',
        },
        headerLeft: () => <BackButton navigation={navigation}/>
      })} name="CurrentGoals" component={CurrentGoals} />


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