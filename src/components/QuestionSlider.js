import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; // for arrows
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import useLayoutDimention from '../hooks/useLayoutDimention';
import { getStyles } from './QuestionSliderStyle';
import useStaticData from '../hooks/useStaticData';
import { useAuth } from '../context/AuthContext';
import useAppStore from '@/context/useAppStore';


export default function QuestionSlider({savedOptions, setSavedOptions}) {
  const {store} = useAuth();

  
  const faith_goal_questions = useAppStore((s) => s.onboarding.faith_goal_questions)
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const {isSmall, isMedium, isLarge, isFold} = useLayoutDimention()
  const styles = getStyles(isSmall, isMedium, isLarge, isFold);
 

  const handleSelect = (option) => {
    if(currentIndex>faith_goal_questions.length-1 || currentIndex < 0 || !(faith_goal_questions)){
      return;
    }
    const temp = faith_goal_questions?.sort((a, b) => a.id - b.id)[currentIndex]?.options;

    let filtered = selectedOptions;
    temp.forEach(item => {
      filtered = filtered.filter(opt => opt.id != item.id);
    })

    filtered.push(option);


    setSelectedOptions(filtered);
    //console.log(filtered.map(item=>item.id))
    setSavedOptions(filtered.map(item=>item.id));
  };

  const goNext = () => {
    if (currentIndex < faith_goal_questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const renderRadio = (option, index) => {
    const isSelected = savedOptions.includes(option.id);
    return (
      <TouchableOpacity
        key={index}
        style={styles.radioRow}
        onPress={() => handleSelect(option)}
      >
        <View style={styles.radioOuter}>
          {isSelected && <View style={styles.radioInner} />}
        </View>
        <Text style={styles.optionText}>{option.option}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.questionBox}>
        <Text style={styles.questionText}>{faith_goal_questions[currentIndex].question}</Text>
      </View>

      {faith_goal_questions?.sort((a, b) => a.id - b.id)[currentIndex].options.map(renderRadio)}

      <View style={{
        alignItems:'center',
        marginBottom: hp("3%")
      }}>
        <View style={styles.navigation}>
          <TouchableOpacity onPress={goPrev} disabled={currentIndex === 0}>
            <AntDesign name="left" size={24} color={currentIndex === 0 ? '#d3e0dd' : '#a1b7b2'} />
          </TouchableOpacity>

          <View style={styles.dots}>
            {faith_goal_questions.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  currentIndex === index && styles.activeDot,
                ]}
              />
            ))}
          </View>

          <TouchableOpacity onPress={goNext} disabled={currentIndex === faith_goal_questions.length - 1}>
            <AntDesign name="right" size={24} color={currentIndex === faith_goal_questions.length - 1 ? '#d3e0dd' : '#a1b7b2'} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}


