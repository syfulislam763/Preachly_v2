import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity ,Image, Pressable} from 'react-native';
import { FontAwesome, MaterialIcons, Feather } from '@expo/vector-icons';
import IconContainer from '../../../components/IconContainer';
import AudioPlayerCard from '../Message/AudioPlayCard';
import TypingIndicator from '../Message/TypingIndicator';

const cpy1 = require("../../../../assets/img/24-copy.png")
const cpy2 = require("../../../../assets/img/Copy.png")
const HistoryConversations = ({ type = 'user', message,message_id, verseLink, methods, item, currentId, playSound, stopSound, isTyping, onPredefinedMsg=()=>{}}) => {
  
  const [isCopied, setIsCopied] = useState(false);
  const handleCopy = () => {
    setIsCopied(true);
    methods?.handleCopy(message)
    const timer = setTimeout(() => {
      setIsCopied(false);
      clearTimeout(timer);
    }, 1000)
  }
  
  return (
    <View style={styles.container}>
      {/* User Message */}
      {type === 'user' && (
        <View style={styles.userBubble}>
          <Text style={{...styles.userText, color:"#ffffff"}}>{message}{" "}</Text>
        </View>
      )}

      {type==="audio" && (
        <View style={{
          alignSelf:"flex-end"
        }}>
          <AudioPlayerCard currentId={currentId} playSound={playSound} stopSound={stopSound} item={item}/>
        </View>
      )}

      {/* Bot Message */}
      {type==="wave" && <TypingIndicator isTyping={type==="wave"}/>}

      {type === 'bot' && (
        <View style={styles.botContainer}>
          <View style={styles.botBubble}>
            <Text style={styles.botText}>
              {message}
              {/* <Text style={styles.linkText}>{verseLink}</Text> */}
            </Text>

            {item?.summary?.length>0 && <Text style={styles.botText}>{"\n"} Summary: </Text>}
            {item?.summary && item?.summary.map((text, idx) => <Text key={idx} style={styles.botText}>{text}</Text>)}
          </View>

          {/* Icon Actions */}
          {message != "typing..." && <View style={styles.actions}>
            <IconContainer
                containerStyle={{width:50}}
                onPress={() => methods.handleBookmark(message_id)}
            >
              {
                item.bookmark?<Image
                  source={require("../../../../assets/img/Bookmark1.png")}
                  style={{...styles.minIcon}}
                />:<Image 
                    source={require("../../../../assets/img/24-bookmark.png")}
                    style={{...styles.minIcon}}
                />
              }
                
            </IconContainer>
           
            <IconContainer onPress={() => handleCopy()}>
                
              <Image 
                source={isCopied?cpy2:cpy1}
                style={{...styles.minIcon}}
              />
              <Text style={{...styles.text}}>Copy</Text>
               
            </IconContainer>

            <IconContainer onPress={()=> methods.handleShare(message)}>
                <Image 
                    source={require("../../../../assets/img/24-share_.png")}
                    style={{...styles.minIcon}}
                />
                <Text style={{...styles.text}}>Share</Text>
            </IconContainer>

            {/* <IconContainer
                containerStyle={{width:50}}
                onPress={() => methods.handleRegenerate()}
            >
                <Image 
                    source={require("../../../../assets/img/24-retry.png")}
                    style={{...styles.minIcon}}
                />
            </IconContainer> */}


          </View>}



        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16 },

  // User message style
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#005A55',
    padding: 12,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius:16,
    maxWidth: '100%',
    color:'white'
  },
  userText: { color: 'white', fontSize: 16 },

  // Bot message styles
  botContainer: { alignItems: 'flex-start' },
  botBubble: {
    backgroundColor: '#fff',
    padding: 12,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomRightRadius:16,
    borderWidth:1,
    borderColor:'#ACC6C5',
    maxWidth: '100%',
    
  },
  botText: { fontSize: 16, color: '#0B172A',fontFamily:'NunitoSemiBold' },
  linkText: {color: '#005A55',fontFamily:'NunitoBold', textDecorationLine: 'underline' },

  // Icons row
  actions: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 7,
    paddingLeft: 4,
    marginBottom: 10
  },
  icon: {
    color: '#666',
  },
  text:{
    color:'#0B172A',
    fontFamily:'NunitoSemiBold',
    fontSize:14,
    marginLeft: 5
  },
  minIcon:{
    height:24,
    width:24,
    objectFit:'contain'
  },
  // Prompt
  promptContainer: {
    marginTop: 12,
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomRightRadius:16,
    borderWidth:1,
    borderColor:'#ACC6C5',
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignSelf: 'flex-start',
    width: "60%"
  },
  promptText: { fontSize: 16, marginBottom: 16, color: '#0B172A',fontFamily:'NunitoSemiBold' },
  promptButtons: { flexDirection: 'row', gap: 12 },
  promptButton: {
    backgroundColor: '#e5e5e5',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  promptButtonText: { color: '#0B172A',fontFamily:'NunitoSemiBold' },
});

export default HistoryConversations;
