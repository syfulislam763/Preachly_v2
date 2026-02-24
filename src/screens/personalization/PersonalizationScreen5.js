import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import ProgressBar from '../../components/ProgressBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import CommonButton from '../../components/CommonButton';
import { deepGreen, primaryText } from '../../components/Constant';
import CustomSelect from '../../components/CustomSelect';
import SelectableCard from '../../components/SelectableCard';
import QuestionSlider from '../../components/QuestionSlider';
import { useNavigation } from '@react-navigation/native';
import { bible_version } from './PersonalizationAPIs';
import Indicator from '../../components/Indicator';
import useStaticData from '../../hooks/useStaticData';


export default function PersonalizationScreen5() {
  const {store} = useAuth();

  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const handleSubmit = () => {
    setLoading(true);
    const payload = {
      "bible_version_option": selectedItem.id
    }
    
    bible_version(payload, (data, success) => {
      if(success){
        setLoading(false);
        navigation.navigate("Personalization6");
      }else{
        setLoading(false);
        console.error(data);
      }
    });
  }

  return (
    <View style={styles.container}>
      
      <View style={{}}>
        <ProgressBar progress={14.28*6}/>
        
        <Text style={styles.title}>Select your preferred Bible versioin</Text>

        <CustomSelect
          items={store?.bible_versions}
          placeholder='Bible Version'
          onSelect={(item) => {
            setSelectedItem(item)
          }}
        />
       

      </View>

      <View style={{paddingBottom:30}}>
        <CommonButton
          btnText={"Continue"}
          bgColor={deepGreen}
          navigation={navigation}
          route={""}
          handler={handleSubmit}
          txtColor={primaryText}
          bold='bold'
          opacity={selectedItem === null ? 0.5 : 1}
          disabled={selectedItem === null}
      />
      </View>
      {loading && <Indicator onClose={() => setLoading(false)} visible={loading}><ActivityIndicator size="large"  /></Indicator>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex:1,backgroundColor:'#fff',justifyContent:'space-between', padding:10},
  title: {fontFamily:'DMSerifDisplay', fontSize:32, padding: 42, textAlign:'center', color:'#0B172A', lineHeight:35},
 
})