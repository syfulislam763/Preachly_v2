import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import dayjs from 'dayjs';
import useLayoutDimention from '../hooks/useLayoutDimention';

const WeeklyCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(dayjs().format('YYYY-MM-DD'));
  const {isSmall} = useLayoutDimention()
  // Generate 7 days starting from Sunday of current week
  const startOfWeek = dayjs().startOf('week'); // Sunday
  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const date = startOfWeek.add(i, 'day');
    return {
      key: date.format('YYYY-MM-DD'),
      day: date.format('dd')[0], // First letter of day
      date: date.date(),
    };
  });

  const renderItem = ({ item }) => {
    const isSelected = false//selectedDate === item.key
    const isToday = item.key === dayjs().format('YYYY-MM-DD');

    return (
      <TouchableOpacity
        style={styles.dayContainer}
        onPress={() => {
          //setSelectedDate(item.key)
        }}
      >
        <Text style={[styles.dayText, isSelected && styles.selectedDayText]}>
          {item.day}
        </Text>
        <View
          style={[
            styles.dateCircle,
            isSelected
              ? styles.selectedDateCircle
              : isToday
              ? styles.todayDateCircle
              : styles.defaultDateCircle,
          ]}
        >
          <Text
            style={[
              styles.dateText,
              isSelected
                ? styles.selectedDateText
                : isToday
                ? styles.todayDateText
                : styles.defaultDateText,
            ]}
          >
            {item.date}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.wrapper}>
      <FlatList
        data={weekDays}
        horizontal
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        contentContainerStyle={{ gap: isSmall?4:12 }}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 0,
    backgroundColor: '#fff',
    alignItems:'center'
  },
  dayContainer: {
    alignItems: 'center',
  },
  dayText: {
    color: '#6B8E8E',
    fontFamily:'NunitoSemiBold',
    fontSize: 14,
    marginBottom: 4,
  },
  selectedDayText: {
    color: '#005A55',
    fontFamily:'NunitoSemiBold'
  },
  dateCircle: {
    width: 42,
    height: 42,
    borderRadius: 42/2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedDateCircle: {
    backgroundColor: '#005A55',
    
  },
  todayDateCircle: {
    borderWidth: 2,
    borderColor: '#6B8E8E',
    backgroundColor: '#fff',
  },
  defaultDateCircle: {
    backgroundColor: '#f5f8f7',
  },
  selectedDateText: {
    color: '#fff',
    fontFamily:'NunitoSemiBold'
  },
  todayDateText: {
    color: '#004d40',
    fontFamily:'NunitoSemiBold'
  },
  defaultDateText: {
    color: '#0B172A',
    fontFamily:'NunitoSemiBold'
  },
  dateText:{
    fontFamily:'NunitoSemiBold'
  }
});

export default WeeklyCalendar;
