import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
} from 'react-native';

const OTPInput = ({
  length = 6,
  onChange,
  onComplete,
  autoFocus = true,
  editable = true,
  boxSize = 48,
  boxSpacing = 8,
  secureTextEntry = false,
  keyboardType = 'number-pad',
  error = false,
  focusColor = '#007AFF',
  errorColor = '#FF3B30',
  defaultColor = '#ACC6C5',
  textColor = '#000000',
  fontSize = 24,
}) => {
  const [values, setValues] = useState(Array(length).fill(''));
  const [focusedIndex, setFocusedIndex] = useState(autoFocus ? 0 : -1);
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus && editable) {
      inputRef.current?.focus();
    }
  }, [autoFocus, editable]);

  useEffect(() => {
    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      setFocusedIndex(-1);
    });
    return () => hideSub.remove();
  }, []);

  const clearAll = () => {
    const cleared = Array(length).fill('');
    setValues(cleared);
    setFocusedIndex(0);
    onChange?.('');
    inputRef.current?.clear(); // Force clear native input value
  };

  const handleChangeText = (text) => {
    if (!/^\d*$/.test(text)) return;

    if (text.length === 0) {
      return;
    }

    const digits = text.slice(0, length).split('');
    const padded = [...digits, ...Array(length - digits.length).fill('')];
    setValues(padded);
    onChange?.(padded.join(''));

    if (digits.length === length) {
      onComplete?.(digits.join(''));
    }

    setFocusedIndex(Math.min(digits.length, length - 1));
  };

  const handleKeyPress = ({ nativeEvent: { key } }) => {
    if (key === 'Backspace') {
      const allEmpty = values.every(v => v === '');
      if (!allEmpty) {
        clearAll();
      }
    }
  };

  const handleBoxPress = (index) => {
    if (!editable) return;
    inputRef.current?.focus();
    setFocusedIndex(index);
  };

  const renderBox = (digit, index) => {
    const isFocused = focusedIndex === index && editable;
    const hasValue = digit !== '';
    const isError = error;

    return (
      <TouchableOpacity
        key={index}
        activeOpacity={1}
        onPress={() => handleBoxPress(index)}
        style={[
          styles.box,
          {
            width: boxSize,
            height: boxSize,
            borderBottomColor: editable?"#005A55":"",
            marginRight: index < length - 1 ? boxSpacing : 0,
            borderColor: isError
              ? errorColor
              : hasValue
              ? focusColor
              : isFocused
              ? focusColor
              : defaultColor,
            backgroundColor: editable ? '#FFFFFF' : '#F5F5F5',
          },
        ]}
      >
        <Text
          style={[
            styles.digit,
            {
              color: textColor,
              fontSize: fontSize,
            },
          ]}
        >
          {secureTextEntry && hasValue ? '•' : digit}
        </Text>
        {isFocused && !hasValue && (
          <View
            style={[
              styles.cursor,
              { backgroundColor: focusColor },
            ]}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        Keyboard.dismiss();
        setFocusedIndex(-1);
      }}
    >
      <View style={styles.wrapper}>
        <View style={styles.container}>
          <TextInput
            ref={inputRef}
            style={styles.hiddenInput}
            value={values.join('')}
            onChangeText={handleChangeText}
            onKeyPress={handleKeyPress}
            keyboardType={keyboardType}
            maxLength={length}
            autoFocus={autoFocus}
            editable={editable}
            contextMenuHidden={true}
            selectTextOnFocus={false}
            caretHidden={true}
          />
          {values.map((digit, index) => renderBox(digit, index))}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    flexDirection: 'row',
    position: 'relative',
  },
  hiddenInput: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0,
  },
  box: {
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderRadius: 8,
  },
  digit: {
    textAlign: 'center',
  },
  cursor: {
    position: 'absolute',
    bottom: 8,
    width: 2,
    height: 24,
  },
});

export default OTPInput;
