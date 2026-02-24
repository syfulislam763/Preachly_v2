import React, { useCallback, useLayoutEffect, useState } from 'react'
import {View, Text, Image, StyleSheet, Pressable, ActivityIndicator, ImageBackground, TouchableWithoutFeedback, FlatList} from 'react-native'
import CommonButton from '../../../components/CommonButton'
import { SafeAreaView } from 'react-native-safe-area-context'
import { deepGreen, primaryText } from '../../../components/Constant'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
const img1 = require('../../../../assets/img/card_bg9.png');
const img2 = require('../../../../assets/img/card_bg10.png');
import { get_all_goals, get_current_goal } from '../TabsAPI'
import Indicator from '../../../components/Indicator'
import { useAuth } from '../../../context/AuthContext'
import ProgressBar from '../../../components/ProgressBar'

const scripture = require("../../../../assets/img/scripture.png")
const conversation = require("../../../../assets/img/conversation.png")
const share_faith = require("../../../../assets/img/share_faith.png")

const lavel = {
  "conversation":"Confidence Goal",
  "scripture": "Scripture Knowledge",
  "share_faith": "Inspiration Goal"
}

const goal_description = {
    conversation: {
        text1: "Confidence",
        text2: "Your Bold Flame is Growing!",
        text3:"Leveling up your boldness! Every question you face adds fuel to your fire, making you braver and brighter in sharing God's truth."
    },
    scripture: {
        text1: "Scripture Knowledge",
        text2: "Your Faith IQ is Rising!",
        text3:"Bible scholar in the making! Every verse sharpens your wisdom and fuels your faith, your spiritual library is stacking up strong."
    },
    share_faith: {
        text1: "Inspiration",
        text2: "Your Light is Reaching New Heights!",
        text3:"Look at you, planting flags of hope! Every share is a mountaintop moment, inspiring hearts and sparking faith in ways you might not even see."
    }
}

const images = {
    "conversation": conversation,
    "scripture": scripture,
    "share_faith": share_faith
}

const CurrentGoals = () => {
    const navigation = useNavigation()
    const [loading, setLoading] = useState(false);
    const [currentWeek, setCurrentWeek] = useState({});
    const [history, setHistory] = useState([]);
    const [week, setWeek] = useState(100)
    const {store} = useAuth();

    console.log(JSON.stringify(currentWeek, null, 2), "..")


    const renderItem = ({item, isCurrent = false}) => {
        const week_end = (item?.week_end)?timeAgo(item?.week_end):"";
        const week_start = (item?.week_start)?timeAgo(item?.week_start):""
        const current = isCurrent?"":"";
        const goals = item.goal || {}
        // const week_end = "";
        // const week_start = "";
        console.log(goals)
        return <Pressable style={{
            backgroundColor:'#ffffff'
        }} onPress={() => {
            
        }}>
            
            
            {/* {goals && <Card 
                index={1}
                progress={`${goals.progress_percentage}%`}
                title={goals.goal_display}
                text={`${goals?.current_count}/${goals?.target_count} completed`}
            />} */}

            <View style={{
                alignContent:'center'
            }}>
                <Text style={styles.title2}>{goal_description[goals.goal_type]?.text1}</Text>
                <View style={{height:14}}></View>
                <Text style={{...styles.text1, fontSize: 17}}>{goal_description[goals.goal_type]?.text2}</Text>
                <Text style={{...styles.text1, color:"#2B4752"}}>{goal_description[goals.goal_type]?.text3}</Text>

                <Image style={{
                    height: "40%",
                    width: "100%",
                    objectFit:"contain"
                }} source={images[goals?.goal_type]}/>
                <View style={{height:20}}></View>
                <Text 
                    style={{...styles.title2, fontSize: 16, textAlign:'center'}}
                >
                    {`${goals?.current_count}/${goals?.target_count} completed`}
                </Text>
                <View style={{height:20}}></View>
                {/* {backgroundColor:"#53381E",} */}
                {/* {backgroundColor:"#53381E33"} */}
                <ProgressBar filled={{}} container={{}} progress={`${goals.progress_percentage}`}/>
                <View style={{height:20}}></View>
                <Text style={styles.text1}>{`${week_start} - ${week_end} ${current}`}{" "}</Text>

                <Text style={styles.text1}>{`Remaining days ${item?.days_remaining}`}{" "}</Text>

            </View>
            
           
        </Pressable>
    }

    const timeAgo = (string) => {
        if(string == ""){
            return " "
        }
        const month_string = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        const now = new Date(string);
   
        const day = now.getUTCDate();
        const month = month_string[now.getUTCMonth()];
        const year = now.getUTCFullYear();
        return `${day} ${month} ${year}`
    }

    const handle_get_current_goal = () => {
     
        setLoading(true);
        get_current_goal((res, success) => {
            if(success){
                console.log(res,"res")
                setCurrentWeek(res?.data);
            }

            setLoading(false);
        })
    }


    useFocusEffect(
        useCallback(() => {
           handle_get_current_goal();
        }, [])
    )


  return (
        <SafeAreaView style={styles.container} >
            <View style={styles.subContainer}>

                
                <FlatList 
                    ListHeaderComponent={() => {
                        return renderItem({item: currentWeek, isCurrent:true})
                    }}
                    data={[]}
                    keyExtractor={(item, idx) => idx.toString()}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    // stickyHeaderIndices={[0]}
                />


                {/* <View>
                    <CommonButton
                        btnText={"Homepage"}
                        bgColor={deepGreen}
                        navigation={navigation}
                        route={""}
                        txtColor={primaryText}
                        bold='bold'
                        opacity={1}
                    />
                </View> */}
            </View>
            {loading && <Indicator visible={loading} onClose={() =>setLoading(false)}>
                <ActivityIndicator size={"large"}/>
            </Indicator>}
        </SafeAreaView>
  )
}



