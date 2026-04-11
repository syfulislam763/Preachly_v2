import React from 'react'
import {
  View, Text, Image, StyleSheet, Pressable,
  Modal, TouchableWithoutFeedback, Dimensions
} from 'react-native'

const { width } = Dimensions.get('window')
const bgShadow = require('../../assets/updated_img/bg-shadow.png')

const SeedPlantedModal = ({
  visible = false,
  onClose = () => {},
  title = "Seed Planted",
  message1 = "You showed up.\nThat's where growth begins.",
  message2 = "Keep planting what matters.",
  badgeUrl = "https://api.preachly.app/media/checkin/badges/MicrosoftTeams-image_2.png",
  buttonText = "Continue Growing",
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.card}>

              {/* Title at the top */}
              <Text style={styles.title}>{title}</Text>

              {/* bg shadow fills width, badge centered on top */}
              <View style={styles.imageContainer}>
                <Image
                  source={bgShadow}
                  style={styles.bgShadow}
                  resizeMode="contain"
                />
                <Image
                  source={{ uri: badgeUrl }}
                  style={styles.badge}
                  resizeMode="contain"
                />
              </View>

              {/* Text + button */}
              <View style={styles.content}>
                <Text style={styles.message}>{message1}</Text>
                <Text style={styles.message}>{message2}</Text>
                <Pressable style={styles.button} onPress={onClose}>
                  <Text style={styles.buttonText}>{buttonText}</Text>
                </Pressable>
              </View>

            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  )
}

export default SeedPlantedModal

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    width: width - 48,
    overflow: 'hidden',
    paddingTop: 28,
  },
  title: {
    fontFamily: 'NunitoBold',
    fontSize: 24,
    color: '#0b182a',
    textAlign: 'center',
    marginBottom: 8,
    paddingHorizontal: 28,
  },
  imageContainer: {
    width: '100%',
    height: 280,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgShadow: {
    position: 'absolute',
    width: '100%',   // fills card width like your UI
    height: '100%',
  },
  badge: {
    width: 200,
    height: 200,
    zIndex: 2,
  },
  content: {
    paddingHorizontal: 28,
    paddingTop: 16,
    paddingBottom: 28,
    alignItems: 'center',
  },
  message: {
    fontFamily: 'NunitoRegular',
    fontSize: 15,
    color: '#4a5568',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#0f5e4e',
    borderRadius: 50,
    width: '100%',
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    fontFamily: 'NunitoSemiBold',
    fontSize: 16,
    color: '#ffffff',
  },
})