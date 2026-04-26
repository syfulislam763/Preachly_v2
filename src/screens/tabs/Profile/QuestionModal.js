import React, { useEffect, useState } from 'react'
import { View, Text, ActivityIndicator, Dimensions } from 'react-native'

const { height: windowHeight } = Dimensions.get('window')
import CommonButton from '../../../components/CommonButton'
import { deepGreen, primaryText } from '../../../components/Constant'
import CustomModal from '../../../components/CustomModal'
import ProgressBar from '../../../components/ProgressBar'
import FaithQuestionSlider from '../../../components/FaithQuestionSlider'
import useLayoutDimention from '../../../hooks/useLayoutDimention'
import Indicator from '../../../components/Indicator'
import { get_weekly_check_in_questions, save_weekly_check_in } from '../TabsAPI'

const QuestionModal = ({ modalVisible, setModalVisible, navigation }) => {

  const [allQuestions, setAllQuestions] = useState([])
  const [btnTxt, setBtnTxt] = useState("Next")
  const [ans, setAns] = useState({})
  const [currentQuestion, setCurrentQuestion] = useState({
    "question": "",
    "order": 1,
    "id": 41,
    "options": [
      { "id": 201, "option_text": "Not at all",          "option_order": 1 },
      { "id": 202, "option_text": "Hesitant",            "option_order": 2 },
      { "id": 203, "option_text": "Growing in boldness", "option_order": 3 },
      { "id": 204, "option_text": "Mostly confident",    "option_order": 4 },
      { "id": 205, "option_text": "Completely confident","option_order": 5 },
    ],
    "ans": 0,
    "option_ans": 201
  })
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)

  const { isSmall } = useLayoutDimention()

  const [loading, setLoading] = useState(false)
  const [weeklyCheckInId, setWeeklyCheckInId] = useState({})
  const [responses, setResponses] = useState([])

  const handle_all_questions = () => {
    setLoading(true)
    get_weekly_check_in_questions((res, success) => {
      setLoading(false)
      if (success) {
        let temp = res?.data?.questions ?? []

        temp = temp.map(item => ({
          question: item?.question_text,
          order: item?.question_order,
          id: item?.id,
          options: (item?.options ?? []).sort((a, b) => a.option_order - b.option_order),
          ans: 0,
          option_ans: (item?.options ?? []).sort((a, b) => a.option_order - b.option_order)[0].id
        }))

        setAllQuestions(temp.sort((a, b) => a.order - b.order))
        setCurrentQuestion(temp[currentQuestionIndex])
        setAns(temp[currentQuestionIndex]?.options[currentQuestionIndex])
        setWeeklyCheckInId({
          weekly_check_in_id: res.data.weekly_checkin_id,
          week_number: res?.data.week_number
        })
      }
    })
  }

  const handle_save_questions = () => {
    const payload = {
      weekly_checkin_id: weeklyCheckInId.weekly_check_in_id,
      responses: [...responses, { "question": currentQuestion.id, "selected_option": ans.id }]
    }

    setLoading(true)
    save_weekly_check_in(payload, (res, success) => {
      setLoading(false)
      if (success) {
        setModalVisible(false)
        navigation.navigate("PorfileFaith", { week_number: res?.data?.week_number, modal_info: res?.data?.newly_earned_badge })
      }
    })
  }

  useEffect(() => {
    handle_all_questions()
  }, [])

  const handleNext = () => {
    if (currentQuestionIndex < 9) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setCurrentQuestion(allQuestions[currentQuestionIndex + 1])
      setResponses(prev => [{ "question": currentQuestion.id, "selected_option": ans.id }, ...prev])
    } else {
      handle_save_questions()
    }
  }

  return (
    <CustomModal
      visible={modalVisible}
      onClose={() => setModalVisible(false)}
      animationType='slide'
      overlayStyle={{ backgroundColor: '#fff', flex: 1, paddingTop: 0 }}
      modalContainerStyle={{
        elevation: 0,
        backgroundColor: "#fff",
        width: "110%",
        height: windowHeight-150,
        paddingVertical: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
      }}
      title={() => (
        <Text style={{ fontFamily: 'NunitoBold' }}>
          {currentQuestionIndex + 1}/10
        </Text>
      )}
      headerStyle={{ paddingHorizontal: 20, paddingVertical: 10 }}
    >

      {/* Progress bar */}
      <View className="py-2.5 px-5">
        <ProgressBar progress={(1 + currentQuestionIndex) * 10} />
      </View>

      {/* Question text — fontSize is responsive so kept inline */}
      <View className="mb-0 h-36">
        <Text
          style={{
            fontFamily: 'NunitoBold',
            fontSize: isSmall ? 16 : 18,
          }}
          className="text-center py-[30px] px-5 flex-wrap"
        >
          {currentQuestion?.question}
        </Text>
      </View>

      {/* Slider */}
  
    <FaithQuestionSlider
        Answers={currentQuestion?.options}
        selectedOption={currentQuestion?.ans}
        ans={ans}
        setAns={a => setAns(a)}
    />
  

      {/* Hint — hidden on small screens */}
      {(
        <Text
          style={{ fontFamily: 'NunitoSemiBold' }}
          className="px-20 text-[#80ADAA] text-base text-center"
        >
          Click on each dot to change the answer
        </Text>
      )}

      {/* Button */}
      <View className="px-5 py-5 mt-20">
        <CommonButton
          btnText={btnTxt}
          bgColor={deepGreen}
          navigation={navigation}
          route={""}
          txtColor={primaryText}
          bold='bold'
          handler={() => handleNext()}
          opacity={loading?0.6:1}
          disabled={loading}
        />
      </View>


    </CustomModal>
  )
}

export default QuestionModal