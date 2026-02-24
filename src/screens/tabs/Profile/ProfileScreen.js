

import React, { useCallback, useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Image, Pressable, ActivityIndicator,
  StatusBar, ScrollView
} from 'react-native';
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WeeklyCalendar from '../../../components/WeeklyCalendar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import useLayoutDimention from '../../../hooks/useLayoutDimention';
import { getStyles } from './ProfileScreenStyle';
import { useAuth } from '../../../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import useLogout from '../../../hooks/useLogout';
import Indicator from '../../../components/Indicator';
import { get_static_badge, update_static_badge } from '../TabsAPI';
import { BASE_URL } from '../../../context/Paths';
import dayjs from 'dayjs';

const ProfileScreen = () => {
  useLogout();
  const route = useRoute();
  const navigation = useNavigation();
  const { updateStore, store } = useAuth();

  const [badge, setBadge] = useState(null);
  const [loading, setLoading] = useState(false);

  const { isSmall, isMedium, isLarge, isFold } = useLayoutDimention();
  const styles = getStyles(isSmall, isMedium, isLarge, isFold);

  useEffect(() => {
    if (route.params?.flag) {
      navigation.navigate("Calendar");
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setTranslucent(true);
      StatusBar.setBackgroundColor("transparent");
      return () => {
        StatusBar.setTranslucent(false);
        StatusBar.setBackgroundColor("#ffffff");
      };
    }, [])
  );

  const handle_get_static_badge = () => {
    setLoading(true);
    update_static_badge((res, success) => {
      if (success) {
        get_static_badge((data, isOk) => {
          setLoading(false);
          console.log("da", data)
          if (isOk) {
            setBadge(data?.data?.latest_badge);
          }
        });
      } else {
        setLoading(false);
      }
    });
  };

  useFocusEffect(
    useCallback(() => {
      handle_get_static_badge();
    }, [])
  );

  let badge_uri = badge?.badge_template?.image || "";
  if (badge_uri) badge_uri = BASE_URL + badge_uri;

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Image
          source={require("../../../../assets/img/profileBackground.png")}
          style={styles.bgImage}
        />
        <View style={styles.profileContainer}>
          <View style={{
            width: 110,
            height: 110,
            borderRadius: 55,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#ffffff',
            overflow: 'hidden',
          }}>
            <Image
              source={
                store?.profileSettingData?.userInfo?.profile_picture
                  ? { uri: store?.profileSettingData?.userInfo?.profile_picture }
                  : require("../../../../assets/img/user1.png")
              }
              style={{
                height: 110,
                width: 110,
                resizeMode: 'cover',
              }}
            />
          </View>
          <Text style={styles.profileText}>
            {store?.profileSettingData?.userInfo?.name || "User"}
          </Text>
        </View>

        <View style={styles.iconContainer}>
          <Pressable onPress={() => navigation.navigate("ProfileNotification")}>
            <Image
              source={require("../../../../assets/img/BellSimple.png")}
              style={styles.icon}
            />
          </Pressable>
          <Pressable onPress={() => navigation.navigate("SettingHome")}>
            <Image
              source={require("../../../../assets/img/settingIcon.png")}
              style={styles.icon}
            />
          </Pressable>
        </View>
      </View>

      {/* Scrollable content */}
      <View style={{ ...styles.semiContainer, marginTop: hp("12%"), flex: 1 }}>
        <WeeklyCalendar />

        <View style={styles.caption}>
          <Image
            source={require("../../../../assets/img/Fire.png")}
            style={{ paddingHorizontal: 10 }}
          />
          <Text style={{ ...styles.semitext, fontSize: 14 }}>
            You're on <Text style={{ color: '#2B4752', fontFamily: 'NunitoBold' }}>
              Day {store?.profile_dashboard?.streak?.longest_streak}
            </Text> of growing your faith confidence!
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 150 }}
        >
          {/* Badge card */}
          <LinearGradient
            colors={['#FFF7E4', '#FFEEC4', '#FEE5A4', '#FDD263']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={{
              width: "100%",
              borderRadius: 15,
              flexDirection: 'row',
              alignItems: 'center',
              padding: 10,
              marginVertical: 16
            }}
          >
            {badge && (
              <Image
                source={{ uri: badge_uri }}
                style={{
                  height: 100,
                  width: 120,
                  resizeMode: "cover"
                }}
              />
            )}

            <View style={{ width: "60%", }}>
              <Text style={{
                color: "#0B172A",
                fontFamily: "NunitoSemiBold",
                fontSize: 15,
                marginBottom: 5,
              }}>{badge?.badge_template?.title}</Text>
              <Text style={{
                color: "#3F5862",
                fontFamily: "NunitoSemiBold",
                fontSize: 12
              }}>{badge?.badge_template?.description}</Text>
            </View>
          </LinearGradient>
          {/* Menu Items */}
          <Pressable onPress={() => navigation.navigate("Calendar")}>
            <View style={{...styles.weeklyCheckIn, paddingVertical:10}}>
              <Text style={styles.menuText}>Calendar</Text>
              <Image
                source={require("../../../../assets/img/CaretRight.png")}
                style={styles.caretRight}
              />
            </View>
          </Pressable>
            <View style={{height:20}}></View>
          <Pressable onPress={() => navigation.navigate("WeeklyCheckIn")}>
            <View style={{...styles.weeklyCheckIn, paddingVertical:10}}>
              <View>
                <Text style={styles.menuText}>Weekly Check-In</Text>
                <View style={styles.tooltip}>
                  <Text style={styles.tooltipText}>Completed</Text>
                  <Image
                    source={require("../../../../assets/img/Check.png")}
                    style={styles.caretRight}
                  />
                </View>
              </View>
              <Image
                source={require("../../../../assets/img/CaretRight.png")}
                style={styles.caretRight}
              />
            </View>
          </Pressable>
              <View style={{height:20}}></View>
          <Pressable onPress={() => navigation.navigate("CurrentGoals")}>
            <View style={{...styles.weeklyCheckIn, paddingVertical:10}}>
              <Text style={styles.menuText}>Your Current Goals</Text>
              <Image
                source={require("../../../../assets/img/CaretRight.png")}
                style={styles.caretRight}
              />
            </View>
          </Pressable>
        </ScrollView>
      </View>

      {/* Loader */}
      {loading && (
        <Indicator onClose={() => setLoading(false)} visible={loading}>
          <ActivityIndicator size={"large"} />
        </Indicator>
      )}
    </View>
  );
};

export default ProfileScreen;
