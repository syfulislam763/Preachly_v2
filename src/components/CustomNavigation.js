import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';

const CustomHeader = ({ title = 'Subscription', backgroundStyle={}, titleStyle={}, iconSize=24, iconColor="#1C1C1E", iconName="arrow-back-outline" }) => {
  const navigation = useNavigation();

  return (
    <View style={{...styles.headerContainer,...backgroundStyle}}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Ionicons name={iconName} size={iconSize} color={iconColor} />
      </TouchableOpacity>
      <Text style={{...styles.title, ...titleStyle}}>{title}</Text>
      <View style={styles.placeholder} />
    </View>
  );
};

export default CustomHeader;

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
