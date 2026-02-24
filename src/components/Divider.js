import React from 'react'
import { View, Text } from 'react-native'

const Divider = ({text}) => {
  return (
    <View style={{
        display:'flex',
        flexDirection:"row",
        alignItems:'center',
        justifyContent:'space-around',
        marginTop: 0,
        fontFamily: 'NunitoSemiBold'
    }}>
        <View style={{height:2, backgroundColor:'#90B2B2', width:'47%'}}></View>
        <Text style={{paddingRight:4, paddingLeft:4, fontSize: 16}}>{text}</Text>
        <View style={{height:2, backgroundColor:'#90B2B2', width:'47%'}}></View>
    </View>
  )
}

export default Divider
