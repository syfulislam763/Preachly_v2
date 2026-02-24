import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import CommonButton from '../../../components/CommonButton'

const HistoryNotFound = ({title, text, navigation}) => {
  return (
    <View style={styles.container}>

        <Text style={styles.title}>{title}</Text>

        <Text style={styles.text}>{text}</Text>

        <CommonButton
            btnText={"Ask Preachly"}
            bgColor={"#005A55"}
            navigation={navigation}
            route={""}
            txtColor={"#fff"}
            opacity={1}
        />
    </View>
  )
}

export default HistoryNotFound


const styles = StyleSheet.create({
    container:{
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        paddingVertical: 100
    },
    title:{
        fontFamily: 'DMSerifDisplay',
        fontSize: 32,
        color:'#0B172A',
        paddingBottom: 30
    },
    text:{
        fontFamily:'NunitoSemiBold',
        fontSize:17,
        color:'#2B4752',
        paddingHorizontal: 20,
        textAlign:'center',
        paddingBottom: 70
    }
})
