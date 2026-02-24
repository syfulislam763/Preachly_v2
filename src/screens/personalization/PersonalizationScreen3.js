import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import ProgressBar from '../../components/ProgressBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import CommonButton from '../../components/CommonButton';
import { deepGreen, lightgreen1, primaryText } from '../../components/Constant';
import SelectableCard from '../../components/SelectableCard';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import useLayoutDimention from '../../hooks/useLayoutDimention';
import { getStyles } from './PersonalizationScreen3Style';
import { tone_preference } from './PersonalizationAPIs';
import { useNavigation } from '@react-navigation/native';
import Indicator from '../../components/Indicator';
import { isValid } from 'date-fns';
import useStaticData from '../../hooks/useStaticData';



export default function PersonalizationScreen3() {
  const {store} = useAuth()

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [id, setId] = useState(null);
  const navigation = useNavigation();
  const {isSmall, isMedium, isLarge, isFold} =  useLayoutDimention()
  const styles = getStyles(isSmall, isMedium, isLarge, isFold)
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    const payload = {
      "tone_preference_option": id
    };
    setIsLoading(true);
    tone_preference(payload, (response, success) => {
      setIsLoading(false);
      if (success) {
        navigation.navigate("Personalization4");
      } else {
        console.error("Error submitting tone preference:", response);
      }
    });

  }


  return (
    <View style={styles.container}>

      <View>
        <View style={{}}>
          <ProgressBar progress={14.28 * 4} />
        </View>

        <Text style={styles.title}>What tone speaks to you?</Text>

        <Text style={styles.text}>
          Personalize how you receive inspired answers and insights to fit your journey
        </Text>
      </View>

      <View style={{ flex: 1 }}>
        <ScrollView 
          contentContainerStyle={{ padding: 0 }}
          showsVerticalScrollIndicator={false}
        >
          {store?.tone_preference_data.map((item, idx) => (
            <SelectableCard
              key={idx}
              title={item.title}
              description={item.description}
              quote={item.quote}
              selected={selectedIndex === idx}
              onSelect={(index) => {
                setSelectedIndex(index);
                setId(item.id);
              }}
              index={idx}
              icon={item.icon}
            />
          ))}
        </ScrollView>
      </View>

      <View>
        <CommonButton
          btnText={"Select Tone"}
          bgColor={deepGreen}
          navigation={navigation}
          route={""}
          handler={handleSubmit}
          txtColor={primaryText}
          bold='bold'
          opacity={selectedIndex !== null ? 1 : 0.5}
          disabled={selectedIndex === null}
        />
        <Text style={styles.footerText}>
          Not sure? You can change your tone later in your profile settings
        </Text>
      </View>
      {isLoading &&  <Indicator visible={isLoading} onClose={() => setIsLoading(false)} >
        <ActivityIndicator size="large"  />
       </Indicator>}
    </View>
  );
}

