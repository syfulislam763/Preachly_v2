import React from 'react'
import { View, Text, Image, StyleSheet, Pressable} from 'react-native'

const IconContainer = ({containerStyle = {}, onPress, children}) => {
  return (
    <Pressable onPress={()=> onPress()} style={{...styles.container, ...containerStyle}}>
        {children}
    </Pressable>
  )
}

export default IconContainer


const styles = StyleSheet.create({
    container:{
        backgroundColor:'#EDF3F3',
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
       justifyContent:'center',
        padding: 6,
        width:100,
        borderRadius: 50
    },
    text:{
        color:'#0B172A',
        fontFamily:'NunitoSemiBold',
        fontSize:14,
        marginLeft: 5
    },
    icon:{
        height:24,
        width:24,
        objectFit:'contain'
    }
})
