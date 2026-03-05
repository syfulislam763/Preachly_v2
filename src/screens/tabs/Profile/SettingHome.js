import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, Pressable, Image, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { logoutUser } from '../../../context/api';
import useAppStore from '@/context/useAppStore';
import ReusableNavigation from '../../../components/ReusabeNavigation';
import BackButton from '../../../components/BackButton';

const SettingHome = () => {
  const logout = useAppStore((s) => s.logout);
  const navigation = useNavigation();
  const [isOpenModal, setOpenModal] = useState(false);

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-white">

      <ReusableNavigation
        backgroundStyle={{ backgroundColor: '#fff' }}
        leftComponent={() => <BackButton navigation={navigation} />}
        middleComponent={() => (
          <Text
            style={{ fontFamily: 'NunitoSemiBold', color: '#0B172A', fontSize: 18 }}
            className="mr-10"
          >
            Settings
          </Text>
        )}
        RightComponent={() => <Text />}
      />

      <View className="flex-1 bg-white p-5">

        <Pressable onPress={() => navigation.navigate("PersonalInfo")}>
          <View style={styles.settingMenu}>
            <Text style={styles.menuText}>Personal info</Text>
            <Image source={require("../../../../assets/img/CaretRight.png")} style={styles.caretRight} />
          </View>
        </Pressable>

        <View className="h-4" />

        <Pressable onPress={() => navigation.navigate("ProfileSubscription")}>
          <View style={styles.settingMenu}>
            <Text style={styles.menuText}>Subscription</Text>
            <Image source={require("../../../../assets/img/CaretRight.png")} style={styles.caretRight} />
          </View>
        </Pressable>

        <View className="h-4" />

        <Pressable onPress={() => navigation.navigate("AboutApp")}>
          <View style={styles.settingMenu}>
            <Text style={styles.menuText}>About app</Text>
            <Image source={require("../../../../assets/img/CaretRight.png")} style={styles.caretRight} />
          </View>
        </Pressable>

        <View className="h-5" />

        <Pressable
          onPress={() => setOpenModal(true)}
          className="flex-row items-center justify-start"
        >
          <Image
            source={require("../../../../assets/img/SignOut.png")}
            style={{ height: 30, width: 30, objectFit: 'contain' }}
          />
          <Text style={{
            color: '#D85B4B',
            fontFamily: 'NunitoBold',
            fontSize: 16,
            marginLeft: 15,
            borderBottomWidth: 0.6,
            borderBottomColor: '#D85B4B',
          }}>
            Log out
          </Text>
        </Pressable>

      </View>

      <LogoutModal
        isVisible={isOpenModal}
        onClose={() => setOpenModal(false)}
        logout={logout}
        navigation={navigation}
      />

    </SafeAreaView>
  );
};

export default SettingHome;

const LogoutModal = ({ isVisible, onClose, logout, navigation }) => (
  <Modal
    visible={isVisible}
    transparent
    animationType="slide"
    onRequestClose={onClose}
    statusBarTranslucent={true}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContainer}>

        <Text style={{
          color: '#0B172A',
          fontFamily: 'DMSerifDisplay',
          fontSize: 30,
          textAlign: 'center',
          paddingVertical: 20,
        }}>
          Log out of the account?
        </Text>

        <View className="flex-row justify-between items-center">

          <TouchableOpacity style={styles.selectBtn} onPress={onClose}>
            <Text style={styles.selectBtnText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{ ...styles.selectBtn, backgroundColor: '#EDF3F3' }}
            onPress={() => logoutUser(() => logout())}
          >
            <Text style={{ ...styles.selectBtnText, color: '#000' }}>Logout</Text>
          </TouchableOpacity>

        </View>

      </View>
    </View>
  </Modal>
);

const styles = StyleSheet.create({
  menuText: {
    fontFamily: 'NunitoSemiBold',
    color: '#0B172A',
    fontSize: 18,
  },
  settingMenu: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F3F8F8',
    padding: 15,
    borderRadius: 20,
  },
  caretRight: {
    width: 20,
    height: 20,
    objectFit: 'contain',
  },
  selectBtn: {
    backgroundColor: '#005A55',
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 12,
    width: '48%',
  },
  selectBtnText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'NunitoSemiBold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000055',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '50%',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
});