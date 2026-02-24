import React from 'react';
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import CommonButton from '../../../components/CommonButton';
import { deepGreen , primaryText} from '../../../components/Constant';
import { useAuth } from '../../../context/AuthContext';
import ParagraphIcon from '../../../components/ParagraphIcon';
import CustomHeader from '../../../components/CustomNavigation';
import { SafeAreaView } from 'react-native-safe-area-context';
import ReusableNavigation from '../../../components/ReusabeNavigation';
import BackButton from '../../../components/BackButton';
import useLayoutDimention from '../../../hooks/useLayoutDimention';
import { he } from 'date-fns/locale';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import { getStyles } from './ProfileFaithStyle';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';

const { width, height,} = Dimensions.get('window');

const ProfileFaith = () => {
    const navigation = useNavigation();
    const route = useRoute();

  const {completePersonalization} = useAuth()
  const {isSmall, isMedium, isLarge, isFold} = useLayoutDimention()
  const styles = getStyles(isSmall, isMedium, isLarge, isFold)

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
        <ReusableNavigation 
            backgroundStyle={{backgroundColor:'#fff'}}
            leftComponent={() => <BackButton navigation={navigation}/>}
            middleComponent={()=>{}}
            RightComponent={()=>{}}
        />
        <View style={{marginTop:hp("1%")}}>
            <Text style={styles.title}>Well Done!</Text>
            <Text style={styles.title}>Keep Growing in Faith</Text>
        </View>
        <View style={{marginTop:hp("2%")}}>
            <Text style={styles.text}> Your commitment to deepening your faithis building a strong foundation.Keep going—there’s more ahead!</Text>
        </View>
        <Image
            source={require('../../../../assets/img/bg_bible_frame.png')}
            style={styles.bg_image}
        />

        <View style={styles.btnContainer}>
            <CommonButton
                btnText={"Find Answers"}
                bgColor={deepGreen}
                navigation={navigation}
                route={""}//MainTabs
                handler={() => navigation.navigate("WeeklyCheckIn_", {week_number: route.params.week_number, flag:true, title: route.params?.week_number+" Weekly Check-In"})}
                txtColor={primaryText}
                bold='bold'
                opacity={1}
            />
        </View>
      
    </SafeAreaView>
  );
};


export default ProfileFaith;
