import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import Indicator from '../../../../components/Indicator';
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const DatePicker = ({
  label = 'Date',
  value,
  onChange,
  isOpen,
  setIsOpen,
  placeholder = 'Select a date',
}) => {

  const selectedDate = value ? dayjs(value, "YYYY-MM-DD", true) : null;

  const formatDateForDisplay = (date) => {

    const temp = date ? dayjs(date).format('YYYY-MM-DD') : null;
    return temp;
  }

  const handleDateSelect = (params) => {
    const picked = dayjs(params.date);

    onChange?.(picked);
    setIsOpen(false);
  };

  return (
    <View style={{backgroundColor:'white'}}>
  
      <TouchableOpacity onPress={() => setIsOpen(true)} >
        <Text
          className={`text-base flex-1 ${
            selectedDate ? 'text-gray-900' : 'text-gray-400'
          }`}
        >
          {selectedDate ? formatDateForDisplay(selectedDate) : placeholder}
        </Text>
      </TouchableOpacity>


      {isOpen && (
        <Indicator
          visible={isOpen}
          onClose={() => setIsOpen(false)}
        >
          <View style={{backgroundColor:'white'}}>
            <DateTimePicker
              mode="single"
              date={selectedDate ?? dayjs()}
              onChange={handleDateSelect}
            />
          </View>
        </Indicator>
      )}
    </View>
  );
};

export default DatePicker;