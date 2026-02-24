import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, StyleSheet } from 'react-native';


const BackButton = ({navigation, cb}) => {
  return (
    <TouchableOpacity
        onPress={cb?()=>cb():() => navigation.goBack()}
        style={styles.backButtonContainer}
        >
        <Ionicons name="arrow-back" size={20} color="#0b172A" />
    </TouchableOpacity>
  )
}

export default BackButton;


const styles = StyleSheet.create({
  backButtonContainer: {
    backgroundColor: '#EDF3F3',
    height:40,
    width:40,
    padding: 8,
    marginLeft: 5,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
})