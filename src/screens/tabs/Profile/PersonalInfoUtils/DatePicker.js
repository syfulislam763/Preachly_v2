import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import DateTimePicker from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import Indicator from '../../../../components/Indicator';
import customParseFormat from "dayjs/plugin/customParseFormat";
import CustomModal from '@/components/CustomModal';

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

  console.log(selectedDate, "dfdf")

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
    <View className="bg-white/90 p-2 rounded-[5px]">
  
      <TouchableOpacity onPress={() => setIsOpen(true)} >
        <Text
          className={`text-base ${
            selectedDate ? 'text-gray-900' : 'text-gray-500'
          }`}
        >
          {selectedDate ? formatDateForDisplay(selectedDate) : 'Select a date'}{" "}
        </Text>
      </TouchableOpacity>


      {isOpen && (
        <CustomModal
          visible={isOpen}
          onClose={() => setIsOpen(false)}
          headerStyle={{paddingHorizontal:20}}
        >
          <View className="bg-white px-5 py-2">
            <DateTimePicker
              mode="single"
              date={selectedDate ?? dayjs()}
              onChange={handleDateSelect}
            />
          </View>
        </CustomModal>
      )}
    </View>
  );
};

export default DatePicker;