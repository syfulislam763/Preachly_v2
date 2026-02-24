import React, { useEffect, useState } from 'react'
import {View, Text, StyleSheet, Image, Dimensions, ActivityIndicator} from 'react-native'
import CommonButton from '../../../components/CommonButton'
import { deepGreen, primaryText } from '../../../components/Constant'
import { useNavigation } from '@react-navigation/native'
import CustomModal from '../../../components/CustomModal'
import ProgressBar from '../../../components/ProgressBar'
import FaithQuestionSlider from '../../../components/FaithQuestionSlider'
import { SafeAreaView } from 'react-native-safe-area-context'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import useLayoutDimention from '../../../hooks/useLayoutDimention';
import Indicator from '../../../components/Indicator';
import { get_weekly_check_in_questions, save_weekly_check_in } from '../TabsAPI'


const QuestionModal = ({modalVisible, setModalVisible, navigation}) => {


    const [allQuestions, setAllQuestions] = useState([])
    const [btnTxt, setBtnTxt] = useState("Next");
    const [ans, setAns] = useState({})
    const [currentQuestion, setCurrentQuestion]=useState({
        "question": "",
        "order": 1,
        "id": 41,
        "options": [
            {
            "id": 201,
            "option_text": "Not at all",
            "option_order": 1
            },
            {
            "id": 202,
            "option_text": "Hesitant",
            "option_order": 2
            },
            {
            "id": 203,
            "option_text": "Growing in boldness",
            "option_order": 3
            },
            {
            "id": 204,
            "option_text": "Mostly confident",
            "option_order": 4
            },
            {
            "id": 205,
            "option_text": "Completely confident",
            "option_order": 5
            }
        ],
        "ans": 0,
        "option_ans": 201
    })
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

    const {isSmall, isMedium, isLarge, isFold} = useLayoutDimention();

    const [loading, setLoading] = useState(false);
    const [weeklyCheckInId, setWeeklyCheckInId] = useState({});
    const [responses, setResponses] = useState([])

    const handle_all_questions = () => {
        setLoading(true);
        get_weekly_check_in_questions((res, success) => {
            setLoading(false);
            if(success){
                let temp = res.data.questions;
                
                temp = temp.map(item => {
                    return {
                        question: item.question_text,
                        order: item.question_order,
                        id: item.id,
                        options: item.options.sort((a,b) => a.option_order-b.option_order),
                        ans: 0,
                        option_ans: item.options.sort((a,b) => a.option_order-b.option_order)[0].id
                    }
                });


                setAllQuestions(temp.sort((a,b) =>  a.order - b.order));
                setCurrentQuestion(temp[currentQuestionIndex])
                setAns(temp[currentQuestionIndex]?.options[currentQuestionIndex])
                setWeeklyCheckInId({weekly_check_in_id: res.data.weekly_checkin_id, week_number:res?.data.week_number})
            }else{
             
            }

        })
    }


    const handle_save_questions = () => {
        const payload = {
            weekly_checkin_id: weeklyCheckInId.weekly_check_in_id,
            responses: [...responses, {"question": currentQuestion.id, "selected_option": ans.id}]
        };

        setLoading(true);
        save_weekly_check_in(payload, (res, success) => {
            setLoading(false);
            if(success){
                setModalVisible(false),
                navigation.navigate("PorfileFaith", {week_number: res?.data?.week_number})
            }else{
           
            }
        })


    
    }

    useEffect(()=>{
        handle_all_questions();
        // setAllQuestions(questions)
        // setCurrentQuestion(questions[currentQuestionIndex])
        // setAns(questions[currentQuestion]?.options[currentQuestionIndex])
    },[])


   


    const handleNext = () =>{
        if(currentQuestionIndex<9){
            setCurrentQuestionIndex(currentQuestionIndex+1)
            setCurrentQuestion(allQuestions[currentQuestionIndex+1])
            setResponses(prev => [{"question": currentQuestion.id, "selected_option": ans.id}, ...prev])
        }
        else{
            handle_save_questions();
        }
    }


    return <CustomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        animationType='slide'
        overlayStyle={{backgroundColor:'#fff', flex:1, paddingTop:0}}
        modalContainerStyle={{
            elevation: 0,
            backgroundColor:"#fff",
            width: "110%",
            height:window.height,
            flex:1,
            paddingVertical:0
        }}
        title={() => <Text style={{fontFamily:'NunitoBold'}}>{currentQuestionIndex+1}/10</Text>}
        headerStyle={{paddingHorizontal:20, paddingVertical:10}}
    >
        <View style={{paddingVertical:10,paddingHorizontal:20}}>
            <ProgressBar progress={(1+currentQuestionIndex)*10}/>
        </View>
        <View style={{
            // maxHeight: hp("20%"),
            // backgroundColor:'red',
            // flexWrap:'wrap'
        }}>
            <Text style={{
                fontFamily:'NunitoBold',
                fontSize: isSmall?16:18,
                textAlign:'center',
                paddingVertical: isSmall?30:30,
                paddingHorizontal:20,
                flexWrap:'wrap'
            }}>{currentQuestion?.question}</Text>
        </View>
        
        <FaithQuestionSlider
            Answers={currentQuestion?.options}
            selectedOption={currentQuestion?.ans}
            ans={ans}
            setAns={a=> setAns(a)}
        />
        
        {!isSmall && <Text style={{paddingHorizontal:60, paddingBottom:30,color:'#80ADAA', fontFamily:'NunitoSemiBold', fontSize:16, textAlign:'center'}}>
            Drag the slider left or right to change the answer
        </Text>}

        <View style={{paddingHorizontal:20, paddingBottom:0}}>
            <CommonButton
                btnText={btnTxt}
                bgColor={deepGreen}
                navigation={navigation}
                route={""}
                txtColor={primaryText}
                bold='bold'
                handler={() => handleNext()}
                opacity={1}
            />
        </View>



        {loading && <Indicator visible={loading} onClose={()=>setLoading(false)}>
            <ActivityIndicator size={"large"}/>
        </Indicator>}
    </CustomModal>

}


export default QuestionModal