import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  TextInput,
  Platform,
  Image,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import DatePicker from './PersonalInfoUtils/DatePicker';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import CommonButton from '../../../components/CommonButton';
import { deepGreen, lightgreen1 } from '../../../components/Constant';
import { useNavigation } from '@react-navigation/native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp, widthPercentageToDP} from 'react-native-responsive-screen'
import {get_profile_info, update_profile_info} from '../../auth/AuthAPI'
import { 
  post_onboarding_user_data
 } from '../../personalization/PersonalizationAPIs';
 import ProfileImage from './PersonalInfoUtils/ProfileImage';
 import DropdownModal from './PersonalInfoUtils/DropdownModal';
 import useLayoutDimention from '../../../hooks/useLayoutDimention';
 import { getStyles } from './PersonalInfoUtils/PersonalInfoStyle';
 import useStaticData from '../../../hooks/useStaticData';
 import useLogout from '../../../hooks/useLogout'
import { useRoute } from '@react-navigation/native';
import { useAuth } from '../../../context/AuthContext';
import Indicator from '../../../components/Indicator';
import { handleToast } from '../../auth/AuthAPI';
import dayjs from 'dayjs';

//     "conversation" = Confidence Goal
// "scripture" = Scripture Knowledge
// "share_faith" = Inspiration Goal
const goals = {
  "conversation":"Confidence Goal",
  "scripture": "Scripture Knowledge",
  "share_faith": "Inspiration Goal"
}
const PersonalInfo = () => {
  useLogout();
  const {store, updateStore} = useAuth()
  const {
    denominations,
    bible_versions,
    tone_preference_data,
    faith_journey_reasons,
    bible_familiarity_data,
    faith_goal_questions
  } = store;

  const faith_goal = [
    {
      id:1,
      goal_type: "conversation",
      name: "Confidence Goal"
    },
    {
      id:2,
      goal_type: "scripture",
      name: "Scripture Knowledge"
    },
    {
      id:3,
      goal_type: "share_faith",
      name: "Inspiration Goal"
    },
  ]
  
  const route = useRoute()
  const {isSmall, isMedium, isLarge, isFold} = useLayoutDimention()
  const styles = getStyles(isSmall, isMedium, isLarge, isFold)
  const navigation = useNavigation()
  const [editMode, setEditMode] = useState(false)
  
  const [modalVisible, setModalVisible] = useState(false);
  const [bibleModalVisible, setBibleModalVisible] = useState(false);
  const [toneModalVisible, setToneModalVisible] = useState(false)
  const [faithGoalVisible, setFaithGoalVisible] = useState(false)
  const [depthAnsVisible, setDepthAnsVisible] = useState(false)

  const [name, setName] = useState('Alice');
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState('example@gmail.com');
  const [img, setImg] = useState(null);
  const [imageData, setImageData] = useState({});

  const handleDob = (val) => {
    setDob(val)
  }

  const [selectedBibleVersion, setSelectedBibleVersion] = useState({});
  const [selectedDenomination, setSelectedDenomination] = useState({});
  const [tone, setTone] = useState({});
  const [faithGoal, setFaithGoal] = useState({});
  const [Answer, setAnswer] = useState({});
  const [faithGoalQuestionOne, setFaithGoalQuestionOne] = useState({});
  const [faithGoalQuestionTwo, setFaithGoalQuestionTwo] = useState({});
  const [faithGoalQuestionThree, setFaithGoalQuestionThree] = useState({});
  const [faithGoalQuestionOneVisible, setFaithGoalQuestionOneVisible] = useState(false);
  const [faithGoalQuestionTwoVisible, setFaithGoalQuestionTwoVisible] = useState(false);
  const [faithGoalQuestionThreeVisible, setFaithGoalQuestionThreeVisible] = useState(false);


  const [loading, setLoading] = useState(false);
  const handleFaithGoalQuestionOne = (option) => {
    Keyboard.dismiss();
    setFaithGoalQuestionOne(option)
  }
  const handleFaithGoalQuestionTwo = (option) => {
    Keyboard.dismiss();
    setFaithGoalQuestionTwo(option)
  }
  const handleFaithGoalQuestionThree = (option) => {
    Keyboard.dismiss();
    setFaithGoalQuestionThree(option)
  }

  const handleSelect = (option) => {
    Keyboard.dismiss();
    setSelectedDenomination(option);
    // setModalVisible(false);
  };

  const handleSelect1 = (option) => {
    Keyboard.dismiss();
    setSelectedBibleVersion(option);
    // setBibleModalVisible(false)
  };
  const handleTone = (option) => {
    Keyboard.dismiss();
    setTone(option)
  }
  const handleFaithGoal = (option) => {
    Keyboard.dismiss();
    setFaithGoal(option)
  }
  const handleAnswer = (option) => {
    Keyboard.dismiss();
    setAnswer(option)
  }


  const handleSaveUserInfo = () => {

    const payload  = {

      denomination: {
        "denomination_option": selectedDenomination?.id
      },
      goal_preference: {
        goal_type: faithGoal?.goal_type
      },
    
      tone_preference: {
        "tone_preference_option": tone?.id
      },
      bible_familiarity: {
        "bible_familiarity_option": Answer?.id
      },
      bible_version: {
        "bible_version_option": selectedBibleVersion?.id
      }
    }


    const oldEmail = store?.profileSettingData?.userInfo?.email;
    const oldDOB = store?.profileSettingData?.userInfo?.date_of_birth;
    const oldName = store?.profileSettingData?.userInfo?.name;
    const oldImage = store?.profileSettingData.userInfo?.profile_picture;

    let profileInfo_payload = new FormData();

    if(oldEmail != email)
      profileInfo_payload.append("email", email);

    if(dob)
      profileInfo_payload.append("date_of_birth", dob);


    if(name)
      profileInfo_payload.append("name", name);
    
    if(oldImage != img && img)
      profileInfo_payload.append("profile_picture", {
        uri: imageData?.uri || " ",
        name: imageData?.fileName || " ",
        type: imageData?.mimeType || " "
      })
    

  
      
    console.log(payload)
 
    setLoading(true)
    post_onboarding_user_data(payload, (res, success) => {
      if(success){
        update_profile_info(profileInfo_payload, (response, isOk) => {
          if(isOk){            
            const profileSettingData = {
              userInfo:{...response?.data} || {},
              denomination: selectedDenomination || {},
              bible_version: selectedBibleVersion || {},
              tone_preference: tone || {},
              goal_preference: faithGoal || {},
              bible_familiarity: Answer || {},
            }
         
            const faith_goal_questions = undefined

            const oldEmail = store?.profileSettingData?.userInfo?.email
            setLoading(false)

            if(oldEmail != email){
              profileSettingData['userInfo'] = {...response?.data?.profile, email: response?.data?.temp_email}
              
              navigation.navigate("ConfirmEmail", {email: email, change:true, profileSettingData,faith_goal_questions })
            }else{
          
              updateStore({profileSettingData, faith_goal_questions})
              navigation.goBack()
            }

          }else{
           
            console.log(profileInfo_payload)
            setLoading(false)
            handleToast("error", "Faild to update profile", 3000, ()=>{});
            console.log("error man", JSON.stringify(response, null, 2))
          }
        })
      }else{
        handleToast("error", "Faild to onboarding data", 3000, ()=>{})
        setLoading(false)
      }
    })
     


  }


  useEffect(() => {

    console.log(JSON.stringify(store?.profileSettingData, null, 2), "heo")
    setName(store?.profileSettingData?.userInfo?.name)
    setDob(store?.profileSettingData?.userInfo?.date_of_birth)
    setEmail(store?.profileSettingData?.userInfo?.email)
    console.log(store?.profileSettingData?.userInfo?.email)
    setImg(store?.profileSettingData?.userInfo?.profile_picture)
    setSelectedDenomination(store?.profileSettingData?.denomination)
    setSelectedBibleVersion(store?.profileSettingData?.bible_version)
    setTone(store?.profileSettingData?.tone_preference)
    setFaithGoal(store?.profileSettingData?.goal_preference)
    setAnswer(store?.profileSettingData?.bible_familiarity)

    if(faith_goal_questions){
      const temp = []
      faith_goal_questions[0].options.forEach(opt => {
        if(opt.is_selected){
          temp.push({...opt});
        }
      })
      faith_goal_questions[1].options.forEach(opt => {
        if(opt.is_selected){
          temp.push({...opt})
        }
      })
      faith_goal_questions[2].options.forEach(opt => {
        if(opt.is_selected){
          temp.push({...opt})
        }
      })
      //console.log("faith_goal_questions *", JSON.stringify(faith_goal_questions, null, 2))
      setFaithGoalQuestionOne(temp[0]);
      setFaithGoalQuestionTwo(temp[1]);
      setFaithGoalQuestionThree(temp[2]);

    }

    
    
  }, [store, route.params, faith_goal_questions])

  useEffect(()=>{
    if(route.params?.editMode){
      setEditMode(true)
    }
  }, [route.params])

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.scrollContainer}
      enableOnAndroid={true}
      extraScrollHeight={190}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >

      <ProfileImage
          onChange={(image) => {
            setImg(image.uri)
            setImageData(image)
          }}
          disabled={!editMode}
          uri={img?img:store?.profileSettingData?.userInfo?.profile_picture}
      />

      <View style={styles.inputFieldCard}>
        <InfoRow label="Name" value={name} onChange={setName} isEditable={editMode} />
        <View style={{height:1, backgroundColor:'#dce3e4'}}/>
        <InfoRow isDate={true} isEditable={editMode} label="Date of birth" value={dob} onChange={handleDob} />
        <InfoRow isEditable={editMode} label="Email" value={email} onChange={setEmail} />
      </View>
    
          

      <View style={styles.card}>
        <DropdownRow
          label="Denomination"
          value={selectedDenomination?.name}
          onPress={() => setModalVisible(editMode)}
        />
        <View style={{height:1, backgroundColor:'#dce3e4'}}/>
        <DropdownRow
          label="Bible"
          value={selectedBibleVersion?.name}
          onPress={() => setBibleModalVisible(editMode)}
        />
      </View>
      <View style={styles.card}>
        <DropdownRow
          label="Tone"
          value={tone?.name}
          onPress={() => setToneModalVisible(editMode)}
        />
        <View style={{height:1, backgroundColor:'#dce3e4'}}/>
        <DropdownRow
          label="Faith Goal"
          value={faithGoal?.name}
          onPress={() => setFaithGoalVisible(editMode)}
        />
        <View style={{height:1, backgroundColor:'#dce3e4'}}/>
        <DropdownRow
          label="Answer Depth"
          value={Answer?.name}
          onPress={() => setDepthAnsVisible(editMode)}
        />
      </View>

      {/* <View style={styles.card}>
        <DropdownRow
          label={(faith_goal_questions && faith_goal_questions[0]?.question) || " "}
          value={faithGoalQuestionOne?.name}
          onPress={() => setFaithGoalQuestionOneVisible(editMode)}
          rowStyle={{width:"100%", flexDirection:'column', alignItems:'flex-start', rowGap:10}}
        />
        <View style={{height:1, backgroundColor:'#dce3e4'}}/>
        <DropdownRow
          label={(faith_goal_questions && faith_goal_questions[1]?.question) || " "}
          value={faithGoalQuestionTwo?.name}
          onPress={() => setFaithGoalQuestionTwoVisible(editMode)}
          rowStyle={{width:"100%", flexDirection:'column', alignItems:'flex-start', rowGap:10}}
        />
        <View style={{height:1, backgroundColor:'#dce3e4'}}/>
        <DropdownRow
          label={(faith_goal_questions && faith_goal_questions[2]?.question) || " "}
          value={faithGoalQuestionThree?.name}
          onPress={() => setFaithGoalQuestionThreeVisible(editMode)}
          rowStyle={{width:"100%", flexDirection:'column', alignItems:'flex-start', rowGap:10}}
        />
      </View> */}

      <View style={{margin:20}}>
        <CommonButton
          btnText={route.params?.editMode ?"Save Info":"Edit Info"}
          bgColor={deepGreen}
          navigation={navigation}
          route={""}
          txtColor={"white"}
          handler={() => {
            if(editMode){

              handleSaveUserInfo()
            
            }else{
              navigation.navigate("EditPersonalInfo", {editMode:true})
            }
          }}
          bold='bold'
          opacity={1}
        />
      </View>



      <DropdownModal
        isVisible={faithGoalQuestionOneVisible}
        onClose={() => setFaithGoalQuestionOneVisible(false)}
        handleChage={handleFaithGoalQuestionOne}
        options={faith_goal_questions && faith_goal_questions[0].options}
        selectedItem={faithGoalQuestionOne}
      />
      <DropdownModal
        isVisible={faithGoalQuestionTwoVisible}
        onClose={() => setFaithGoalQuestionTwoVisible(false)}
        handleChage={handleFaithGoalQuestionTwo}
        options={faith_goal_questions && faith_goal_questions[1].options}
        selectedItem={faithGoalQuestionTwo}
      />

      <DropdownModal
        isVisible={faithGoalQuestionThreeVisible}
        onClose={() => setFaithGoalQuestionThreeVisible(false)}
        handleChage={handleFaithGoalQuestionThree}
        options={faith_goal_questions && faith_goal_questions[2].options}
        selectedItem={faithGoalQuestionThree}
      />{""}

      <DropdownModal
        isVisible={modalVisible}
        onClose={() => setModalVisible(false)}
        handleChage={handleSelect}
        options={denominations?.filter(it => it.id > 0).sort((a,b) => a.id-b.id)}
        selectedItem={selectedDenomination}
      />
      <DropdownModal
        isVisible={bibleModalVisible}
        onClose={() => setBibleModalVisible(false)}
        handleChage={handleSelect1}
        options={bible_versions?.filter(it => it.id > 0).sort((a,b) => a.id-b.id)}
        selectedItem={selectedBibleVersion}
      />

      <DropdownModal
        isVisible={toneModalVisible}
        onClose={() => setToneModalVisible(false)}
        handleChage={handleTone}
        options={tone_preference_data}
        selectedItem={tone}
      />
      <DropdownModal
        isVisible={faithGoalVisible}
        onClose={() => setFaithGoalVisible(false)}
        handleChage={handleFaithGoal}
        options={faith_goal}
        selectedItem={faithGoal}
      />
      <DropdownModal
        isVisible={depthAnsVisible}
        onClose={() => setDepthAnsVisible(false)}
        handleChage={handleAnswer}
        options={bible_familiarity_data}
        selectedItem={Answer}
      />
      
      {loading && <Indicator visible={loading} onClose={() => setLoading(false)}>
        <ActivityIndicator size={"large"}/>
      </Indicator>}
    </KeyboardAwareScrollView>
  );
};

