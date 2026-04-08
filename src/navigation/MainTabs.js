import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStack from './tabs/HomeStack';
import HistoryStack from './tabs/HistoryStack';
import MessageStack from './tabs/MessageStack';
import PreachlyStack from './tabs/PreachlyStack';
import ProfileStack from './tabs/ProfileStack';
import { Image, View } from 'react-native';
import { getFocusedRouteNameFromRoute, useNavigation, useNavigationState } from '@react-navigation/native';
import useLayoutDimention from '../hooks/useLayoutDimention';
import MessageScreen from '../screens/tabs/Message/MessageScreen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Tab = createBottomTabNavigator();

const homeActive = require("../../assets/updated_img/house_black.png")
const homeInactive = require("../../assets/updated_img/house_green.png")
const historyInactive = require("../../assets/updated_img/history_green.png")
const historyActive = require("../../assets/updated_img/history_black.png")


const chat = require("../../assets/updated_img/chat_green.png")

const bookInactive = require("../../assets/updated_img/bible_green.png")
const bookActive = require("../../assets/updated_img/bible_black.png")

const profileInactive = require("../../assets/updated_img/profile_green.png")
const profileActive = require("../../assets/updated_img/profile_black.png")

const NullComponent = () => {
  return null
}

export default function MainTabs() {
  const navigation = useNavigation();
  const inset = useSafeAreaInsets();


  return (
    <Tab.Navigator
      screenOptions={({ route }) => { 
        const routeName = getFocusedRouteNameFromRoute(route) ?? '';
        const hiddenRoutes = ['WeeklyCheckIn', 'CurrentGoals', 'RegularCheckIn', 'WeeklyCheckIn_','PorfileFaith', 'ProfileNotification', 'SettingHome', 'PersonalInfo', 'ProfileSubscription', 'EditPersonalInfo', 'ConfirmEmail', 'MessageScreen', 'AboutApp', 'HistoryDetails', 'Calendar']
        const shouldHideTabBar = hiddenRoutes.includes(routeName);

        const preachly_obj = (route?.name === "Preachly" )? {}: {shadowColor: '#000000',
            shadowOpacity: 0.1,
            shadowOffset: { width: 0, height: -3 },
            elevation: 10,}

        return {
          headerShown: false,
          tabBarShowLabel: true,
          tabBarIcon: ({ focused, color, size }) => {
            let icon
            if (route.name === 'Home') {
              icon = focused ? homeActive : homeInactive;
            } else if (route.name === 'History') {
              icon = focused ?  historyActive : historyInactive;
            }
            else if(route.name === "Message"){
              icon = focused ? chat : chat;
            }
            else if(route.name === "Preachly"){
              icon = focused ? bookActive : bookInactive;
            }else{
              icon = focused ? profileActive : profileInactive;
            }
            return <Image style={{
              height:30,
              width:30,
              objectFit:'contain'
            }} source={icon}/>;
          },
          tabBarActiveTintColor: '#fff',
          tabBarInactiveTintColor: '#fff',
          tabBarStyle: shouldHideTabBar?{display:'none'} :{
            backgroundColor: '#fff',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            height: 70+inset.bottom,
            paddingBottom: 20,
            paddingTop: 10,
            marginBottom: 0,
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            ...preachly_obj,
            borderTopColor: '#fff'

          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
            backgroundColor:'#fff'
          },
        }
      }}
    
    >
      <Tab.Screen
        name="Home" 
        
        component={HomeStack} 
      />
      <Tab.Screen 
       name="History" 
       component={HistoryStack} 
       />
      <Tab.Screen 
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            // navigation.navigate("Message", {
            //   screen: "MessageScreen"
            // });
            navigation.navigate("MessageScreen")
          }
        }}
        name="Message" 
        component={MessageScreen} 
        
      />
     

      <Tab.Screen name="Preachly" component={PreachlyStack} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
}