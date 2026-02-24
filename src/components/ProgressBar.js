import React from 'react';
import { View, StyleSheet } from 'react-native';

const ProgressBar = ({ progress, container={}, filled={} }) => {
  return (
    <View style={{...styles.container, ...container}}>
      <View style={[styles.filled, { width: `${progress}%` }, filled]} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 8,
    width: '100%',
    backgroundColor: '#EDF3F3', 
    borderRadius: 10,
    overflow: 'hidden',
  },
  filled: {
    height: '100%',
    backgroundColor: '#005F59', 
    borderRadius: 10,
  },
});

export default ProgressBar;
