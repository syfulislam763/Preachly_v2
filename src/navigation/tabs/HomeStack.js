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
import PersonalInfo from '@/screens/tabs/Profile/PersonalInfo';

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
        headerShown:false,
      })} name="WeeklyCheckIn" component={WeeklyCheckIn} />


      <Stack.Screen options={({navigation}) => ({
        headerShown:false,
      })} name="WeeklyCheckIn_" component={WeeklyCheckIn_} />


      <Stack.Screen 
        options={({navigation}) => ({
          headerShown:false,
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
        headerShown: true,
      })} name="CurrentGoals" component={CurrentGoals} />


      <Stack.Screen options={({navigation}) => ({
        headerShown:false
      })} name="PersonalInfo" component={PersonalInfo} />
      {/* {} */}

      <Stack.Screen options={({navigation}) => ({
        headerShown:false
      })} name="EditPersonalInfo" component={PersonalInfo} />
    </Stack.Navigator>
  );
}