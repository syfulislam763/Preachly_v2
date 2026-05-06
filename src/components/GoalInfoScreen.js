import React from 'react';
import { View, Text, Image, ScrollView, StyleSheet } from 'react-native';

const checkIcon = require('../../assets/updated_img/done2.png');

/* 
 h
 dfd
 jfdsjepu
*/
const GoalInfoScreen = ({
  title = "",
  subtitle = "",
  quote = "",
  checkItems = [],                                                                                                                                                                                                                                                                                                                                             
  badgeUrl = "",
}) => {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={styles.scrollContent}
    >
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
      <Text style={styles.quote}>{quote}</Text>

      <View style={styles.checkList}>
        {checkItems.map((item, idx) => (
          <View key={idx} style={styles.checkRow}>
            <Image
              source={checkIcon}
              style={styles.checkIcon}
              resizeMode="contain"
            />
            <Text style={styles.checkText}>{item}</Text>
          </View>
        ))}
      </View>

      {badgeUrl ? (
        <View style={styles.badgeContainer}>
          <Image
            source={badgeUrl}
            style={styles.badge}
            resizeMode="contain"
          />
        </View>
      ) : null}
    </ScrollView>
  );
};

export default GoalInfoScreen;

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 20,
  },
  title: {
    fontFamily: 'DMSerifDisplay',
    fontSize: 30,
    color: '#0B172A',
    textAlign: 'center',
    lineHeight: 35,
    paddingTop: 24,
    paddingBottom: 12,
    paddingLeft: 15,
    paddingRight:15
  },
  subtitle: {
    fontFamily: 'Nunito',
    fontSize: 15,
    color: '#2B4752',
    textAlign: 'center',
    marginBottom: 15,
  },
  quote: {
    fontFamily: 'Nunito',
    fontSize: 15,
    color: '#2B4752',
    textAlign: 'center',
    marginBottom: 35,
    paddingHorizontal: 8,
  },
  checkList: {
    gap: 20,
    marginBottom: 32,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 14,
  },
  checkIcon: {
    width: 22,
    height: 22,
    marginTop: 2,
    tintColor: '#C9A84C',
  },
  checkText: {
    fontFamily: 'NunitoSemiBold',
    fontSize: 15,
    color: '#0B172A',
    flex: 1,
    lineHeight: 22,
  },
  badgeContainer: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  badge: {
    width: 200,
    height: 200,
  },
});