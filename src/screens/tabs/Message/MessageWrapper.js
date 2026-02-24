
import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  FlatList,
  KeyboardAvoidingView,
  StyleSheet,
  TextInput,
  Pressable,
  PanResponder,
  Animated
} from 'react-native';
import Conversations from './Conversations';
import { useFocusEffect } from '@react-navigation/native';
import VoiceMessageBubble from './VoiceMessageBubble';
import { Audio } from 'expo-av';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system'

const lock = require("../../../../assets/img/lock_voice.png");

const AnimatedView = Animated.createAnimatedComponent(View);

const MessageWrapper = ({
  flatListRef, 
  messages,
  onChange, 
  onPredefinedMsg, 
  handleSendMessage, 
  message, 
  methods,
  startRocording,
  stopRecording,
  recorderState,
  setRecordingState,
  recordings,
  setRecordings,
  isTest,
  setIsTest,
  isTyping
}) => {
    
    const intervalRef = useRef(null);
    const [seconds, setSeconds] = useState(0);
    const [flag, setFlag] = useState(false);


    const startTimer = () => {
        if(intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
            setSeconds(prev => prev+1);
        }, 1000)
    }

    const stopTimer = () => {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        setSeconds(0);
    }

    const soundRef = useRef(null);
    const [currentId, setCurrentId] = useState(0);

    // const playSound = async (item) => {
 
    //   if (soundRef.current) {
    //     await soundRef.current.unloadAsync();
    //     soundRef.current = null;
    //   }

    //   const { sound } = await Audio.Sound.createAsync({ uri: item.uri }, {shouldPlay: true});
    //   soundRef.current = sound;

    //   sound.setOnPlaybackStatusUpdate((status) => {
    //     if (status.didJustFinish) {
    //         stopSound()
    //     }
    //   });

    //   setCurrentId(item.id);
    // };

    const playSound = async (item) => {
      console.log("file audio->", item)
      try {
        // Set audio mode for iOS
        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: false,
          interruptionModeIOS:1, // Corrected
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          interruptionModeAndroid: 1, // Corrected
        });

        if (soundRef.current) {
          await soundRef.current.unloadAsync();
          soundRef.current = null;
        }

        let audioUri = item.uri;
    
        // If it's a URL, download it first
        if (item.uri.startsWith('http')) {
          const filename = `audio_${item.id}.m4a`;
          const fileUri = `${FileSystem.cacheDirectory}${filename}`;
          
          try {
            // Check if file already exists
            const fileInfo = await FileSystem.getInfoAsync(fileUri);
            if (!fileInfo.exists) {
              console.log('Downloading audio file...');
              await FileSystem.downloadAsync(item.uri, fileUri);
            }
            audioUri = fileUri;
          } catch (downloadError) {
            console.log('Download failed, trying direct URL:', downloadError);
            // Fallback to direct URL if download fails
          }
        }


        const { sound } = await Audio.Sound.createAsync(
          { uri: audioUri },
          { shouldPlay: true }
        );

        soundRef.current = sound;

        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            stopSound();
          }
        });

        setCurrentId(item.id);
      } catch (error) {
        console.log('Error playing sound:', error);
      }
    };


    const stopSound = async () => {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
        setCurrentId(0)
      }
    }

    useFocusEffect(
      useCallback(() => {
        stopSound()
      }, [])
    )


    // Animation and gesture handling
    const translateY = useRef(new Animated.Value(0)).current;
    const lockedRef = useRef(false);
    const isRecordingRef = useRef(false);
    const holdPress = useRef(null)
    const THRESHOLD = -70;

    
    // Handle mic press events
    const handleMicPressIn = () => {
      if(isRecordingRef.current)return;
      console.log("Mic press in - start recording");
      isRecordingRef.current = true;
      stopTimer();
      stopRecording();
      startTimer();
      startRocording();
    };

    const handleMicPressOut = () => {
      console.log("Mic press out - stop recording");
      lockedRef.current = false;
      isRecordingRef.current = false;
      
      stopTimer();
      stopRecording();
      clearTimeout(holdPress.current);
      holdPress.current = null;
      // Reset lock state and animation
      
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
      
    };

    const handleMicLock = () => {
      console.log("Mic locked - continuous recording");
      translateY.setValue(0);
      // Handle lock state - recording continues even after releasing
    };

    const panResponder = useRef(
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 4,

        onPanResponderGrant: () => {
          // This is called when the responder is granted
          holdPress.current = setTimeout(() => {
            handleMicPressIn();
          }, 700)
        },

        onPanResponderMove: (_, g) => {
          if (lockedRef.current) return;

          // Only move upward (negative dy)
          const y = Math.min(0, g.dy);
          translateY.setValue(y);

          // Trigger lock when crossing threshold
          if (y <= THRESHOLD && !lockedRef.current) {
            lockedRef.current = true;
            handleMicLock();
          }
        },

        onPanResponderRelease: () => {
          // Only stop recording if not locked
          clearTimeout(holdPress.current);
          if (!lockedRef.current && isRecordingRef.current) {
            console.log("error2")
            lockedRef.current = false;
            isRecordingRef.current = false;
            setFlag(true);
          }
          
          // If not locked, snap back
          if (!lockedRef.current) {
            Animated.spring(translateY, {
              toValue: 0,
              useNativeDriver: true,
            }).start();
          }
        },

        onPanResponderTerminate: () => {
          // Handle case where gesture is terminated
          if (!lockedRef.current && isRecordingRef.current) {
            console.log("error1")
            lockedRef.current = false;
            isRecordingRef.current = false;
            handleMicPressOut();
          }
        },
      })
    ).current;

    // Handle cancel recording (when locked)
    const handleCancelRecording = () => {
      lockedRef.current = false;
      isRecordingRef.current = false;
      handleMicPressOut();
      
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    };

    useEffect(()=>{
      let timeout;
      if(flag){
        setFlag(false);
        handleMicPressOut()
        timeout = setTimeout(() => {
          handleMicPressOut();
        }, 1000)
      }

      return () => {
        clearTimeout(timeout);
      }

    }, [flag])

  return <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
        <View 
        style={{ flex: 1 }}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Conversations
                type={item.type}
                message={item.message}
                verseLink={item.verseLink}
                methods={methods}
                message_id={item.message_id}
                item={item}
                currentId={currentId}
                playSound={playSound}
                stopSound={stopSound}
                isTyping={true}
                onPredefinedMsg={onPredefinedMsg}
              />
          
            )}
            contentContainerStyle={{
              paddingTop: 15,
              paddingHorizontal: 12,
              paddingBottom: 20, // leave space for input
            }}
            ListEmptyComponent={() => {
              return <DummyQuestion onChange={onPredefinedMsg}/>
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
          />

          
          <View style={styles.inputContainer}>
              
            {recordings?<>

                <VoiceMessageBubble playSound={playSound} stopSound={stopSound} currentId={currentId} recordings={recordings} setRecordings={(a) => {
                  setRecordings(a);
                  setIsTest(false)
                }}/>
                <Pressable 
                    onPress={()=>handleSendMessage(message)}
                >
                    <Image
                    source={require("../../../../assets/img/send_message.png")}
                    style={styles.inputIcon}
                    />
                </Pressable>

              </> :<>
                {}
                {
                  !isRecordingRef.current && <TextInput
                    style={styles.inputField}
                    multiline={true}
                    numberOfLines={2}
                    value={message}
                    onChangeText={e=>onChange(e)}
                    placeholder={"What's on your heart? Ask anything - lets find and inspired answer.."}
                    placeholderTextColor={'#607373'}
                />
                }

                <View style={isRecordingRef.current?styles.container:{...styles.container, width:50}}>
                  {/* Left - Duration */}
                  {isRecordingRef.current && (
                    <View style={styles.durationContainer}>
                      <View style={styles.redDot} />
                      <Text style={styles.durationText}>{seconds}s</Text>
                    </View>
                  )}

                  {/* Center - Cancel (only show when locked) */}
                  {lockedRef.current && (
                    <TouchableOpacity onPress={handleCancelRecording}>
                      <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                  )}

                  {/* Lock Icon */}
                  {(isRecordingRef.current && !lockedRef.current) && <View style={styles.lockIcon}>
                    <Image source={lock} style={{ height: 50, width: 50, resizeMode: 'contain' }} />
                  </View>}

                  {/* Mic Button */}
                  <AnimatedView
                    style={[isRecordingRef.current?styles.micOuter:{}, { transform: [{ translateY }] }]}
                    {...panResponder.panHandlers}
                  >
                    <View style={isRecordingRef.current?styles.micMiddle:{}}>
                      <View style={isRecordingRef.current?styles.micInner:{backgroundColor:'none'}}>
                        {isRecordingRef.current?<MaterialCommunityIcons name="microphone" size={24} color="white" />:
                        // <MaterialCommunityIcons name="microphone" size={33} color="black" />
                          <Image
                            source={require("../../../../assets/img/24-microphone.png")}
                            style={styles.inputIcon}
                          />
                        }
                      </View>
                    </View>
                  </AnimatedView>
                </View>

                {
                  !isRecordingRef.current && <Pressable 
                    onPress={()=>handleSendMessage(message)}
                >
                    <Image
                    //source={require("../../../../assets/img/24-microphone.png")}
                    source={require("../../../../assets/img/send_message.png")}
                    style={styles.inputIcon}
                    />
                </Pressable>
                }
            </>}
          </View>
        </View>
      {/* </TouchableWithoutFeedback> */}
    </KeyboardAvoidingView>
}

export default MessageWrapper

const DummyQuestion = ({onChange}) => {
  return <View style={{
   
    marginTop: "100%",
    width:"100%",
    backgroundColor:'#fff',
    padding:20,
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  }}>
    <Text style={{
      color:"#0B172A",
      fontFamily:'NunitoBold',
      fontSize: 18,
      paddingVertical: 20,
    }}>What do you want to ask?</Text>
    <View style={{
      
    }}>
      <Pressable onPress={()=>onChange("Why does God allow suffering and evil in the world?")}>
        <Text style={styles.commonQuestion}>Why does God allow suffering and evil in the world?</Text>
      </Pressable>
      <Pressable onPress={() => onChange("How can we trust the Bible when it's written by humans?")}>
        <Text style={styles.commonQuestion}>How can we trust the Bible when it's written by humans?</Text>
      </Pressable>
      <Pressable onPress={() => onChange("How can Jesus be both fully God and fully man?")}>
        <Text style={styles.commonQuestion}>How can Jesus be both fully God and fully man?</Text>
      </Pressable>
      <Pressable onPress={() => onChange(`Can't people be good without believing in God?`)}>
        <Text style={styles.commonQuestion}>Can't people be good without believing in God?</Text>
      </Pressable>
      <Pressable onPress={() => onChange(`How can I trust the church when it's full of scandalsand corruption?`)}>
        <Text style={styles.commonQuestion}>How can I trust the church when it's full of scandalsand corruption?</Text>
      </Pressable>
    </View>
  </View>
}

const styles = StyleSheet.create({
  commonQuestion:{
    color:'#0B172A',
    fontFamily:'NunitoSemiBold',
    fontSize: 15,
    backgroundColor:'#FDF2D8',
    paddingVertical:5,
    paddingHorizontal:10,
    marginBottom:10,
    borderRadius: 20,
  },
  inputContainer:{
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    paddingHorizontal:20,
    paddingVertical:10
  },
  inputField: {
    borderWidth:1,
    width: '75%',
    borderColor:'#ACC6C5',
    borderRadius: 30,
    paddingVertical:10,
    paddingHorizontal: 20
  },
  inputIcon:{
    height:30,
    width:30,
    objectFit:'contain'
  },

  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    width: "100%",
    position: 'relative'
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  redDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'red',
    marginRight: 6,
  },
  durationText: {
    fontSize: 16,
    color: '#0B172A',
  },
  cancelText: {
    //textDecorationLine: 'underline',
    color: '#0B6E6E',
    fontSize: 16,
    fontWeight: '500',
  },
  lockIcon: {
    position: 'absolute',
    right: 12,
    top: -70,
  },
  micOuter: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#B8E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  micMiddle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#5CBDBD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  micInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007A7A',
    justifyContent: 'center',
    alignItems: 'center',
  },
})