import React from 'react'
import { View, Text, Image, StyleSheet, Pressable, ImageBackground } from 'react-native';
import useAppStore from '@/context/useAppStore';

const bgImages = {
  golden: require('../../../../assets/updated_img/goal_bg_image.png'),
  dark: require('../../../../assets/img/card_bg11.png'),
}

const book = require("../../../../assets/updated_img/open_book_black.png");
const lightening = require('../../../../assets/img/lightning.png');
const mountain = require("../../../../assets/updated_img/mountain.png")

const goal_label = {
  "conversation": {
    img: lightening,
    tagline: 'Courage grows with every step.',
    comment: "Conversations Started"
  },
  "scripture": {
    img: book,
    tagline: 'Every verse builds wisdom.',
    comment: "Chapters Completed"
  },
  "share_faith": {
    img: mountain,
    tagline: "Seeds grow when they're shared.",
    comment: "Shares Made"
  },
};

const CommonGoalCard = ({
  title = "Faith Confidence",
  tagline = "Every step builds confidence.",
  progress = 3,
  total = 10,
  label = "Conversations Started",
  variant = "golden", // "golden" | "dark"
  onPress = () => {},
}) => {
  

  const dashboard = useAppStore((s) => s.profile.dashboard);
  const goal =  {
    "week_start": "2026-04-25",
    "week_end": "2026-05-01",
    "days_remaining": 6,
    "goal_type": "share_faith",
    "goal_display": "",
    "current_count": 0,
    "target_count": 10,
    "completed": false,
    "progress_percentage": 0,
    "is_new_goal": false,
    "week_number": 17
  }

  const current_goal = {...dashboard?.current_goal, ...goal_label[dashboard?.current_goal?.goal_type]} ?? goal;
  const progressPercent = Math.round((current_goal?.current_count / current_goal?.target_count) * 100);

  return (
    <Pressable onPress={onPress}>
      <ImageBackground
        source={bgImages[variant]}
        style={styles.background}
        resizeMode='stretch'
      >
        {/* Header row — icon + title */}
        <View style={styles.headerRow}>
          <Image
            source={current_goal?.img} // your bolt icon
            style={styles.icon}
          />
          <Text style={styles.title}>{current_goal?.goal_display}</Text>
        </View>

        {/* Main tagline */}
        <Text style={styles.tagline}>{current_goal?.tagline}</Text>

        {/* Progress */}
        <Text style={styles.progressLabel}>
          {current_goal?.current_count} of {current_goal?.target_count} {current_goal?.comment}
        </Text>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
        </View>
      </ImageBackground>
    </Pressable>
  )
}

export default CommonGoalCard;

const styles = StyleSheet.create({
  background: {
    height: 120,
    borderRadius: 15,
    overflow: 'hidden',
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
    marginBottom: 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  icon: {
    height: 23,
    width: 23,
    objectFit: 'contain',
  },
  title: {
    fontFamily: 'NunitoSemiBold',
    fontSize: 17,
    color: '#0b182a',
  },
  tagline: {
    fontFamily: 'NunitoBold',
    fontSize: 17,
    color: '#0b182a',
    marginBottom: 6,
  },
  progressLabel: {
    fontFamily: 'NunitoSemiBold',
    fontSize: 15,
    color: '#76562e',
    marginBottom: 10,
  },
  progressTrack: {
    height: 4,
    backgroundColor: '#a98048',
    borderRadius: 99,
    width: '50%',
  },
  progressFill: {
    height: 4,
    backgroundColor: '#76562e',
    borderRadius: 99,
  },
})