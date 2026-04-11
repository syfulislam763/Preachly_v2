import React from 'react'
import { View, Text, Image, StyleSheet, Pressable, ImageBackground } from 'react-native'

const bgImages = {
  golden: require('../../../../assets/updated_img/goal_bg_image.png'),
  dark: require('../../../../assets/img/card_bg11.png'),
}

const CommonGoalCard = ({
  title = "Faith Confidence",
  tagline = "Every step builds confidence.",
  progress = 3,
  total = 10,
  label = "Conversations Started",
  variant = "golden", // "golden" | "dark"
  onPress = () => {},
}) => {
  const progressPercent = Math.round((progress / total) * 100)

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
            source={require('../../../../assets/img/lightning.png')} // your bolt icon
            style={styles.icon}
          />
          <Text style={styles.title}>{title}</Text>
        </View>

        {/* Main tagline */}
        <Text style={styles.tagline}>{tagline}</Text>

        {/* Progress */}
        <Text style={styles.progressLabel}>
          {progress} of {total} {label}
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