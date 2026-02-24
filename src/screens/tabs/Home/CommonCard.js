import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import {View, Text, Image, StyleSheet, Pressable, ActivityIndicator, ImageBackground, TouchableWithoutFeedback, FlatList} from 'react-native'
import CommonButton from '../../../components/CommonButton'
import { SafeAreaView } from 'react-native-safe-area-context'
import { deepGreen, primaryText } from '../../../components/Constant'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { get_weekly_check_in_history } from '../TabsAPI';
import Indicator from '../../../components/Indicator';
import Entypo from '@expo/vector-icons/Entypo';


const img2 = require('../../../../assets/img/card_bg10.png');
const img4 = require('../../../../assets/img/card_bg11.png');
const bookOpen = require('../../../../assets/img/BookOpen.png');

const CommonCard = ({index =0, title="", text="", onPress=()=>{}}) => {
    const navigation = useNavigation()
 
    const [loading, setLoading] = useState(false);

    // },[navigation])
    const timeAgo = (string) => {
        const month_string = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        const now = new Date(string);
        const day = now.getUTCDay();
        const month = month_string[now.getUTCMonth()];
        const year = now.getUTCFullYear();
        return `${day} ${month} ${year}`
    }

 

  return (
        <>
            <Pressable onPress={() => {
                    onPress();
                }}>
                <ImageBackground
                    source={index?img4:img2}  // or use { uri: 'https://...' }
                    style={styles.background}
                    resizeMode="cover"
                >
                    <View style={styles.card}>
                        <View style={{
                                width: 30,
                            }}>
                                <Image
                                    source={bookOpen}
                                    style={{
                                        height: 23,
                                        width: 23,
                                        objectFit:'contain',
                                    }}
                                />
                        </View>
                        <View style={{width:"75%"}}>
                            <Text style={{...styles.title, color:"#ffffff"}}>{title}</Text>
                            <Text style={{...styles.text, color:"#90B2B2"}}>{text}</Text>
                        </View>
                        
                        
                        <View style={{}}>
                            <Entypo name="chevron-thin-right" size={24} color="white" />
                        </View>

                    </View>
                </ImageBackground>
            </Pressable>
            {loading && <Indicator visible={loading} onClose={() => setLoading(false)}>
                <ActivityIndicator size={'large'}/>
            </Indicator>}
        </>
  )
}

export default CommonCard;


const styles = StyleSheet.create({
    container: {
        // flex:1,
        // backgroundColor:'#fff',
        height:102,
    },
    subContainer:{
        // height:"100%",
        // paddingHorizontal:20,
        // display:'flex',
        // flexDirection:'column',
        // justifyContent: 'space-between',
        // paddingBottom: 100
    },
    background:{
        
        height:102,
        width:'100%',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:"center",
        marginBottom:20,
        overflow:'hidden',
        borderRadius: 15,
    },
    card:{
        display:'flex',
        flexDirection:'row',
        alignItems:'flex-start',
        justifyContent:'space-between',
        paddingHorizontal: 10,
        paddingVertical: 10,
        width:"100%"
    },
    card_wrap:{
        display:'flex',
        flexDirection:'row',
        alignItems:'flex-start',
        width:"92%",
        justifyContent:"flex-start"
    },
    title:{
        fontFamily:'NunitoSemiBold',
        fontSize:15,
        color:"#B172A"
    },
    text: {
        fontFamily:"NunitoSemiBold",
        fontSize:12,
        color:"#966F44",
        marginTop: 3,
    },
})
