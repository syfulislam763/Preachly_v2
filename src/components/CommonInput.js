import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const RoundedInput = ({
  placeholder,
  value,
  onChangeText,
  type = 'text', 
  style,
  placeholderColor = ''
}) => {
  const inputConfig = {
    keyboardType: {
      text: 'default',
      password: 'default',
      number: 'numeric',
      email: 'email-address',
      phone: 'phone-pad',
    }[type],
    secureTextEntry: type === 'password',
    autoCapitalize: type === 'email' ? 'none' : 'sentences',
    autoCorrect: type !== 'password',
  };

  return (
    <TextInput
      style={{...styles.input, ...style}}
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      placeholderTextColor={placeholderColor}
      {...inputConfig}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 17,
    paddingHorizontal: 20,
    fontSize: 16,
    backgroundColor: '#fff',
    marginVertical: 8,
    width: '100%',
    color:'#000'
  },
});

export default RoundedInput;