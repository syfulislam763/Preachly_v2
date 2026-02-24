import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const CommonButton = ({bgColor, disabled=false, txtColor, btnText, route,opacity, handler=null, navigation}) => {



  return (
    <TouchableOpacity disabled={disabled} style={{...styles.btn, backgroundColor: bgColor, opacity:opacity}} onPress={route===""?handler: () => navigation.navigate(route)  }> 
        <Text style={{...styles.btnText, color: txtColor,}}>{btnText}</Text>
    </TouchableOpacity>
  )
}

export default CommonButton
const styles = StyleSheet.create({
  btn: {
    backgroundColor: '#005A55',
    padding: 16,
    borderRadius: 25,
    alignItems: 'center',
    width: '100%',
    opacity: 1
  },
  btnText: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'NunitoSemiBold',
  }
})
