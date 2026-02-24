
import { Dimensions, Image, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useRef, useState } from 'react';
import { useSharedValue, useAnimatedReaction, runOnJS } from 'react-native-reanimated';
import Carousel from 'react-native-reanimated-carousel';
import { deepGreen, lighgreen } from './Constant';

const window = Dimensions.get('window');

const imageData = [
  { img: require('../../assets/img/Frame1.png'), title: 'Empowerment', description: 'Speak confidently in every moment of doubt' },
  { img: require('../../assets/img/Frame2.png'), title: 'Biblical Guidance', description: 'Answers rooted in scripture, delivered with clarity' },
  { img: require('../../assets/img/Frame3.png'), title: 'Community', description: 'Join a global movement of believers sharing the truth' },
  {
    img: require('../../assets/img/Frame4.png'),
    title: 'Modern Faith Tools',
    description: "Equipping you with easily accessible answers at your fingertips for today's conversations",
  },
];

export default function ImageSlider() {
  const progress = useSharedValue(0);
  const ref = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useAnimatedReaction(
    () => Math.round(progress.value),
    (newIndex) => {
      runOnJS(setCurrentIndex)(newIndex);
    },
    [progress]
  );

  const onPressPagination = (index) => {
    ref.current?.scrollTo({
      count: index - currentIndex,
      animated: true,
    });
  };

  const renderDot = ({ index }) => {
    const isActive = currentIndex === index;
    const isSecondDot = index === 1;

    return (
      <TouchableOpacity
        key={index}
        onPress={() => onPressPagination(index)}
        style={[
          styles.dotBase,
          isSecondDot && styles.secondDot,
          isActive ? styles.dotActive : styles.dotInactive,
          isActive && isSecondDot && styles.secondDotActive,
        ]}
      />
    );
  };

  return (
    <View style={{ gap: 10 }}>
      <Carousel
        ref={ref}
        autoPlayInterval={2000}
        data={imageData}
        height={window.height - (window.height * 27) / 100}
        width={window.width}
        loop
        pagingEnabled
        snapEnabled
        mode="normal"
        modeConfig={{
          parallaxScrollingScale: 1,
          parallaxScrollingOffset: 50,
        }}
        onProgressChange={progress}
        renderItem={({ item }) => (
          <View style={styles.slideContainer}>
            <Image source={item?.img} style={styles.image} />
            <View style={styles.captionContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        )}
      />

      {/* Custom Pagination */}
      <View style={styles.paginationContainer}>
        {imageData.map((_, index) => renderDot({ index }))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  slideContainer: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  image: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: '70%',
    resizeMode: 'contain',
    borderRadius: 16,
  },
  captionContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    position: 'absolute',
    height: '30%',
    top: (window.height * 7) / 100,
    left: 0,
    right: 0,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    fontWeight: '400',
  },
  title: {
    fontSize: 32,
    fontFamily: 'DMSerifDisplay',
    fontWeight: '400',
  },
  description: {
    fontSize: 16,
    width: '100%',
    textAlign: 'center',
    flexWrap: 'wrap',
    fontFamily: 'NunitoSemiBold',
    fontWeight: '600',
    padding: 15,
    boxSizing: 'border-box',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  dotBase: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  secondDot: {
    width: 25,
    borderRadius: 10,
  },
  secondDotActive: {
    borderRadius: 10,
  },
  dotInactive: {
    backgroundColor: lighgreen,
  },
  dotActive: {
    backgroundColor: deepGreen,
  },
});
