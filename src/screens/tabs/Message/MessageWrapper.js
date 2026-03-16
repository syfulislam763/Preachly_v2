
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
  Animated, 
} from 'react-native';
import Conversations from './Conversations';
import { useFocusEffect } from '@react-navigation/native';
import VoiceMessageBubble from './VoiceMessageBubble';
import { Audio } from 'expo-av';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import TooltipButton from '@/components/TooltipButton';


const lock = require("../../../../assets/img/lock_voice.png");
const close = require("../../../../assets/img/Close.png")

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
  isTyping,
  handleScroll
}) => {
    
    const intervalRef = useRef(null);
    const [seconds, setSeconds] = useState(0);
    const [flag, setFlag] = useState(false);
    const [isFollowUpQuestion, setIsFollowUpQuestion] = useState(true);
    const [isTooltip, setTooltip] = useState(false);


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

    const playSound = async (item) => {
      console.log("file audio->", item)
      try {

        await Audio.setAudioModeAsync({
          allowsRecordingIOS: false,
          staysActiveInBackground: false,
          interruptionModeIOS:1, 
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          interruptionModeAndroid: 1, 
        });

        if (soundRef.current) {
          await soundRef.current.unloadAsync();
          soundRef.current = null;
        }

        let audioUri = item.uri;
    
        if (item.uri.startsWith('http')) {
          const filename = `audio_${item.id}.m4a`;
          const fileUri = `${FileSystem.cacheDirectory}${filename}`;
          
          try {

            const fileInfo = await FileSystem.getInfoAsync(fileUri);
            if (!fileInfo.exists) {
              console.log('Downloading audio file...');
              await FileSystem.downloadAsync(item.uri, fileUri);
            }
            audioUri = fileUri;
          } catch (downloadError) {
            console.log('Download failed, trying direct URL:', downloadError);

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
          if(!isRecordingRef.current){
            setTooltip(true);
          }else{
            //handleMicPressOut();
          }
          
          holdPress.current = setTimeout(() => {
            setTooltip(false)
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
          setTimeout(() => setTooltip(false), 1000);
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
              flexGrow:1
            }}
            ListEmptyComponent={() => {
              return isFollowUpQuestion?<DummyQuestion setIsFollowUpQuestion={setIsFollowUpQuestion} onChange={onPredefinedMsg}/>:null
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            onScroll={handleScroll}
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
                      <Text style={styles.cancelText}></Text>
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
                        {isRecordingRef.current?<MaterialCommunityIcons onPress={() => handleCancelRecording()} name="microphone" size={24} color="white" />:
                        //<MaterialCommunityIcons name="microphone" size={33} color="black" />
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
      {isTooltip && <View className='absolute bottom-28 right-10 bg-white p-2 rounded-xl'>
          <Text className='text-[#607373] text-base font-[Nunito] align-center'>Hold to record</Text>
        </View>}
    </KeyboardAvoidingView>
}

export default MessageWrapper

const DummyQuestion = ({ onChange, setIsFollowUpQuestion }) => {
  const questions = [
    "Why does God allow suffering and evil in the world?",
    "How can we trust the Bible when it's written by humans?",
    "How can Jesus be both fully God and fully man?",
    "Can't people be good without believing in God?",
    "How can I trust the church when it's full of scandals and corruption?",
  ];

  return (
    <View className="flex-1 justify-end pb-2">
      <View
        className="bg-white rounded-t-3xl px-5 pt-5 pb-6"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        }}
      >
        {/* Title */}

        <View className='flex-row justify-end items-start'>
          <View className='w-full items-center'>
            <Text className="text-[#0B172A] font-[NunitoBold] text-lg pb-2 mb-3 ml-5">
              What do you want to ask?
            </Text>
          </View>
          <TouchableOpacity onPress={() => setIsFollowUpQuestion(false)} className=''>
            <Image source={close} style={{objectFit:'contain'}} className='h-[24px] w-[24px]'/>
          </TouchableOpacity>
        </View>
        

        {/* Pills */}
        {questions.map((question, index) => (
          <Pressable
            key={index}
            onPress={() => onChange(question)}
            className="bg-[#FDF2D8] rounded-full px-4 py-2 mb-2.5 w-full active:opacity-70"
          >
            <Text className="text-[#0B172A] font-[NunitoSemiBold] text-[15px]">
              {question}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
};

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