const InfoRow = ({ label, value, onChange, isEditable=true,isDate=false}) => {

  const [isOpen, setIsOpen] = useState(false);


  return <View style={styles.inputFieldRow}>
    <Text style={styles.inputFieldLabel}>{label}</Text>

    {isEditable?

      isDate?
        <DatePicker value={value} onChange={value => {
          onChange(dayjs(value).format("YYYY-MM-DD"))
        }} isOpen={isOpen} setIsOpen={setIsOpen}/>
      :
      <TextInput
        style={styles.inputField}
        value={value}
        keyboardType={isDate?'numeric':'default'}
        onChangeText={isDate?()=>{}:onChange}
        placeholder={isDate?"year-month-day":`Enter ${label.toLowerCase()}`}
        textAlign="right"
        editable={isEditable}
        returnKeyType="done"
        onKeyPress={({nativeEvent})=>{
          console.log("key", nativeEvent.key)
          if(isDate){
            onChange(nativeEvent.key)
          }
        }}
      />
    
    :
    
    
      <Text style={{...styles.inputField, width: '70%'}}>{value}</Text>
    
    }
    


  </View>


};

const DropdownRow = ({ label, value, onPress, rowStyle={} }) => (
  <TouchableOpacity style={{...styles.row, ...rowStyle}} onPress={() => {
    onPress();
    Keyboard.dismiss();
  }}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.valueContainer}>
      <Text style={styles.value} numberOfLines={1}>{value}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  label: {
    fontSize: 16,
    color: '#0B172A',
    fontFamily:'NunitoBold',
    flex: 1,
  },
  valueContainer: {
    flex: 1,
    marginLeft: 10,
  },
  value: {
    fontSize: 16,
    color: '#2B4752',
    fontFamily:'NunitoBold',
    textAlign: 'right',
    
  },
 
  inputFieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
    
    paddingBottom: 0
  },
  inputFieldLabel: {
    fontSize: 16,
    color: '#0B172A',
    fontFamily:'NunitoBold',
    //flex: 1,
  },
  inputField: {
    fontSize: 16,
    color: '#2B4752',
    fontFamily:'NunitoBold',
    //flex: 1,
    padding: 8,
    textAlign: 'right',
  },
});

export default PersonalInfo;