import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';

const ReusableNavigation = ({ backgroundStyle={}, leftComponent, RightComponent, middleComponent }) => {
  const navigation = useNavigation();

  return (
    <View style={{...styles.headerContainer,...backgroundStyle}}>

        {leftComponent()}
        {middleComponent()}
        {RightComponent()}

    </View>
  );
};

export default ReusableNavigation;

const styles = StyleSheet.create({
  headerContainer: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    // borderBottomWidth: 0.5,
    // borderColor: '#E2E2E2',
    backgroundColor: '#ffebc2',
  },
  backButton: {
    width: 40,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'NunitoSemiBold',
    color: '#0b172A',
  },
  placeholder: {
    width: 40, 
  },
});
