import { useNavigation } from '@react-navigation/native'
import React, { useLayoutEffect, useState } from 'react'
import { View, Text, StyleSheet, Pressable, Image, Modal, TouchableOpacity} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { logoutUser } from '../../../context/api'
import { useAuth } from '../../../context/AuthContext'
import { CommonActions } from '@react-navigation/native'

const SettingHome = () => {

    const { logout } = useAuth()

    const navigation = useNavigation()

    const [isOpenModal, setOpenModal] = useState(false)
    
  return (
    <View style={{flex:1, backgroundColor:'#fff', padding:20}}>
        
        <Pressable 
            onPress={() => navigation.navigate("PersonalInfo")}
        >
            <View style={styles.settingMenu}>
            <Text style={styles.menuText}>Personal info</Text>
            <Image
                source={require("../../../../assets/img/CaretRight.png")}
                style={styles.caretRight}
            />
            </View>
        </Pressable>
        <View style={{height:15}}/>
        <Pressable 
            onPress={() => navigation.navigate("ProfileSubscription")}
        >
            <View style={styles.settingMenu}>
            <Text style={styles.menuText}>Subscription</Text>
            <Image
                source={require("../../../../assets/img/CaretRight.png")}
                style={styles.caretRight}
            />
            </View>
        </Pressable>
        <View style={{height:15}}/>
        <Pressable 
            onPress={() => navigation.navigate("AboutApp")}
        >
            <View style={styles.settingMenu}>
            <Text style={styles.menuText}>About app</Text>
            <Image
                source={require("../../../../assets/img/CaretRight.png")}
                style={styles.caretRight}
            />
            </View>
        </Pressable>
        <View style={{height:20}}/>

        <Pressable 
            onPress={() => {}}
        >
            <Pressable onPress={()=>setOpenModal(true)} style={{
                display:'flex',
                flexDirection:'row',
                alignItems:'center',
                justifyContent:'flex-start'
            }}>
            
                <Image
                    source={require("../../../../assets/img/SignOut.png")}
                    style={{
                        height: 30,
                        width: 30,
                        objectFit:'contain'
                    }}
                />
                <Text style={{
                    color:'#D85B4B',
                    fontFamily:'NunitoBold',
                    fontSize:16,
                    marginLeft: 15,
                    // textDecorationColor:'#D85B4B',
                    // textDecorationLine: 'underline',
                    
                    borderBottomWidth: .6,
                    borderBottomColor: '#D85B4B'
                }}>Log out</Text>
            </Pressable>
        </Pressable>
        
        <LogoutModal
            isVisible={isOpenModal}
            onClose={() => setOpenModal(false)}
            logout={logout}
            navigation={navigation}
        />

    </View>
  )
}

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
        
        
        <Text
            style={{
                color:'#0B172A',
                fontFamily:'DMSerifDisplay',
                fontSize:30,
                textAlign:'center',
                paddingVertical: 20
            }}
        >
            Log out of the account?
        </Text>

        <View 

            style={{
                display:'flex',
                flexDirection:'row',
                justifyContent:'space-between',
                alignItems:'center'
            }}
        
        >

            
          <TouchableOpacity
            style={styles.selectBtn}
            onPress={onClose}
          >
            <Text style={styles.selectBtnText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{...styles.selectBtn, backgroundColor:'#EDF3F3'}}
            onPress={() => {
              logoutUser(() => {
                logout();
              });
            }}
          >
            <Text style={{...styles.selectBtnText, color:'#000'}}>Logout</Text>
          </TouchableOpacity>



        </View>



      </View>
    </View>
  </Modal>
);


const styles = StyleSheet.create({
  menuText:{
    fontFamily:'NunitoSemiBold',
    color:'#0B172A',
    fontSize: 18
  },
  settingMenu:{
    display: 'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    backgroundColor:'#F3F8F8',
    padding: 15,
    borderRadius: 20
  },
  caretRight:{
    width:20,
    height:20,
    objectFit:"contain"
  },
    selectBtn: {
    backgroundColor: '#005A55',
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 12,
    width: '48%'
  },
  selectBtnText: {
    color: '#fff',
    fontSize: 16,
    fontFamily:'NunitoSemiBold'
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
