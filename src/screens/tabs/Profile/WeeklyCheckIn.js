import React, { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import {View, Text, Image, StyleSheet, Pressable, ActivityIndicator, ImageBackground, TouchableWithoutFeedback, FlatList} from 'react-native'
import CommonButton from '../../../components/CommonButton'
import { SafeAreaView } from 'react-native-safe-area-context'
import { deepGreen, primaryText } from '../../../components/Constant'
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { get_weekly_check_in_history } from '../TabsAPI';
import Indicator from '../../../components/Indicator';
import Entypo from '@expo/vector-icons/Entypo';

const img1 = require('../../../../assets/img/card_bg8.png');

const img4 = require('../../../../assets/img/card_bg11.png');
const leaf_b = require('../../../../assets/img/leaf_b.png');
const leaf_w = require('../../../../assets/img/leaf_w.png');

const WeeklyCheckIn = () => {
    const navigation = useNavigation()
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(false);

    console.log("historty", JSON.stringify(history, null, 2))

    const timeAgo = (string) => {
        const month_string = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        const now = new Date(string);
        const day = now.getUTCDay();
        const month = month_string[now.getUTCMonth()];
        const year = now.getUTCFullYear();
        return `${day} ${month} ${year}`
    }

    const handleGetHistory = () => {
        setLoading(true);
        get_weekly_check_in_history((res, success) => {
            setLoading(false);
            if(success){
                setHistory(res?.data?.completed_weekly_checkins.filter(item => item.status != "locked"))
            }else{
          
            }
            
        })
    }
    
    useFocusEffect(
        useCallback(() => {
            handleGetHistory();
        }, [])
    )




    const renderItem = ({item, index}) => {

        return <Pressable style={{
            // height:80,
            // width:'100%',
            // overflow:"hidden",
            // borderRadius: 30
        }} onPress={() => {
            if(item.is_completed){
                navigation.navigate("WeeklyCheckIn_", {...item, title: item.week_number+" Weekly Check-In"})
            }else{
                navigation.navigate("RegularCheckIn", {title: item.week_number+" Weekly Check-In"})
            }
        }}>
                <ImageBackground
                    source={(index%2==0)?img1:img4}  // or use { uri: 'https://...' }
                    style={styles.background}
                    resizeMode="cover"
                >
                    <View style={styles.card}>

                        <View style={styles.card_wrap}>
                            <View style={{
                                width: 30,
                            }}>
                                <Image
                                    source={(index%2==0)?leaf_b:leaf_w}
                                    style={{
                                        height: 24,
                                        width: 24,
                                        objectFit:'contain',
                                    }}
                                />
                            </View>
                            <View>
                                <Text style={(index%2==0)?{...styles.title}: {...styles.title, color:"#ffffff"}}>{(history.length-item.week_number)+1}. Week Check-In</Text>
                                <Text style={(index%2==0)?{...styles.text}: {...styles.text, color:"#90B2B2"}}>{item?.completed_at?timeAgo(item?.completed_at):"Available"}</Text>
                            </View>
                        </View>

                        <View>
                            <Entypo name="chevron-thin-right" size={24} color="white" />
                        </View>

                    </View>
                </ImageBackground>
            </Pressable>
    }


  return (
        <SafeAreaView style={styles.container} >
            <View style={styles.subContainer}>
                <View>

                    
                    <FlatList
                        data={history.sort((a,b)=> b.week_number-a.week_number)}
                        keyExtractor={(item) => item.week_number}
                        renderItem={renderItem}
                        contentContainerStyle={{
                            paddingTop: 15,
                            paddingBottom: 20, // leave space for input
                        }}
                        
                        showsVerticalScrollIndicator={false}
                        
                        
                    />



                    
                </View>

                <View>
                    {/* <CommonButton
                        btnText={"Homepage"}
                        bgColor={deepGreen}
                        navigation={navigation}
                        route={""}
                        txtColor={primaryText}
                        bold='bold'
                        opacity={1}
                    /> */}
                </View>
            </View>
            {loading && <Indicator visible={loading} onClose={() => setLoading(false)}>
                <ActivityIndicator size={'large'}/>
            </Indicator>}
        </SafeAreaView>
  )
}

export default WeeklyCheckIn


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
        paddingBottom: 100
    },
    background:{
        height:82,
        width:'100%',
        flexDirection:'row',
        alignItems:'center',
        marginBottom:20,
        overflow:'hidden',
        borderRadius: 15
    },
    card:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
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
        fontSize:16,
        color:"#B172A"
    },
    text: {
        fontFamily:"NunitoSemiBold",
        fontSize:12,
        color:"#966F44",
        marginTop: 3,
    },
})
