import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStack from './tabs/HomeStack';
import HistoryStack from './tabs/HistoryStack';
import MessageStack from './tabs/MessageStack';
import PreachlyStack from './tabs/PreachlyStack';
import ProfileStack from './tabs/ProfileStack';
import { Image, View } from 'react-native';
import { getFocusedRouteNameFromRoute, useNavigation } from '@react-navigation/native';
import useLayoutDimention from '../hooks/useLayoutDimention';
import MessageScreen from '../screens/tabs/Message/MessageScreen';

const Tab = createBottomTabNavigator();

const homeActive = require("../../assets/img/24-house.png")
const homeInactive = require("../../assets/img/24-houseInactive.png")
const historyInactive = require("../../assets/img/24-history.png")
const historyActive = require("../../assets/img/ClockCounterClockwise.png")


const chat = require("../../assets/img/24-chat.png")

const bookInactive = require("../../assets/img/24-Book.png")
const bookActive = require("../../assets/img/24-BookActive.png")

const profileInactive = require("../../assets/img/24-user.png")
const profileActive = require("../../assets/img/UserActive.png")

const NullComponent = () => {
  return null
}

export default function MainTabs() {
  const navigation = useNavigation()
 

  return (
    <Tab.Navigator
      screenOptions={({ route }) => { 
        const routeName = getFocusedRouteNameFromRoute(route) ?? '';
        const hiddenRoutes = ['WeeklyCheckIn', 'CurrentGoals', 'RegularCheckIn', 'PorfileFaith', 'ProfileNotification', 'SettingHome', 'PersonalInfo', 'ProfileSubscription', 'EditPersonalInfo', 'ConfirmEmail', 'MessageScreen']
        const shouldHideTabBar = hiddenRoutes.includes(routeName);
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
              height:24,
              width:24,
              objectFit:'contain'
            }} source={icon}/>;
          },
          tabBarActiveTintColor: '#fff',
          tabBarInactiveTintColor: '#fff',
          tabBarStyle: shouldHideTabBar?{display:'none'} :{
            backgroundColor: '#fff',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            height: 60,
            paddingBottom: 20,
            paddingTop: 10,
            marginBottom: 0,
            // position: 'absolute',
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowOffset: { width: 0, height: -2 },
            elevation: 10,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
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