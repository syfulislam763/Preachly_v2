import React, { useState } from 'react'
import {View, Text, StyleSheet, Image, FlatList, ActivityIndicator} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import Indicator from '../../../components/Indicator';
import { get_week_details_by_id } from '../TabsAPI';
import { useRoute } from '@react-navigation/native';
import { set } from 'date-fns';
import ReusableNavigation from '../../../components/ReusabeNavigation';
import BackButton from '../../../components/BackButton';
import { useNavigation, CommonActions } from '@react-navigation/native';

const WeeklyCheckIn_ = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState([]);
    const route = useRoute();

    const handleGetDetails = () =>{
        setLoading(true);
      
        get_week_details_by_id(route.params.week_number, (res, success) => {
            setLoading(false);
            if(success){
                setQuestions(res.data.questions_and_answers);
            }else{
             
            }
        })
    }


    useState(() =>{
        handleGetDetails()
    }, [])


    const renderItem = ({item}) => {
        return <View style={styles.cardWrapper}>
            <View style={styles.cardContainer}>
                <View style={styles.cardSubContainer1}>
                    <Text style={styles.number}>{item.question_order}.</Text>
                </View>
                <View style={styles.cardSubContainer2}>
                    <Text style={styles.title}>{item.question_text}</Text>
                    <Text style={styles.text}>Your Answer: <Text style={{fontFamily:"NunitoBold"}}>{item.selected_answer.option_text}</Text></Text>
                </View>
            </View>
        </View>
    }


  return (
    <SafeAreaView style={{flex:1, backgroundColor:'#fff'}}>
        <ReusableNavigation 
            leftComponent={() => <BackButton navigation={navigation} 
                cb={() => {

                    if(route.params.flag){
                        navigation.dispatch(state => {
                            const routes = state.routes.slice(0, -4);
                            routes.push({
                                name: "WeeklyCheckIn"
                            });
                            return CommonActions.reset({
                                ...state,
                                index: routes.length -1,
                                routes
                            })

                        })
                    }else{
                        navigation.goBack();
                    }
               
                
                }}
            />}
            middleComponent={() =><Text style={{
                fontFamily: 'NunitoBold',
                color: '#0b172A',
                fontSize: 18
                }}
            >
            {route?.params?.title}{" "}
        </Text>}
            RightComponent={()=>{return <View></View>}}
            backgroundStyle={{backgroundColor:'#ffffff'}}
        />


        <FlatList
            data={questions} 
            keyExtractor={item => item.answered_at}
            showsVerticalScrollIndicator={false}
            renderItem={renderItem}

        />


    

        {loading && <Indicator visible={loading} onClose={()=>setLoading(false)}>
            <ActivityIndicator size={"large"}/>
        </Indicator>}
    </SafeAreaView>
  )
}

export default WeeklyCheckIn_


const styles = StyleSheet.create({
    cardWrapper:{
        borderBottomWidth:1,
        borderBottomColor:'#ddd'
    },
    cardContainer:{
        display:'flex',
        flexDirection:'row',
        alignItems:'flex-start',
        justifyContent:'space-between',
        padding:20
    },
    title:{
        color:'#0B172A',
        fontFamily:'NunitoBold',
        fontSize: 18,
    },
    text:{
        fontFamily:'NunitoSemiBold',
        fontSize:16,
        color:'#2B4752'
    },
    number:{
        fontFamily:'NunitoBold',
        fontSize: 18,
        color:'#966F44'
    },
    cardSubContainer1:{
        width:"10%",
    },
    cardSubContainer2:{
        width:"90%"
    }
})