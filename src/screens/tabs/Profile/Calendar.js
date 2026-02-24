import React, { use, useCallback, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Dimensions, Image, StyleSheet,ActivityIndicator } from 'react-native';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from 'date-fns';
import ReusableNavigation from '../../../components/ReusabeNavigation';
import BackButton from '../../../components/BackButton';
import Reward from '../../../components/Reward';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomModal from '../../../components/CustomModal';
import CommonButton from '../../../components/CommonButton';
import { deepGreen, primaryText } from '../../../components/Constant';
import useLayoutDimention from '../../../hooks/useLayoutDimention';
import { getStyles } from './CalendarStyle';
import { get_calendar_information } from '../TabsAPI';
import Indicator from '../../../components/Indicator';
import { useRoute } from '@react-navigation/native';
import CommonCard from '../Home/CommonCard';
import { useAuth } from '../../../context/AuthContext';

const screenWidth = Dimensions.get('window').width;
const calendarPadding = 10;
const daySize = (screenWidth - calendarPadding * 2) / 7 - 4;

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigation = useNavigation()
  const [markedDates, setMarkedDates] = useState([]);
  const {isSmall, isMedium, isLarge, isFold} = useLayoutDimention()
  const styles = getStyles(isSmall, isMedium, isLarge, isFold)
  const [loading , setLoading] = useState(false);
  const [checkIns, setCheckIns] = useState([]);
  const {store} = useAuth();


  const handle_get_calendar_information = () => {
    setLoading(true);
    const payload = {
      month: currentMonth.getUTCMonth()+1,
      year: currentMonth.getUTCFullYear()
    }
    get_calendar_information(payload, (res, success) => {
      setLoading(false);
      if(success){
        const marked = []

        const temp = res?.data?.calendar_events;
        console.log(JSON.stringify(temp, null, 2), "....")
        temp.forEach(item => {
          const date = new Date(item.date);
          marked.push({...item, date: date});
        })
        //marked.push(new Date("2025-08-24"))
        setMarkedDates(marked)
        // console.log(JSON.stringify(marked, null, 2) , "***")
      }else{
    
      }
    })
  }

  useFocusEffect(
    useCallback(() => {
      handle_get_calendar_information();
    }, [currentMonth])
  );








  const renderHeader = () => (
    <View style={{ width: screenWidth - calendarPadding * 2, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 0, paddingVertical: 0 }}>
      <Text style={{ fontSize: 32, fontFamily:'DMSerifDisplay', color:'#0B172A', marginLeft: 25  }}>{format(currentMonth, 'MMMM, yyyy')}</Text>
      <View style={{ flexDirection: 'row', marginRight:0 }}>
        <TouchableOpacity onPress={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          <Image
            source={require("../../../../assets/img/CaretLeft.png")}
            style={{height:26, width:26, objectFit:'contain', marginRight:20}}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCurrentMonth(addMonths(currentMonth, 1))} >
          <Image
            source={require("../../../../assets/img/CaretRight.png")}
            style={{height:26, width:26, objectFit:'contain'}}
          />
        </TouchableOpacity>
      </View>
    </View>
  );



  const renderDaysOfWeek = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignSelf: 'center' }}>
        {days.map((day, idx) => (
          <Text key={idx} style={styles.dayTitle}>{day.toUpperCase()}</Text>
        ))}
      </View>
    );
  };
  
