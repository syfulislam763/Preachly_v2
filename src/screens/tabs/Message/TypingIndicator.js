import React, { useEffect, useRef } from "react";
import { View, Animated, StyleSheet } from "react-native";

export default function TypingIndicator({ isTyping }) {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  const animateDot = (dot, delay) => {
    return Animated.loop(
      Animated.sequence([
        Animated.timing(dot, {
          toValue: -5, // moves UP
          duration: 200,
          delay,
          useNativeDriver: true,
        }),
        Animated.timing(dot, {
          toValue: 0, // back to original
          duration: 200,
          useNativeDriver: true,
        }),
      ])
    );
  };

  useEffect(() => {
    let anim1, anim2, anim3;
    if (isTyping) {
      anim1 = animateDot(dot1, 0);
      anim2 = animateDot(dot2, 150);
      anim3 = animateDot(dot3, 300);
      anim1.start();
      anim2.start();
      anim3.start();
    } else {
      dot1.setValue(0);
      dot2.setValue(0);
      dot3.setValue(0);
    }

    return () => {
      anim1?.stop();
      anim2?.stop();
      anim3?.stop();
    };
  }, [isTyping]);

  if (!isTyping) return null;

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.dot, { transform: [{ translateY: dot1 }] }]} />
      <Animated.View style={[styles.dot, { transform: [{ translateY: dot2 }] }]} />
      <Animated.View style={[styles.dot, { transform: [{ translateY: dot3 }] }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end", // so the bounce looks natural
    backgroundColor: '#005A55',
    padding: 12,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomRightRadius:16,
    borderWidth:1,
    borderColor:'#ACC6C5',
    width:"25%"
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "white", // WhatsApp-like color
    marginHorizontal: 3,
  },
});
