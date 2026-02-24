import React, {useEffect, useLayoutEffect} from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../../screens/tabs/Profile/ProfileScreen';
import ProfileNotification from '../../screens/tabs/Profile/ProfileNotification';
import Calendar from '../../screens/tabs/Profile/Calendar';
import Reward from '../../components/Reward';
import BackButton from '../../components/BackButton';
import CurrentGoals from '../../screens/tabs/Profile/CurrentGoals'
import { useNavigation } from '@react-navigation/native';
import WeeklyCheckIn from '../../screens/tabs/Profile/WeeklyCheckIn'

import RegularCheckIn from '../../screens/tabs/Profile/RegularCheckIn'
import PorfileFaith from '../../screens/tabs/Profile/ProfileFaith'

import QuestionScreen from '../../screens/tabs/Profile/QuestionScreen';
import SettingHome from '../../screens/tabs/Profile/SettingHome'
import PersonalInfo from '../../screens/tabs/Profile/PersonalInfo'
import ProfileSubscription from '../../screens/tabs/Profile/ProfileSubscription'
import AboutApp from '../../screens/tabs/Profile/AboutApp'
import DatePickerButton from '../../screens/tabs/Profile/PersonalInfoUtils/DatePickerButton';
import ConfirmationCode from '../../screens/auth/ConfirmationCode';
import WeeklyCheckIn_ from '../../screens/tabs/Profile/WeeklyCheckIn_';
import { useRoute } from '@react-navigation/native';

const Stack = createNativeStackNavigator();

export default function ProfileStack() {
  const navigation = useNavigation()
  const route = useRoute();


  return (
    <Stack.Navigator 
    >
      <Stack.Screen options={{headerShown:false}} name="ProfileScreen" component={ProfileScreen} />

      <Stack.Screen options={({navigation}) => ({
        title: 'Setting',
        headerTitleAlign: "center",
        headerShadowVisible: false,
        headerTitleStyle: {
          fontFamily: 'NunitoSemiBold',
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
      })} name="SettingHome" component={SettingHome} />

      <Stack.Screen options={({navigation}) => ({
        title: 'Personal Info',
        headerTitleAlign: "center",
        headerShadowVisible: false,
        headerTitleStyle: {
          fontFamily: 'NunitoSemiBold',
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
      })} name="PersonalInfo" component={PersonalInfo} />
      {/* {} */}

      <Stack.Screen options={({navigation}) => ({
        title: 'Edit Personal Info',
        headerTitleAlign: "center",
        headerShadowVisible: false,
        headerTitleStyle: {
          fontFamily: 'NunitoSemiBold',
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
      })} name="EditPersonalInfo" component={PersonalInfo} />

      <Stack.Screen options={({navigation}) => ({
        title: 'Subscription',
        headerTitleAlign: "center",
        headerShadowVisible: false,
        headerTitleStyle: {
          fontFamily: 'NunitoSemiBold',
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
      })} name="ProfileSubscription" component={ProfileSubscription} />

      <Stack.Screen options={({navigation}) => ({
        title: 'About the app',
        headerTitleAlign: "center",
        headerShadowVisible: false,
        headerTitleStyle: {
          fontFamily: 'NunitoSemiBold',
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
      })} name="AboutApp" component={AboutApp} />

      <Stack.Screen options={({navigation}) => ({
        title: 'Notifications',
        headerTitleAlign: "center",
        headerShadowVisible: false,
        headerTitleStyle: {
          fontFamily: 'NunitoSemiBold',
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
      })} name="ProfileNotification" component={ProfileNotification} />

      <Stack.Screen options={({navigation}) => ({
        title: '',
        headerTitleAlign: "center",
        headerShadowVisible: false,
        headerTitleStyle: {
          fontFamily: 'NunitoSemiBold',
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
      })} name="ConfirmEmail" component={ConfirmationCode} />



      <Stack.Screen options={({navigation}) => ({
        headerShown:false,
      })} name="Calendar" component={Calendar} />

      <Stack.Screen options={({navigation}) => ({
        title: 'Your Current Goals',
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
      })} name="CurrentGoals" component={CurrentGoals} />

      <Stack.Screen options={({navigation}) => ({
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
      
      name="PorfileFaith" component={PorfileFaith } />

      <Stack.Screen
        options={()=>({
          headerShown:true
        })}
        name='QuestionScreen'
        component={QuestionScreen}
      />


    </Stack.Navigator>
  );
}