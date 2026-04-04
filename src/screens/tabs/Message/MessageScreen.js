import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ReusableNavigation from '../../../components/ReusabeNavigation';
import BackButton from '../../../components/BackButton';
import Feedback from './Feedback';
import { get_session_id, bookmark_message, get_message_by_session_id, get_new_session } from '../TabsAPI';
import Indicator from '../../../components/Indicator'
import { WEBSOCKET_URL } from '../../../context/Paths';
import {useAuth} from '../../../context/AuthContext';
import * as Clipboard from 'expo-clipboard';
import Share from 'react-native-share'
import { useNavigation } from '@react-navigation/native';
import { finish_share, finish_conversation, send_voice_message } from '../TabsAPI';
import { useRoute } from '@react-navigation/native';
import MessageWrapper from './MessageWrapper';
import { startRecording, stopRecording,requestPermission} from './voiceRecord_';
import { useFocusEffect } from '@react-navigation/native';
import useAppStore from '@/context/useAppStore';

export default function MessageScreen() {

  const flatListRef = useRef(null);
  const [isFeedback, setIsFeedback] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(0);
  const setCurrentSession = useAppStore((s) => s.setCurrentSession);
  const currentSession = useAppStore((s) => s.current_session);


  const access = useAppStore((s) => s.auth.access)

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("")
  const [prevMsg, setPrevMsg] = useState("")

  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const [recordings, setRecordings] = useState(null);
  const [audio, setAudio] = useState(null);
  const [recordingState, setRecordingState] = useState(false);
 
  const [isTest, setIsTest] = useState(false);

  const [doneOne, setDoneOne] = useState(false);
  const [doneTwo, setDoneTwo] = useState(false);

  const [isTyping, setIsTyping] = useState(false);

  const [connectSocket, setConnctSocket] = useState(1);
  const ws = useRef(null);



  const isAtBottom = useRef(true);

  const handleScroll = (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const threshold = 50;
    isAtBottom.current = 
      layoutMeasurement.height + contentOffset.y >= contentSize.height - threshold;
  };

  const handleStopRecording = async () => {
    if(recordings){
      const data = await stopRecording(recordings, setRecordings);
      setAudio(data);
      setRecordingState(false);
    }
  }
  const handleStartRecording = async () => {
    if(recordings){
      const data = await stopRecording(recordings, setRecordings);
      setAudio(data);
      setRecordingState(false);
      return;
    }
    const res = await startRecording();
    setRecordings(res.recording)
    setRecordingState(true);
    setAudio(null)
  }

  const create_session = (feedback=false) =>{
    setLoading(true);
    get_session_id((res,success)=>{
      if(success){
        setMessage("");
        setMessages([])
        setPrevMsg("");
        setRecordings(null);
        //7de74674-e3b8-4a18-a985-5f62a346d3ba
        console.log("new session -> [", JSON.stringify(res, null, 2));
        let temp = JSON.stringify({ ...res.data, isNewSession: true});
        setCurrentSession(JSON.parse(temp))
        setDoneOne(true)
        setFeedback(true);
        setIsFeedback(false);
        
        if(feedback){
          ws.current?.close();
          ws.current = null;
        }
        
        
      }else{
        console.log("ss->", JSON.stringify(res.response.config, null, 2));
        console.log("code ->", res.status)
        setFeedback(false);
        setIsFeedback(false);
      }
      
      setLoading(false);
    })
  }

  const start_new_session = (feedback=false) => {
    const payload = {session_id: currentSession?.id}
    get_new_session(payload, (res, success) => {
      if(success){
        setMessage("");
        setMessages([])
        setPrevMsg("");
        setRecordings(null);
        //a48b8624-36bc-4fb8-8416-7683fc9ae3a0
        const new_session = res?.data?.new_session ?? {}
        console.log("start a new one session -> [", JSON.stringify(res, null, 2));
        let temp = JSON.stringify({ ...new_session, isNewSession: true});
        setCurrentSession(JSON.parse(temp))
        setDoneOne(true)
        setFeedback(true);
        setIsFeedback(false);
        
        if(feedback){
          ws.current?.close();
          ws.current = null;
        }
        
        
      }else{
        console.log("ss->", JSON.stringify(res.response.config, null, 2));
        console.log("code ->", res.status)
        setFeedback(false);
        setIsFeedback(false);
      }
      
      setLoading(false);
    })
  }


  useEffect(() =>{
      console.log("current session- ", JSON.stringify(currentSession, null, 2))
    if((currentSession?.id)){
      setLoading(true);
      
      get_message_by_session_id(currentSession?.id, (res, success) => {
        if(success){
          const quote = "Answer this question more deeply and precisely";
          const conversations = (res?.data?.messages ?? []).filter(m => !m.content.includes(quote));



          let msgs = conversations.map(item => {
            
            return (item.is_user && !item.has_voice )?{
                id: item?.id,
                message_id: item?.id,
                type: 'user',
                verseLink: "",
                message: item?.content
              }: item.has_voice? 
                {
                  id: item?.id,
                  message_id: item?.id,
                  type: 'audio',
                  verseLink: "",
                  message: item?.content,
                  uri: item.voice_file
                }
              : {
              id: item?.id,
              message_id: item?.id,
              type: 'bot',
              verseLink: "",
              message:  item?.content.substring(item?.content.indexOf("Scriptural Rebuttal"), item?.content.length),
              bookmark:item.bookmark,
            }
          });

          let temp = []
          for(let i=0;i<msgs.length;){
            if(msgs[i].type == "audio"){
              temp.push(msgs[i]);
              i += 2;
            }else{
              temp.push(msgs[i]);
              i++;
            }
            
          }
          

          //console.log(JSON.stringify(conversations, null, 2), "etm")

          setMessages(temp);
          setLoading(false);
          //setIsNewSession(false);
          setDoneOne(true)
          setCurrentSession({...currentSession, isNewSession: false})
          //console.log("m ->", JSON.stringify(msgs, null, 2))
        }else{
          
          setLoading(false);
        }
        
      })
   
    }else{
      create_session();
    }


    return () =>{
      
    }

  },[]);
  
  const handleCopy = async (message) =>{
    await Clipboard.setStringAsync(message);
    console.log("copy...");
  };

  const handleBookmark = (item) =>{

    const payload = {
      bookmark: (item?.bookmark) ? false: true,
      message_id: item?.message_id
    }

    bookmark_message(payload, (res, success) => {
      if(res){
        let temp = [];
        messages.forEach(msg => {
          if(msg.message_id == item?.message_id){
            let x = {...msg};
            x.bookmark = res?.data?.bookmarked;
            temp.push(JSON.parse(JSON.stringify(x)));
          }else{
            temp.push(JSON.parse(JSON.stringify(msg)))
          }
        });
        setMessages(JSON.parse(JSON.stringify(temp)));
      }
    })

  }
  
  const handleShare = async (message) =>{
    const options = {
      message: message
    }
    try{
      await Share.open(options)
      finish_share((res, success) => {
        //console.log(res);
      })
    }catch(e){

    }

  }
  const handleRegenerate = () =>{
    const payload = {
      message: "Answer this question more deeply and precisely please " + prevMsg,
      session_id: currentSession?.id,
      type: "message"
    }
    if(ws.current && prevMsg.trim()){
      ws.current.send(JSON.stringify(payload))
    }

  }

  
  useEffect(() =>{
    if(!currentSession?.id)return () => {}
    if(ws.current)return () => {}

    const wsURL = WEBSOCKET_URL+`/ws/chat/${currentSession?.id}/?token=${access}`;
    console.log(wsURL);
    ws.current = new WebSocket(wsURL);

    ws.current.onopen = () => {
      setDoneTwo(true)
      console.log("socket connected...");
    }

    ws.current.onmessage = (e) =>{
      try{
        const data = JSON.parse(e.data);
        const res = {
          id: Date.now(),
          message_id: data?.message_id,
          type: 'bot',
          verseLink: "",
          message: data?.content,
          bookmark:false,
          summary: data?.summary || [],
          message_type: "",
        }
        if(data?.type === "typing" && data?.is_typing){
          setIsTyping(true);
          res.message = "typing..."
          res.type = "wave";
          setMessages(prev => [...prev, res])
        }
        if((data?.type === "exploration_options")){
          res.message = data.message;
          res.message_id = Date.now();
          res.message_type= data?.show_clarification ? "" :"yes_no" 
          setIsTyping(false);
          setMessages(prev => [...prev.filter(item=> item.message != "typing..."), res])
        }

        if( (data?.type === "conversation_continuation")){
          //console.log("t", JSON.stringify(data, null, 2))
          res.message_type= data?.show_clarification ? "" :"yes_no" 
          setIsTyping(false);
          setMessages(prev => [...prev.filter(item=> item.message != "typing..."), res])
        }

        if( (data?.type === "preachly_response") || (data?.type === "clarification_response")){
          let idx = res.message.indexOf("Scriptural Rebuttal");
          if(idx != -1){
            res.message = res.message.substring(idx, res.message.length);
          }
          if((data?.type === "clarification_response")){
            res.message_type=data?.show_clarification ? "" :"yes_no" 
          }
          setIsTyping(false);
          setMessages(prev => [...prev.filter(item=> item.message != "typing..."), res])

        }

        if( (data?.type == "error")) {
          res.message = 'Something went wrong';
          res.message_id = Date.now();
          res.message_type=data?.show_clarification ? "" :"yes_no" 
          setIsTyping(false);
          setMessages(prev => [...prev.filter(item=> item.message != "typing..."), res])
        }
      
      }catch(err){
        console.log("message err", err)
      }
    }
    ws.current.onerror = (e) =>{
      console.log("socket error ->", e.message);
    }
    ws.current.onclose = () =>{
      console.log("socket disconnected...");
    }
  }, [ access, currentSession]);

  const handleSendPredefinedMessage = (message) => {
    try {
        const payload = {
        message: message,
        session_id: currentSession?.id,
        type: "message",
        message_type: (message.trim().toLowerCase() === "no" || message.trim().toLowerCase() == "yes")?"yes_no":"objection"
      }

      if(ws.current && message.trim()){
        ws.current?.send(JSON.stringify(payload));
        const res = {
          id: new Date().getTime(),
          message_id: "",
          type: 'user',
          verseLink: "",
          message: message
        }

        setMessages(prev => [...prev, res]);
        setPrevMsg(message);
        setMessage("")
        setRecordings(null);
      }else{
        
      }
    }catch(e){
      console.log("wait a minute")
    }
  }
 
  const sendMessage = () =>{
    try{
      const payload = {
        message: message,
        session_id: currentSession?.id,
        type: "message",
        message_type: (message.trim().toLowerCase() === "no" || message.trim().toLowerCase() == "yes")?"yes_no":"objection"
      }
      console.log(payload)
      if(ws.current && message.trim()){
        ws.current.send(JSON.stringify(payload));
        const res = {
          id: new Date().getTime(),
          message_id: "",
          type: 'user',
          verseLink: "",
          message: message
        }
        setMessages(prev => [...prev, res]);
        setPrevMsg(message);
        setMessage("")
        setRecordings(null);
      }else{
        
      }
    }catch(e){
      console.log("message cant be sent..")
    }
    
  }


  useFocusEffect(
    useCallback(() =>{
      return () =>{
        if(ws.current){
          ws.current?.close();
          ws.current = null;
          console.log("disconnecting")
        }
      }
    }, [])
  )

  useEffect(() => {
    if (flatListRef.current && isAtBottom.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
    
    return ()=>{
     
    }
  }, [messages]);

  const handleSendMessage = (newMessage) => {
    try {
      if(audio){
        const payload = new FormData();
        const temp = audio.file.split("/")
        const voice_file = {
          uri: audio.file,
          name: audio.name,
          type: 'audio/'+ temp[temp.length-1].split(".")[1]
        }
        payload.append("voice_file", voice_file)
        payload.append("session_id", currentSession?.id)


        const res = {
          id: Date.now(),
          message_id: Date.now(),
          type: 'user',
          verseLink: "",
          message: "",
          bookmark:false,
        }
        res.message = "sending..."
        setMessages(prev => [...prev, res])
      
        
        send_voice_message(payload, (res, success) => {
          if(success){
            const data = {
              id: Date.now(),
              message_id: res?.data.message_id,
              type: 'audio',
              verseLink: "",
              message: res?.data?.transcript,
              bookmark:false,
              uri: res?.data?.voice_url
            }
            const payload = {
              message: res?.data?.transcript,
              session_id: currentSession?.id,
              type: "message",
              message_type: "objection"
            }
            console.log("t", payload)
            ws.current.send(JSON.stringify(payload))
            setMessages(prev => [...prev.filter(item=> item.message != "sending..."), data])
            setAudio(null);
            setMessage("")
          }else{
            setMessages(prev => [...prev.filter(item=> item.message != "sending...")])
            setAudio(null);
            setMessage("")
            console.log("err ", JSON.stringify(res, null, 2));
          }
        })
    

      }else{
        sendMessage()
      }
    }catch(e){
      console.log("something went wrong")
    }

    

  };



  useEffect(() => {
    requestPermission();
    if(doneOne && doneTwo){
      console.log("yes i am ready")
      if( (currentSession?.id) && (route.params?.question) && ws.current){
        handleSendPredefinedMessage(route.params?.question)
      }
    }

  }, [doneOne, doneTwo])



  return (
    <SafeAreaView edges={["top", "bottom"]} style={{ flex: 1, backgroundColor: 'white' }}>
      <ReusableNavigation
        leftComponent={() => <BackButton navigation={navigation} 
            cb={() => {
              navigation.goBack();
            }}
         />}
        middleComponent={() => (
          <View style={{ alignItems: 'center' }}>
            <Image
              source={require('../../../../assets/img/askPreachly.png')}
              style={{ height: 40, width: 40, resizeMode: 'contain' }}
            />
            <Text
              style={{
                fontFamily: 'NunitoSemiBold',
                fontSize: 12,
                color: '#0B172A',
                marginTop: 5,
              }}
            >
              Ask Preachly
            </Text>
          </View>
        )}
        RightComponent={() => (
          <View
            style={{
              backgroundColor: '#EDF3F3',
              padding: 10,
              borderRadius: 50,
            }}
          >
            <Pressable
              onPress={() => {
                console.log("heelo")
                setIsFeedback(prev => !prev);
              }}
            >
              <Image
                source={require('../../../../assets/img/newChat.png')}
                style={{ height: 25, width: 25, resizeMode: 'contain' }}
              />
            </Pressable>
          </View>
        )}
        backgroundStyle={{ backgroundColor: '#fff',height: 65 }}
      />
     
      {/* <LostConnection/> */}

      <MessageWrapper 
        messages={messages}
        flatListRef={flatListRef}
        handleSendMessage={handleSendMessage}
        onChange={(text) => setMessage(text)}
        onPredefinedMsg={handleSendPredefinedMessage}
        message={message}
        methods = {{
          handleBookmark,
          handleCopy,
          handleRegenerate,
          handleShare
        }}
        recorderState={recordingState}
        setRecordingState={setRecordingState}
        startRocording = {handleStartRecording}
        stopRecording={handleStopRecording}
        recordings={audio}
        setRecordings={setAudio}
        isTest={isTest}
        setIsTest={setIsTest}
        isTyping={isTyping}
        handleScroll={handleScroll}
      />

      {/* {isRating && <RatingMessage 
        visible={isRating} 
        onClose={() => {
          setIsRating(false)
          
        }}

        rating={rating}
        setRatting={(res) =>{
           setRating(res)
          navigation.goBack();
        }}
      />} */}

      <Feedback 
        visible={isFeedback} 
        onClose={() => setIsFeedback(false)}
        feedback={feedback}
        setFeedback={res => {
          if(res){
            finish_conversation((res, success) => {
              console.log(res, "feedback");
              if(success){
                start_new_session(res)
              }else{
                setIsFeedback(false);
              }
            })
          }else{
            
            start_new_session(true)
            
          }
          
        }}
      />
      
      {loading && <Indicator visible={loading} onClose={()=>setLoading(false)}>
        <ActivityIndicator size={"large"}/>
      </Indicator>}
    </SafeAreaView>
  );
}