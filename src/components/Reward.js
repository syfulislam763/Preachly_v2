import React from 'react'

import {View, StyleSheet,Text, TouchableOpacity, Image} from 'react-native'

const Reward = ({count=0, handler}) => {
  return (
    <TouchableOpacity 
     onPress={() => {
        if(handler){
            return handler()
        }else{
            return null
        }
     }}
    style={styles.countButton}>
        <Image
            source={require('../../assets/img/Fire.png')} 
            style={{
                height:18,
                width:18,
                objectFit:'contain'
            }}
        />
        <Text style={styles.countText}>{count}</Text>
    </TouchableOpacity>
  )
}

export default Reward;



const styles = StyleSheet.create({
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
})
