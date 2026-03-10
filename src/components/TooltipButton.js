import React, { useState, useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, Animated, Modal } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";

export default function TooltipButton({
  message = "Copied!",
  duration = 1000,
  visible,
  setVisible,
  tooltipVisible
}) {
  const opacity = useRef(new Animated.Value(tooltipVisible ? 1 : 0)).current;
  const translateY = useRef(new Animated.Value(tooltipVisible ? 0 : 6)).current;
  const timeoutRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
        const timer = setTimeout(() => {
        setVisible(false)
    }, 1000);

    return () => {
        clearTimeout(timer)
    }
    }, [])
  )

  console.log(visible, "tol")

  return visible && (
        <Modal
          visible={visible}
          onRequestClose={() => setVisible(false)}
          className="absolute bottom-[72px] bg-zinc-100 px-4 py-2 rounded-xl shadow-lg"
        >
          <Text className="text-zinc-900 text-sm font-semibold tracking-wide">
            {message}
          </Text>
          <View className="absolute -bottom-[6px] self-center w-3 h-3 bg-zinc-100 rotate-45" />
        </Modal>
      )


}