const Card = ({img, index = 0, title, text, progress}) => {

    return <ImageBackground
                    source={(index==1)?img2:img1}  // or use { uri: 'https://...' }
                    style={styles.background}
                    resizeMode="cover"
                >
                    <View style={{
                        padding:15,
                        justifyContent:'center',
                        alignItems:'center'
                    }}>
                        <Text style={(index==1)?{...styles.title, color:"#ffffff"}:{...styles.title}}>{title || "Memorize 5 Scriptures"}</Text>
                        <Text 
                            style={(index==1)?{...styles.text, color:"#ffffff99"}:{...styles.text}}
                        >
                            {text || "3/5 completed"}
                        </Text>
                    </View>
                </ImageBackground>
}

export default CurrentGoals


const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:'#fff',
    },
    subContainer:{
        height:"100%",
        paddingHorizontal:20,
        display:'flex',
        flexDirection:'column',
        justifyContent: 'space-between',
        paddingBottom: 20
    },
    
    background:{
        height:82,
        width:'100%',
        alignContent:"center",
        marginBottom:15,
        overflow:'hidden',
        borderRadius: 15,
    },

    card_wrap:{
        display:"flex",
        flexDirection:"row",
        alignItems:"center",
    },
    title2:{
        fontFamily:'DMSerifDisplay',
        fontSize:25,
        textAlign:'center',
        color:'#0B172A',
        marginTop: 20,
    },
    title:{
        fontFamily:"NunitoSemiBold",
        fontSize: 15,
        marginBottom: 7,
        color:"#0B172A"
    },
    text:{
        marginRight:"5%",
        fontFamily:"NunitoSemiBold",
        fontSize: 12,
        color:"#53381E"
    },
    progressContainer:{
        height:4,
        width:"100%",
        backgroundColor:"#53381E33",
        overflow:"hidden",
        borderRadius: 5,
    },
    innerBar:{
        height:4,
        width: "30%", 
        backgroundColor:"#53381E",
        borderRadius:5
    },
    text1: {
        fontFamily:"NunitoSemiBold",
        fontSize:15,
        color:"#0B172A",
        marginBottom:10,
        textAlign:'center'
    }
})
