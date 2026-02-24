import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { BASE_URL } from '../../../context/Paths';
import * as FileSystem from 'expo-file-system'

export default function AudioPlayerCard({item, currentId, playSound, stopSound}) {

    console.log("testing", currentId)

    const [sound, setSound] = useState(null);
    const [duration, setDuration] = useState(0)

     const formatDuration = (millis) => {
        const minutes = Math.floor(millis / 60000);
        const seconds = ((millis % 60000) / 1000).toFixed(0);
        return `${minutes}:${seconds.padStart(2, '0')}`;
    };

    const [play, setPlay] = useState(false);
    
    const handlePlayStart = async () => {
        playSound({id:item.id, uri: BASE_URL+item.uri })
    
    }
    const hanldePlayStop = async () => {
        stopSound()
    }

    const handleAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: false,
          interruptionModeIOS: 1, 
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          interruptionModeAndroid: 1,
        });

        let audioUrl;
        
  
        if (item.uri.startsWith('http')) {
          audioUrl = item.uri;
        } else if (item.uri.startsWith('file://')) {
          audioUrl = item.uri;
        } else {
          const cleanBaseUrl = BASE_URL.endsWith('/') ? BASE_URL : BASE_URL + '/';
          const cleanPath = item.uri.startsWith('/') ? item.uri.substring(1) : item.uri;
          audioUrl = cleanBaseUrl + cleanPath;
        }

        console.log('Final audio URL:', audioUrl); 
        if (audioUrl.startsWith('http')) {
          const filename = `audio_${item.id}.m4a`;
          const fileUri = `${FileSystem.cacheDirectory}${filename}`;

          try {
            const fileInfo = await FileSystem.getInfoAsync(fileUri);
            if (!fileInfo.exists) {
              console.log('Downloading audio file from:', audioUrl);
              
              // Test if the URL is accessible first
              const response = await fetch(audioUrl, { method: 'HEAD' });
              if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
              }
              
              await FileSystem.downloadAsync(audioUrl, fileUri);
              console.log('Download completed to:', fileUri);
            } else {
              console.log('File already exists:', fileUri);
            }
            audioUrl = fileUri;
          } catch (e) {
            console.log('Download error:', e.message);
            console.log('Using original URL as fallback');
          }
        }

        const { sound: playbackSound } = await Audio.Sound.createAsync(
          { uri: audioUrl }, 
          { shouldPlay: true, positionMillis: 0 }
        );

        // Pause immediately
        await playbackSound.pauseAsync();

        // Get the status
        const status = await playbackSound.getStatusAsync();
        
        setSound(playbackSound);
        
        if (status.isLoaded && status.durationMillis) {
          const seconds = formatDuration(status.durationMillis);
          setDuration(seconds);
        } else {
          // Fallback callback
          playbackSound.setOnPlaybackStatusUpdate((status) => {
            if (status.isLoaded && status.durationMillis && !duration) {
              const seconds = formatDuration(status.durationMillis);
              setDuration(seconds);
              playbackSound.setOnPlaybackStatusUpdate(null);
            }
          });
        }

      } catch (e) {
        console.log('Error in handleAudio:', e);
      }
    };

    useEffect(() => {
        handleAudio();
        return () => {
            if(sound)sound.unloadAsync();
        }
    }, [])



  return (
    <View style={styles.container}>
        {!(currentId == item?.id) ? 
            <TouchableOpacity onPress={handlePlayStart}  style={styles.playButton}>
                <FontAwesome name="play" size={15} color="#fff" />
            </TouchableOpacity>:
            <TouchableOpacity onPress={hanldePlayStop} style={styles.playButton}>
                <FontAwesome name="pause" size={15} color="#fff" />
            </TouchableOpacity>
        }
      
      <View style={styles.waveform}>
        {wavePattern.map((height, index) => (
          <View
            key={index}
            style={[
              styles.bar,
              {
                height,
                marginLeft: index === 0 ? 0 : 2,
              },
            ]}
          />
        ))}
      </View>
      <Text style={styles.duration}>{duration}</Text>
    </View>
  );
}

const wavePattern = [
  2, 6, 12, 6, 2,  // dots
  20, 25, 25, 20,  // wave block
  6, 2, 2,         // dots
  22, 28, 22,      // wave block
  2, 2, 6,         // dots
  25, 30, 26,      // wave block
  2, 2 ,            // ending dots
  2, 6, 12, 6, 2,  // dots
  20, 25, 25, 20,  // wave block
  6, 2, 2,         // dots
  22, 28, 22,      // wave block
  2, 2, 6,         // dots
  25, 20, 26,      // wave block
  2, 2             // ending do
];

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#005A55',
    alignItems:'center',
    padding: 12,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius:16,
    width: 300,
  },
  playButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#015E5C',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  duration: {
    color: 'white',
    fontSize: 14,
    marginRight: 8,
  },
  waveform: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    flex: 1,
  },
  bar: {
    width: 2,
    backgroundColor: 'white',
    borderRadius: 1,
  },
});