const Day = ({ day, selectedDate, currentMonth, onSelect, markedDates }) => {
  const isToday = isSameDay(day, new Date());
  const isSelected = isSameDay(day, selectedDate);
  const inCurrentMonth = isSameMonth(day, currentMonth);
  const marked = markedDates?.filter(opt => isSameDay(opt.date, day));
  //console.log("marked", JSON.stringify(marked, null, 2));
  const isMarked = marked.some(item => item.type == "daily_checkin");
  const goal_completed = marked.some(item => item.type == "goal_completion");
  const weekly_checkin_completion = marked.some(item => item.type == "weekly_checkin_completion");


  let bgColor = 'transparent';
  let marked_style = {};
  let text_color = {}

  if (isSelected) bgColor = '#004d40';
  else if (isMarked || goal_completed || weekly_checkin_completion) {
    bgColor = '#f7f8fa';
    text_color = {
      color: '#8eb6b4'
    }
  }


  if(weekly_checkin_completion && isMarked && goal_completed){
    return <TouchableOpacity
      onPress={() => onSelect(day)}
        style={[{...styles.day, height:44.5,width:44.5}, {opacity: inCurrentMonth ? 1 : 0.4, backgroundColor:"#FDD263"}, {borderWidth:1, borderColor:"#FDD263", position:'relative'}]}
      >
        <View style={{height:5,width:5, backgroundColor:"#004d40", borderRadius:5/2, position:'absolute', top:-10}}/>
        <View
          style={[styles.day, {opacity: inCurrentMonth ? 1 : 0.4, backgroundColor:bgColor}, {borderWidth:1, borderColor:"#8eb6b4"}]}
        >
          <Text style={[styles.dayText, {color: isSelected ? 'white' : '#3F5862', }, text_color]}>{format(day, 'd')}</Text>
        </View>
      </TouchableOpacity>
  }

  if(goal_completed){
    return <TouchableOpacity
        onPress={() => onSelect(day)}
        style={[styles.day, {opacity: inCurrentMonth ? 1 : 0.4, backgroundColor:bgColor}, {borderWidth:1, borderColor:"#8eb6b4", position:'relative'}]}
      >
        <View style={{height:5,width:5, backgroundColor:"#004d40", borderRadius:5/2, position:'absolute', top:-10}}/>
        <Text style={[styles.dayText, {color: isSelected ? 'white' : '#3F5862', }, text_color]}>{format(day, 'd')}</Text>
      </TouchableOpacity>
  }
  
  
  if(weekly_checkin_completion){
    return (
    <TouchableOpacity
      onPress={() => onSelect(day)}
        style={[{...styles.day, height:44.5,width:44.5}, {opacity: inCurrentMonth ? 1 : 0.4, backgroundColor:"#FDD263"}, {borderWidth:1, borderColor:"#FDD263"}]}
      >
        <View
          style={[styles.day, {opacity: inCurrentMonth ? 1 : 0.4, backgroundColor:bgColor}, marked_style]}
        >
          <Text style={[styles.dayText, {color: isSelected ? 'white' : '#3F5862', }, text_color]}>{format(day, 'd')}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <TouchableOpacity
      onPress={() => onSelect(day)}
      style={[styles.day, {opacity: inCurrentMonth ? 1 : 0.4, backgroundColor:bgColor}, marked_style]}
    >
      <Text style={[styles.dayText, {color: isSelected ? 'white' : '#3F5862', }, text_color]}>{format(day, 'd')}</Text>
    </TouchableOpacity>
  );
};

  const generateCalendar = () => {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    const days = [];
    let date = start;
    while (date <= end) {
      days.push(date);
      date = addDays(date, 1);
    }
    return days;
  };

  const [modalVisible, setModalVisible] = useState(false);
  const route = useRoute();
  return (
    <SafeAreaView style={{ flex:1, backgroundColor:'#fff',justifyContent:"flex-start"
    }}>
      <ReusableNavigation
        leftComponent={() => <BackButton navigation={navigation}/>}
        middleComponent={() => (<Text style={{
          fontFamily: 'NunitoBold',
          color: '#0b172A',
          fontSize: 18
        }}>Calendar</Text>)}
        RightComponent={() => <Reward count={store?.profile_dashboard?.streak?.current_streak} handler={() => setModalVisible(true)}/>}
        backgroundStyle={{backgroundColor:'#fff'}}
      />

      {renderHeader()}
      <View style={{height:10}}></View>
      {renderDaysOfWeek()}
      <View style={{height:10}}></View>
      <FlatList
        data={generateCalendar()}
        keyExtractor={(item) => item.toISOString()}
        numColumns={7}
        style={{backgroundColor:'white',maxHeight:340}}
        renderItem={({ item }) => (
          <Day
            day={item}
            selectedDate={selectedDate}
            currentMonth={currentMonth}
            onSelect={(date) => {
              //setSelectedDate(date)
            }}
            markedDates={markedDates}
          />
        )}
        scrollEnabled={false}
        contentContainerStyle={{ alignItems: 'center', }}
      />

        <View style={{height:0}}></View>
        
        { !(route?.params?.flag) && <View style={{backgroundColor:'white',  paddingHorizontal:20}}>
        <Text style={{
          fontFamily:'NunitoExtraBold',
          fontSize:20,
          color:'#0B172A',
          marginBottom:20,
        }}>Weekly Check-In Reminder</Text>
      
        <CommonCard 
          title='Keep the faith--and your streak!       '
          text='Time to check in'
          onPress={()=>{
            navigation.navigate("WeeklyCheckIn")
          }}
          index={1}
        />
      </View>}


        {modalVisible && <CustomModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          headerStyle={{paddingHorizontal:20}}
        >
          <View style={{
            alignItems:'center',
            paddingVertical: 0,
            paddingHorizontal:20
          }}>
            <View style={{marginBottom:20}}>
              <Text style={styles.title}>Your streak</Text>
              <Text style={styles.title}>is heating up!</Text>
            </View>

            <View>
              <Text style={styles.text}>You've checked in for <Text style={{fontFamily:'NunitoExtraBold'}}>{store?.profile_dashboard?.streak?.current_streak || "0"} days</Text> straight! </  Text> 
              <Text style={styles.text}>Keep the momentum going -- stay consistent, stay inspired, and unlock new titiles along the way.</Text>
            </View>

            <Image 
              source={require("../../../../assets/img/imgModal.png")}
              style={{
                height:200,
                width:200,
                objectFit:'contain',
              }}
            />
            <View style={{height:20}}></View>
            <CommonButton
              btnText={"Homepage"}
              bgColor={deepGreen}
              navigation={navigation}
              route={""}
              txtColor={primaryText}
              bold='bold'
              opacity={1}
            />
            <View style={{height:20}}></View>
            <Text style={styles.footerText}>Back</Text>
            
          </View>
        </CustomModal>}

        {loading && <Indicator visible={loading} onClose={() => {setLoading(false)}}>
          <ActivityIndicator size={"large"}/>
        </Indicator>}
    </SafeAreaView>
  );
};

export default Calendar;



