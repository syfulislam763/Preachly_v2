import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  Pressable,
  StyleSheet,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { Audio } from 'expo-av';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ChatInput() {
  const [mode, setMode] = useState('text'); // 'text', 'recording', 'recorded', 'uploading'
  const [text, setText] = useState('');
  const [recording, setRecording] = useState(null);
  const [recordedURI, setRecordedURI] = useState(null);
  const [recordDuration, setRecordDuration] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);
  const sound = useRef(null);

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.5,
          duration: 400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopPulse = () => {
    scaleAnim.stopAnimation();
    scaleAnim.setValue(1);
  };

  const startRecording = async () => {
    const permission = await Audio.requestPermissionsAsync();
    if (!permission.granted) return;

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const newRecording = new Audio.Recording();
    await newRecording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
    await newRecording.startAsync();

    setRecording(newRecording);
    setMode('recording');
    startPulse();
  };

  const stopRecording = async () => {
    if (!recording) return;
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    const status = await recording.getStatusAsync();
    setRecording(null);
    setRecordedURI(uri);
    setRecordDuration(status.durationMillis);
    setMode('recorded');
    stopPulse();

    // Auto-play after slight delay
    setTimeout(() => {
      playRecording();
    }, 300);
  };

  const playRecording = async () => {
    if (!recordedURI) return;
    if (sound.current) {
      await sound.current.unloadAsync();
      sound.current = null;
    }
    const { sound: newSound } = await Audio.Sound.createAsync({ uri: recordedURI });
    sound.current = newSound;
    await newSound.playAsync();
  };

  const cancelRecording = () => {
    setMode('text');
    setRecording(null);
    setRecordedURI(null);
    setRecordDuration(0);
  };

  const sendAudio = () => {
    console.log('Uploading audio file:', recordedURI);
    setMode('uploading');
    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.1;
      setUploadProgress(progress);
      if (progress >= 1) {
        clearInterval(interval);
        setMode('text');
        setRecordedURI(null);
        setRecordDuration(0);
      }
    }, 200);
  };

  useEffect(() => {
    if (mode !== 'uploading') setUploadProgress(0);
  }, [mode]);

  return (
    <View style={styles.container}>
      {mode === 'uploading' ? (
        <View style={styles.uploadBarContainer}>
          <Text style={styles.uploadLabel}>Uploading...</Text>
          <View style={styles.uploadBar}>
            <View style={[styles.uploadProgress, { width: `${uploadProgress * 100}%` }]} />
          </View>
        </View>
      ) : mode === 'recorded' ? (
        <View style={styles.audioPreview}>
          <TouchableOpacity onPress={playRecording}>
            <Icon name="play" size={24} />
          </TouchableOpacity>
          <Text style={styles.audioText}>{`${Math.floor(recordDuration / 1000)}s`}</Text>
          <TouchableOpacity onPress={sendAudio}>
            <Icon name="send" size={24} />
          </TouchableOpacity>
          <TouchableOpacity onPress={cancelRecording}>
            <Icon name="close" size={24} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.inputRow}>
          <TouchableOpacity>
            <Icon name="plus" size={22} color="#444" />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            placeholder="Ask anything – let’s find answers together…"
            value={text}
            onChangeText={setText}
            placeholderTextColor="#999"
            multiline
          />
          <Pressable
            onPressIn={startRecording}
            onPressOut={stopRecording}
            style={[
              styles.micButton,
              mode === 'recording' && styles.micRecording,
            ]}
          >
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
              <Icon name="microphone" size={24} color="white" />
            </Animated.View>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: 'white',
    justifyContent: 'flex-end',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eef4f4',
    borderRadius: 24,
    paddingHorizontal: 12,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
  },
  input: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 16,
    maxHeight: 100,
  },
  micButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 50,
    marginLeft: 8,
  },
  micRecording: {
    backgroundColor: '#dc3545',
  },
  audioPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e6f2f2',
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderRadius: 24,
    justifyContent: 'space-between',
  },
  audioText: {
    marginHorizontal: 10,
    fontSize: 16,
  },
  uploadBarContainer: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 24,
    alignItems: 'center',
  },
  uploadLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  uploadBar: {
    width: '100%',
    height: 8,
    backgroundColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  uploadProgress: {
    height: 8,
    backgroundColor: '#007bff',
  },
});
