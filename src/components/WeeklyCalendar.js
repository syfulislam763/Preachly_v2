import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import dayjs from 'dayjs';
import { isSameDay } from 'date-fns';
import useLayoutDimention from '../hooks/useLayoutDimention';

const WeeklyCalendar = ({ markedDates = [] }) => {
  const { isSmall } = useLayoutDimention();

  const startOfWeek = dayjs().startOf('week');
  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const date = startOfWeek.add(i, 'day');
    return {
      key: date.format('YYYY-MM-DD'),
      day: date.format('dd')[0],
      date: date.date(),
      dateObj: date.toDate(),
    };
  });

  const renderItem = ({ item }) => {
    const isToday = item.key === dayjs().format('YYYY-MM-DD');

    const marked = markedDates?.filter(opt => isSameDay(opt.date, item.dateObj));
    const goal_completed = marked.some(m => m.type === 'goal_completion');
    const weekly_checkin_completion = marked.some(m => m.type === 'weekly_checkin_completion');

    // ── All both events ──────────────────────────────────
    if (weekly_checkin_completion && goal_completed) {
      console.log("both")
      return (
        <TouchableOpacity style={styles.dayContainer} onPress={() => {}}>
          <Text style={styles.dayText}>{item.day}</Text>
          {/* gold outer ring */}
          <View style={[styles.dateCircle, styles.goldOuterCircle, { position: 'relative' }]}>
            {/* green dot above */}
            <View style={styles.dotAbove} />
            {/* inner grey circle */}
            <View style={[styles.dateCircle, styles.markedDateCircle]}>
              <Text style={[styles.dateText, isToday ? styles.todayDateText : styles.markedDateText]}>
                {item.date}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }

    // ── Goal completion only ─────────────────────────────
    if (goal_completed) {
      console.log("goal")
      return (
        <TouchableOpacity style={styles.dayContainer} onPress={() => {}}>
          <Text style={styles.dayText}>{item.day}</Text>
          <View style={[styles.dateCircle, styles.markedDateCircle, { position: 'relative' }]}>
            <View style={styles.dotAbove} />
            <Text style={[styles.dateText, isToday ? styles.todayDateText : styles.markedDateText]}>
              {item.date}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }

    // ── Weekly check-in only ─────────────────────────────
    if (weekly_checkin_completion) {
      console.log("weekly")
      return (
        <TouchableOpacity style={styles.dayContainer} onPress={() => {}}>
          <Text style={styles.dayText}>{item.day}</Text>
          <View style={[styles.dateCircle, styles.goldOuterCircle]}>
            <View style={[styles.dateCircle, styles.markedDateCircle]}>
              <Text style={[styles.dateText, isToday ? styles.todayDateText : styles.markedDateText]}>
                {item.date}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    }

    // ── No events — today or default ─────────────────────
    return (
      <TouchableOpacity style={styles.dayContainer} onPress={() => {}}>
        <Text style={styles.dayText}>{item.day}</Text>
        <View style={[styles.dateCircle, isToday ? styles.todayDateCircle : styles.defaultDateCircle]}>
          <Text style={[styles.dateText, isToday ? styles.todayDateText : styles.defaultDateText]}>
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
        contentContainerStyle={{ gap: isSmall ? 4 : 12 }}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 0,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  dayContainer: {
    alignItems: 'center',
  },
  dayText: {
    color: '#6B8E8E',
    fontFamily: 'NunitoSemiBold',
    fontSize: 14,
    marginBottom: 4,
  },
  dateCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── No event states ──────────────────────────────────
  todayDateCircle: {
    borderWidth: 2,
    borderColor: '#6B8E8E',
    backgroundColor: '#fff',
  },
  defaultDateCircle: {
    backgroundColor: '#f5f8f7',
  },
  todayDateText: {
    color: '#004d40',
    fontFamily: 'NunitoSemiBold',
  },
  defaultDateText: {
    color: '#0B172A',
    fontFamily: 'NunitoSemiBold',
  },
  dateText: {
    fontFamily: 'NunitoSemiBold',
  },

  // ── Event states ─────────────────────────────────────
  markedDateCircle: {
    backgroundColor: '#f7f8fa',
    borderWidth: 1,
    borderColor: '#8eb6b4',
  },
  markedDateText: {
    color: '#8eb6b4',
    fontFamily: 'NunitoSemiBold',
  },
  goldOuterCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#FDD263',
    borderWidth: 1,
    borderColor: '#FDD263',
  },
  dotAbove: {
    height: 5,
    width: 5,
    backgroundColor: '#004d40',
    borderRadius: 2.5,
    position: 'absolute',
    top: -8,
  },
});

export default WeeklyCalendar;