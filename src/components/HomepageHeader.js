import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome, Feather } from '@expo/vector-icons'; // Use `react-native-vector-icons` if not using Expo
import { useAuth } from '../context/AuthContext';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import { useNavigation } from '@react-navigation/native';
import HomeModal from '../screens/tabs/Home/HomeModal';


const HomepageHeader = ({userInfo, dashboard}) => {
  const {store} = useAuth();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false)


  return (
    <View style={styles.container}>
      {/* Left: Profile Picture and Greeting */}
      <View style={styles.leftSection}>
        <View>
          {/* {userInfo?.profile_picture?
          <Image
            source={{uri:userInfo?.profile_picture}} 
            style={styles.avatar}
          />:
          <EvilIcons style={{...styles.avatar}} name="user" size={40} color="black" />
          } */}
          <TouchableOpacity onPress={() => navigation.navigate("PersonalInfo")}>
            <Image
            source={userInfo?.profile_picture?{uri:userInfo?.profile_picture}:require("../../assets/img/user1.png")} 
            style={styles.avatar}
          />
          </TouchableOpacity>
        </View>
        <View>
          <Text style={styles.welcome}>Welcome,</Text>
          <Text style={styles.welcome}>{userInfo?.name}</Text>
        </View>
      </View> 

      {/* Right: Icons */}
      <View style={styles.rightSection}>
        <TouchableOpacity onPress={() => navigation.navigate("Calendar", {flag:true})} style={styles.iconButton}>
            <Image
                source={require('../../assets/img/24-calendar.png')} 
                style={{
                    height:26,
                    width:26,
                    objectFit:'contain'
                }}
            />
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>{setModalVisible(true)}} style={styles.countButton}>
            <Image
                source={require('../../assets/img/Fire.png')} 
                style={{
                    height:18,
                    width:18,
                    objectFit:'contain'
                }}
            />
          <Text style={styles.countText}>{dashboard?.streak?.current_streak || "0"}</Text>
        </TouchableOpacity>
      </View>


      <HomeModal setModalVisible={setModalVisible} current_streak={dashboard?.streak?.current_streak} modalVisible={modalVisible}/>
    </View>
  );
};

export default HomepageHeader;


const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 12,
  },
  welcome: {
    fontSize: 17,
    color: '#0B172A',
    fontFamily:'NunitoBold'
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  countButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 10,
    backgroundColor: '#0F172A',
    borderRadius: 999,
  },
  countText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 12,
    fontWeight: '500',
  },
});

