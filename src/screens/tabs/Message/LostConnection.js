import React from 'react'
import { View, StatusBar, StyleSheet, Image, Text } from 'react-native'
import { deepGreen, primaryText } from '../../../components/Constant'
import { useNavigation } from '@react-navigation/native'
import CommonButton from '../../../components/CommonButton'

const LostConnection = () => {
  const {navigation} =  useNavigation()


  return (
    <View style={styles.container}>
        <Image
            source={require("../../../../assets/img/lost_connection.png")}
            style={{
                height: 230,
                width: 230,
                objectFit:'contain',
                marginVertical:20
            }}
        />

        <View style={{marginBottom:30}}>
            <Text style={styles.title}>
                Lost connection,
            </Text>
            <Text style={styles.title}>but not faith</Text>
        </View>
        <View style={{marginBottom:50}}>
            <Text style={styles.subTitle}>Check your Wi-Fi or data,</Text>
            <Text style={styles.subTitle}>then try again</Text>
        </View>

        <CommonButton
            btnText={"Refresh"}
            bgColor={deepGreen}
            navigation={navigation}
            route={""}
            txtColor={primaryText}
            bold='bold'
            handler={() => {}}
            opacity={1}
        />
    </View>
  )
}

export default LostConnection


const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'#fff',
        padding: 20,
        alignItems:'center'
    },
    title: {
        fontFamily:'DMSerifDisplay',
        fontSize: 30,
        color: "#0B172A",
        textAlign:'center',
    },
    subTitle: {
        color:'#607373',
        fontFamily:'NunitoSemiBold',
        fontSize: 16,
        textAlign:'center'
    }
})