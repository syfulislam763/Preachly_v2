import React, { useRef, useState } from 'react';
import {
  View,
  Dimensions,
  Animated,
  Image,
  Text,
  StyleSheet,
} from 'react-native';
import { deepGreen, lighgreen } from './Constant';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const ITEM_WIDTH = SCREEN_WIDTH * 0.75;
const SIDE_ITEM_SCALE = 0.8;
const SPACING = -9;
const SNAP_INTERVAL = ITEM_WIDTH + SPACING;
const SIDE_ITEM_VERTICAL_OFFSET = 50;
const CAPTION_LEFT_OFFSET = -((SCREEN_WIDTH - ITEM_WIDTH) / 2);
const IMAGE_HEIGHT = SCREEN_HEIGHT * 0.48;
const SLIDE_MARGIN_TOP = SCREEN_HEIGHT * 0.19;
const CONTAINER_MARGIN_TOP = SCREEN_HEIGHT * 0.05;

const imageData = [
  {
    img: require('../../assets/img/Frame1.png'),
    title: 'Empowerment',
    description: 'Speak confidently in every moment of doubt',
  },
  {
    img: require('../../assets/img/Frame2.png'),
    title: 'Biblical Guidance',
    description: 'Answers rooted in scripture, delivered with clarity',
  },
  {
    img: require('../../assets/img/Frame3.png'),
    title: 'Community',
    description: 'Join a global movement of believers sharing the truth',
  },
  {
    img: require('../../assets/img/Frame4.png'),
    title: 'Modern Faith Tools',
    description:
      "Equipping you with easily accessible answers at your fingertips for today's conversations",
  },
];

const images = [...imageData];

function CustomCarousel() {
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };

  const handleMomentumScrollEnd = (e) => {
    const offsetX = e.nativeEvent.contentOffset.x;
    Math.round(offsetX / SNAP_INTERVAL);
  };

  return (
    <View style={{ marginTop: CONTAINER_MARGIN_TOP, backgroundColor: 'white' }}>
      <Animated.FlatList
        ref={flatListRef}
        data={images}
        keyExtractor={(_, index) => index.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        bounces={false}
        snapToInterval={SNAP_INTERVAL}
        snapToAlignment="start"
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingHorizontal: (SCREEN_WIDTH - ITEM_WIDTH) / 2,
          alignItems: 'center',
        }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onMomentumScrollEnd={handleMomentumScrollEnd}
        getItemLayout={(_, index) => ({
          length: SNAP_INTERVAL,
          offset: SNAP_INTERVAL * index,
          index,
        })}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * SNAP_INTERVAL,
            index * SNAP_INTERVAL,
            (index + 1) * SNAP_INTERVAL,
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [SIDE_ITEM_SCALE, 1, SIDE_ITEM_SCALE],
            extrapolate: 'clamp',
          });

          const translateY = scrollX.interpolate({
            inputRange,
            outputRange: [SIDE_ITEM_VERTICAL_OFFSET, 0, SIDE_ITEM_VERTICAL_OFFSET],
            extrapolate: 'clamp',
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.7, 1, 0.7],
            extrapolate: 'clamp',
          });

          const captionOpacity = scrollX.interpolate({
            inputRange,
            outputRange: [0, 1, 0],
            extrapolate: 'clamp',
          });

          return (
            <View style={{ width: ITEM_WIDTH, marginHorizontal: SPACING / 2 }}>

              {/* Caption — breaks out to full screen width and centers */}
              <Animated.View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: CAPTION_LEFT_OFFSET,
                  width: SCREEN_WIDTH,
                  opacity: captionOpacity,
                  zIndex: 1,
                  alignItems: 'center',
                  paddingHorizontal: 20,
                  paddingBottom: 15,
                }}
              >
                <Text
                  style={{
                    fontFamily: 'DMSerifDisplay',
                    fontSize: SCREEN_WIDTH < 360 ? 28 : 36,
                    color: '#0B172A',
                    textAlign: 'center',
                    paddingTop: 20,
                    marginBottom: 8,
                    width: '100%',
                  }}
                >
                  {item.title}
                </Text>
                <Text
                  style={{
                    fontFamily: 'NunitoSemiBold',
                    fontSize: SCREEN_WIDTH < 360 ? 14 : 19,
                    lineHeight: SCREEN_WIDTH < 360 ? 18 : 24,
                    color: '#2B4752',
                    textAlign: 'center',
                    paddingTop: 10,
                    paddingBottom: 10,
                    width: '100%',
                  }}
                >
                  {item.description}
                </Text>
              </Animated.View>

              {/* Slide Card */}
              <Animated.View
                style={{
                  width: ITEM_WIDTH,
                  marginTop: SLIDE_MARGIN_TOP,
                  alignItems: 'center',
                  transform: [{ scale }, { translateY }],
                  opacity,
                }}
              >
                <Image
                  source={item.img}
                  style={{
                    width: '100%',
                    height: IMAGE_HEIGHT,
                    resizeMode: 'cover',
                    borderRadius: 30,
                  }}
                />
              </Animated.View>

            </View>
          );
        }}
      />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginTop: 20,
        }}
      >
        {imageData.map((_, i) => {
          const isActive = i === currentIndex;
          return (
            <View
              key={i}
              style={{
                width: isActive ? 25 : 12,
                height: 12,
                borderRadius: 50,
                marginHorizontal: 4,
                marginTop: 10,
                backgroundColor: isActive ? deepGreen : lighgreen,
              }}
            />
          );
        })}
      </View>
    </View>
  );
}

export default CustomCarousel;