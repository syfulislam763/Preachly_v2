import React, { useState } from 'react';
import { View, Button, Platform, Text, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const DatePickerButton = ({ initialDate = new Date(), onChangeDate }) => {
  const [date, setDate] = useState(initialDate);
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    setShow(false);
    if (selectedDate) {
      setDate(selectedDate);
      onChangeDate && onChangeDate(selectedDate);
    }
  };

  const showDatepicker = () => {
    setShow(true);
  };

  return (
    <View>
      <TouchableOpacity onPress={showDatepicker} style={{
        padding: 10, backgroundColor: '#eee', borderRadius: 8, marginVertical: 10
      }}>
        <Text>{date.toDateString()}</Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onChange}
        />
      )}
    </View>
  );
};

export default DatePickerButton;
