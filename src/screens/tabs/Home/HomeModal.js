import React from "react";
import { View, Text, Image, StyleSheet} from "react-native";
import CustomModal from "../../../components/CustomModal";
import CommonButton from "../../../components/CommonButton";
import { deepGreen, primaryText } from "../../../components/Constant";
import { useNavigation } from "@react-navigation/native";


const HomeModal = ({modalVisible, setModalVisible, current_streak}) => {
    const navigation = useNavigation()

    return modalVisible && <CustomModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          headerStyle={{paddingHorizontal:20}}
        >
          <View style={{
            alignItems:'center',
            paddingVertical: 0,
            paddingHorizontal:20
          }}>
            <View style={{marginBottom:20}}>
              <Text style={styles.title}>Your streak</Text>
              <Text style={styles.title}>is heating up!</Text>
            </View>

            <View>
              <Text style={styles.text}>You've checked in for <Text style={{fontFamily:'NunitoExtraBold'}}>{ current_streak || "1"} days</Text> straight! </  Text> 
              <Text style={styles.text}>Keep the momentum going -- stay consistent, stay inspired, and unlock new titiles along the way.</Text>
            </View>

            <Image 
              source={require("../../../../assets/img/imgModal.png")}
              style={{
                height:200,
                width:200,
                objectFit:'contain',
              }}
            />
            <View style={{height:20}}></View>
            <CommonButton
              btnText={"Homepage"}
              bgColor={deepGreen}
              navigation={navigation}
              route={""}
              txtColor={primaryText}
              bold='bold'
              opacity={1}
            />
            <View style={{height:20}}></View>
            <Text style={styles.footerText}>Back</Text>
            
          </View>
        </CustomModal>
}


export default HomeModal;


const styles =  StyleSheet.create({
  title:{
    fontFamily:'DMSerifDisplay',
    fontSize:32,
    textAlign:'center',
    color:'#0B172A'
  },
  text:{
    fontFamily:'NunitoSemiBold',
    fontSize: 16,
    color:'#2B4752',
    textAlign:'center',
    paddingHorizontal: 20
  },
  footerText:{
    color: '#90B2B2',
    fontFamily:'NunitoBold',
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#90B2B2'
  },
 
  dayText:{ 
    fontFamily:'NunitoSemiBold', 
    fontSize:18 
  },
 
  weeklyCheckInImage:{
    height: 170,
    width:"100%",
    objectFit:'contain',
  }
})