import React, { useEffect, useState } from 'react';
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
import SeedPlantedModal from '@/components/SeedPlantedModal';
import { BASE_URL } from '@/context/Paths';

const { width, height,} = Dimensions.get('window');

const ProfileFaith = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [showModal, setShowModal] = useState(false);

    const {completePersonalization} = useAuth()
    const {isSmall, isMedium, isLarge, isFold} = useLayoutDimention()
    const styles = getStyles(isSmall, isMedium, isLarge, isFold);

    useEffect(() => {
        setShowModal(true);
    }, [])

  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
        <ReusableNavigation 
            backgroundStyle={{backgroundColor:'#fff'}}
            leftComponent={() => <BackButton navigation={navigation}/>}
            middleComponent={()=>{}}
            RightComponent={()=>{}}
        />
        <View style={{marginTop:hp("1%")}}>
            <Text style={styles.title}>Well Done.</Text>
            <Text style={styles.title}>Keep Growing.</Text>
        </View>
        <View className="px-3 py-5">
            <Text className='text-[16px] text-[#3F5862] font-[NunitoSemiBold] text-center'> Your Every step you take deepens your faith and strengthens your voice.</Text>
            <Text className='text-[16px] text-[#3F5862] font-[NunitoSemiBold] text-center mt-5'> Keep building a foundation rooted in truth.</Text>
        </View>
        <Image
            source={require('../../../../assets/img/bg_bible_frame.png')}
            style={styles.bg_image}
        />

        <View style={styles.btnContainer}>
            <CommonButton
                btnText={"Continue"}
                bgColor={deepGreen}
                navigation={navigation}
                route={""}//MainTabs
                handler={() => navigation.navigate("WeeklyCheckIn_", {week_number: route.params.week_number, flag:true, title: route.params?.week_number+" Weekly Check-In"})}
                txtColor={primaryText}
                bold='bold'
                opacity={1}
            />
        </View>

        <SeedPlantedModal
            visible={showModal}
            onClose={() => setShowModal(false)}
            title={route?.params?.modal_info?.title}
            message1={route?.params?.modal_info?.description}
            badgeUrl={BASE_URL+ (route?.params?.modal_info?.image)}
        />
      
    </SafeAreaView>
  );
};


export default ProfileFaith;
