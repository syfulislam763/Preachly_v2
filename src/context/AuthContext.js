import React, { createContext, useState, useContext, useEffect, useRef, use } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadAuthToken } from './api';
import { WEBSOCKET_URL } from './Paths';
import { da } from 'date-fns/locale';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isPersonalized, setIsPersonalized] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const login = () => setIsAuthenticated(true);
  const completePersonalization = () => setIsPersonalized(true);
  const completeSubscription = () => setIsSubscribed(true);

  const notificationRef = useRef(null);
  const conversationRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [notifications, setNotifications] = useState([])

  const [isNotificationSocketConnected, setIsNotificationSocketConnected] = useState(false);
  const [isConversationSocketConnected, setIsConversationSocketConnected] = useState(false);

  const initiateConversationSocket = (session_id, token) =>{
    if(!session_id || !token)return;
    const wsURL = WEBSOCKET_URL+`/ws/chat/${session_id}/?token=${token}`;

    conversationRef.current = new WebSocket(wsURL);

    conversationRef.current.onopen = () => {
      console.log("conversation socket connected");
      setIsConversationSocketConnected(true);
    }

    conversationRef.current.onmessage = (e) => {
      try{
        const data = JSON.parse(e.data);
        const res = {
          id: Date.now(),
          message_id: data.message_id,
          type: 'bot',
          verseLink: "",
          message: data.content,
          bookmark:false,
        }
        if(data.type === "typing"){
          res.message = "typing..."
          setMessages(prev => [...prev, res])
        }
        if(data.type === "message"){
          
          setMessages(prev => [...prev.filter(item=> item.message != "typing..."), res])

        }
      }catch(e){
        console.error("WebSocket parse error", e);
      }
    }

    conversationRef.current.onclose = () =>{
      console.log("Socket disconnected");
      setIsConversationSocketConnected(false);
    }

  };

  const sendMessage = (msg) => {
    if(conversationRef.current?.readyState === WebSocket.OPEN){
      const payload = {
        message: msg.message,
        session_id: msg.session.id,
        type: "message"
      }
      conversationRef.current.send(JSON.stringify(payload));
      setMessages(prev => [...prev, msg]);
    }
  }

  const disconnectConversationSocket = () => {
    conversationRef.current.close();
    conversationRef.current = null;
  }



  const initiateNotificationSocket = (token) => {
    if(!(token)) return;
    const wsURL = WEBSOCKET_URL+`/ws/notifications/?token=${token}`;
    notificationRef.current = new WebSocket(wsURL);

    notificationRef.current.onopen = () => {
      console.log("notification socket connected");
      setIsConversationSocketConnected(true);
    }

    notificationRef.current.onmessage = (e) => {
      try{
        const data = JSON.parse(e.data);
        setNotifications(prev => [data.notification, ...prev])
        console.log(data)
      }catch(e){
        console.error("Notificatio webSocket parse error", e);
      }
    }

    notificationRef.current.onclose = (e) =>{
      console.log("Notification socket disconnected");
      console.log("CLOSED", e.code, e.reason);
      setIsConversationSocketConnected(false);
    }
  }

  const disconnectNotificationSocket = () => {
    notificationRef.current.close();
    notificationRef.current = null;
  }


  const [store, setStore] = useState({});
  const [session, setSession] = useState({});
  const [currentGoal, setCurrentGoal] = useState({})
  const [isOnboarding, setIsOnboarding] = useState(false);

  const updateSession = (sess) => {
    setSession(sess)
  }

  const updateStore = (data, control=true) => {
    if(control){
      // console.log("check, ", JSON.stringify(store, null, 2))
      const temp = JSON.stringify(store);
      const temp1 = JSON.stringify(data);
      setStore({...JSON.parse(temp), ...JSON.parse(temp1)})
    }
    else{
      setStore(data)
    }
  }

  // const setLocalStorage = async () => {
  //   await AsyncStorage.setItem('store', JSON.stringify(store));
  // }

  // useEffect(() => {
  //   setLocalStorage()
  // }, [store]);


  const logout =  () => {
    setIsAuthenticated(false);
    setIsPersonalized(false);
    setIsSubscribed(false);
    setStore({});
  };

  
  

  useEffect(() => {

    loadAuthToken((data) => { 
      console.log("AuthContext data", data);
      if (data.accessToken) {
        setIsAuthenticated(true);
        setStore(data.store || {});
        completePersonalization(data.store.onboarding_completed);
        completeSubscription(data.store?.payment?.is_active)
      } else {
        setIsAuthenticated(false);
        setStore({});
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      isPersonalized, 
      isSubscribed, 
      store,
      session,
      updateSession,
      currentGoal,
      setCurrentGoal,
      socket:{
        messages,
        setMessages,
        initiateConversationSocket,
        initiateNotificationSocket,
        sendMessage,
        disconnectConversationSocket,
        isNotificationSocketConnected,
        isConversationSocketConnected,
        disconnectNotificationSocket,
        notifications,
        setNotifications
      },
      login,
      logout, 
      completePersonalization, 
      completeSubscription,
      updateStore 
    }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};