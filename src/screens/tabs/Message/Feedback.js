import React, { useState } from 'react'
import { View, Text, StyleSheet, Image, Pressable } from 'react-native';
import CustomModal from '../../../components/CustomModal';
import CommonButton from '../../../components/CommonButton';
import { deepGreen, primaryText } from '../../../components/Constant';
import { useNavigation } from '@react-navigation/native';
import Foundation from '@expo/vector-icons/Foundation';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';


const Feedback = ({visible, onClose, feedback, setFeedback}) => {

    const navigation = useNavigation()

    const [liked, setLiked] = useState(false);
    const [toggle, setToggle] = useState(false);
  
  return (
    <CustomModal
        visible={visible}
        onClose={onClose}
        headerStyle={{
            paddingHorizontal: 10
        }}
    >
        <View style={{
            paddingHorizontal: 20
        }}>
            <Text style={styles.title}>
                Was this chat helpful?
            </Text>

        
            <View style={{
                display:'flex',
                flexDirection:'row',
                alignItems:'center',
                justifyContent:'center',
                marginVertical: 30
            }}>
                {/* <Image
                    source={require("../../../../assets/img/ThumbsUp.png")}
                    style={styles.star}
                /> */}
                <Pressable onPress={() => {
                    setLiked(true);
                    setToggle(false);
                }} style={{
                    marginRight: "10%"
                }}>
                    <Foundation name="like" size={50} color={liked?"green":"black"} />
                </Pressable>
           
                <Pressable onPress={() => {
                    setLiked(false);
                    setToggle(true)
                }}>
                    <Foundation name="dislike" size={50} color={toggle?"green":"black"} />
                </Pressable>
                
                {/* <Image
                    source={require("../../../../assets/img/ThumbsDown.png")}
                    style={[styles.star,{marginRight:0}]}
                /> */}
            </View>

            <View style={{paddingBottom:20}}>
                <CommonButton
                    btnText={"Submit"}
                    bgColor={deepGreen}
                    navigation={navigation}
                    route={""}
                    txtColor={primaryText}
                    bold='bold'
                    handler={() => setFeedback(liked)}
                    opacity={(liked|toggle)?1:0.7}
                />
            </View>
        </View>
    </CustomModal>
  )
}

export default Feedback

const styles = StyleSheet.create({
    star:{
        height:40,
        width:40,
        objectFit:'contain',
        marginRight:20,
        marginVertical: 30
    },
    title: {
        fontFamily:"DMSerifDisplay",
        fontSize:30,
        color:'#0B172A',
        marginBottom: 0,
        textAlign:'center'
    },
    subtitle:{
        color:'#3F5862',
        fontFamily:'NunitoSemiBold',
        fontSize:16,
        textAlign:'center'
    },

})
