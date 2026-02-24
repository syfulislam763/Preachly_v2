import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const MediaControls = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(30);
  const [duration] = useState(100);

  // Calculate progress percentage
  const progress = (currentTime / duration) * 100;

  return (
    <View style={styles.container}>
      {/* Buttons row */}
      <View style={styles.buttonsContainer}>
        {/* Previous */}
        <TouchableOpacity onPress={() => setCurrentTime((prev) => Math.max(prev - 10, 0))}>
          <AntDesign name="stepbackward" size={32} color="#fff" />
        </TouchableOpacity>

        {/* Play or Pause */}
        <TouchableOpacity onPress={() => setIsPlaying((prev) => !prev)}>
          <AntDesign
            name={isPlaying ? "pausecircle" : "playcircle"}
            size={32}
            color="#fff"
          />
        </TouchableOpacity>

        {/* Next */}
        <TouchableOpacity onPress={() => setCurrentTime((prev) => Math.min(prev + 10, duration))}>
          <AntDesign name="stepforward" size={32} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        {/* filled progress */}
        <View style={[styles.progressFill, { width: `${progress}%` }]}>
          {/* circle indicator */}
          <View style={styles.circle} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({ 
  container: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#000',
    borderRadius: 50,
  },
  progressContainer: {
    width: 300,
    height: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#000',
    position: 'relative',
  },
  circle: {
    position: 'absolute',
    right: -7,
    top: -7,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: '#000',
  },
});

// export for reuse
export default MediaControls;
