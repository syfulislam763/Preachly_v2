import React from 'react'
import {
  View, Text, Image, StyleSheet, Pressable,
  Modal, TouchableWithoutFeedback, Dimensions
} from 'react-native'

const { width, height } = Dimensions.get('window')
const bgShadow = require('../../assets/updated_img/bg-shadow.png');
const seed_planted = require("../../assets/updated_img/seed_planted.png")

const SeedPlantedModal = ({
  visible = false,
  onClose = () => {},
  title = "Seed Planted",
  message1 = "You showed up.\nThat's where growth begins.",
  message2 = "",
  badgeUrl = "",
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
              
              <View>
                <Text style={styles.title}>{title}</Text>

                {/* bg shadow fills width, badge centered on top */}
                <View style={styles.imageContainer}>
                  <Image
                    source={bgShadow}
                    style={styles.bgShadow}
                    resizeMode="contain"
                  />
                  <Image
                    source={badgeUrl?{ uri: badgeUrl }: seed_planted}
                    style={styles.badge}
                    resizeMode="contain"
                  />
                </View>

                <View className='absolute -bottom-36 left-0 w-full min-h-44 text-wrap px-16'>  
                  <Text style={styles.message}>{message1}</Text>
                  <Text style={styles.message}>{message2}</Text>
                </View>
              </View>

              {/* Text + button */}
              <View style={styles.content}>
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
    minHeight: height-290,
    overflow: 'hidden',
    paddingTop: 28,
    position:'relative',
    justifyContent:'space-between'
  },
  title: {
    fontFamily: 'DMSerifDisplay',
    fontSize: 24,
    color: '#0b182a',
    textAlign: 'center',
    position: 'absolute',
    left: (width - (48+144))/2,
    top: 0,
  },
  imageContainer: {
    width: '100%',
    height: 360,
    alignItems: 'center',
    justifyContent: 'center',
    position:'relative',
    // backgroundColor:'red'
  },
  bgShadow: {
    position: 'absolute',
    width: '100%',   // fills card width like your UI
    height: '100%',
    objectFit:'contain',
    zIndex: 5,
    // backgroundColor: 'green'
  },
  badge: {
    width: 240,
    height: 240,
    bottom: 15,
    zIndex: 10,
  },
  content: {
    paddingHorizontal: 28,
    paddingTop: 0,
    paddingBottom: 28,
    alignItems: 'center',
    
  },
  message: {
    fontFamily: 'NunitoRegular',
    fontSize: 15,
    color: '#4a5568',
    textAlign: 'center',
    lineHeight: 22,
    flexWrap: 'wrap',
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