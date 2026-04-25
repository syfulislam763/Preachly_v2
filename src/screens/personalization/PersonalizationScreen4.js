import React, { useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, Pressable, ImageBackground, StyleSheet } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import ProgressBar from '../../components/ProgressBar';
import { SafeAreaView } from 'react-native-safe-area-context';
import CommonButton from '../../components/CommonButton';
import { deepGreen, primaryText } from '../../components/Constant';
import { useNavigation } from '@react-navigation/native';
import Indicator from '../../components/Indicator';
import { bible_familiarity } from './PersonalizationAPIs';
import useAppStore from '@/context/useAppStore';
import ReusableNavigation from '../../components/ReusabeNavigation';
import BackButton from '../../components/BackButton';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PersonalizationScreen() {
  const { store } = useAuth();
  const bible_familiarity_data = useAppStore((s) => s.onboarding.bible_familiarity_data);
  const insets = useSafeAreaInsets();

  const [isLoading, setIsLoading] = useState(false);
  const [index, setIndex] = useState(-1);
  const [id, setId] = useState(null);
  const navigation = useNavigation();

  const handleSubmit = () => {
    const payload = { bible_familiarity_option: id };
    setIsLoading(true);
    bible_familiarity(payload, (response, success) => {
      setIsLoading(false);
      if (success) {
        navigation.navigate("Personalization5");
      } else {
        console.error("Error submitting bible familiarity:", response);
      }
    });
  };

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-white">

      <ReusableNavigation
        backgroundStyle={{ backgroundColor: '#fff' }}
        leftComponent={() => <BackButton navigation={navigation} />}
        middleComponent={() => <Text />}
        RightComponent={() => <Text />}
      />

      <View className="flex-1 justify-between px-5 py-2.5">

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <ProgressBar progress={12.5 * 6} />

          <Text
            style={{ fontFamily: 'DMSerifDisplay', lineHeight: 35 }}
            className="text-[32px] text-[#0B172A] text-center  py-10"
          >
            How familiar are you with the Bible’s teachings?
          </Text>

          {/* Photo Cards Row */}
          <View className="flex-row justify-around pb-4">
            <PhotoCard
              isActive={index === 0}
              setIsActive={() => { setIndex(0); setId(bible_familiarity_data[0].id); }}
              text={bible_familiarity_data[0].label}
              img={require("../../../assets/img/card_bg1.png")}
            />
            <PhotoCard
              isActive={index === 1}
              setIsActive={() => { setIndex(1); setId(bible_familiarity_data[1].id); }}
              text={bible_familiarity_data[1].label}
              img={require("../../../assets/img/card_bg2.png")}
            />
            <PhotoCard
              isActive={index === 2}
              setIsActive={() => { setIndex(2); setId(bible_familiarity_data[2].id); }}
              text={bible_familiarity_data[2].label}
              img={require("../../../assets/img/card_bg3.png")}
            />
          </View>

          <Content data={bible_familiarity_data[index]} />

        </ScrollView>

        <View style={{paddingBottom: insets.bottom}}>
          <CommonButton
            btnText={"Continue"}
            bgColor={deepGreen}
            navigation={navigation}
            route={""}
            handler={handleSubmit}
            txtColor={primaryText}
            bold='bold'
            opacity={index === -1 ? 0.7 : 1}
            disabled={index === -1}
          />
        </View>

      </View>

      {isLoading &&
        <Indicator visible={isLoading} onClose={() => setIsLoading(false)}>
          <ActivityIndicator size="large" />
        </Indicator>
      }

    </SafeAreaView>
  );
}

const Content = ({ data }) => {
  return (
    <View>
      <View className="px-5 pt-4">
        <Text style={{ fontFamily: 'NunitoSemiBold' }} className="text-base text-[#3F5862] text-center">
          {data?.text1}
        </Text>
        {!data && (
          <Text style={{ fontFamily: 'NunitoSemiBold' }} className="text-xl text-[#3F5862] text-center">
            Select an option
          </Text>
        )}
        <View className="h-4" />
        {data?.text2 && (
          <Text style={{ fontFamily: 'NunitoSemiBold' }} className="text-base text-[#3F5862] text-center">
            {data?.text2}
          </Text>
        )}
      </View>

      <View className="items-center pt-10">
        <Text style={{ fontFamily: 'DMSerifDisplay' }} className="text-2xl text-[#005A55] text-center">
          {data?.title}
        </Text>
        <Text style={{ fontFamily: 'NunitoSemiBold' }} className="text-base text-[#90B2B2] text-center  pt-10">
          {data?.caption}
        </Text>
      </View>
    </View>
  );
};

const PhotoCard = ({ isActive, setIsActive, img, text }) => {
  return (
    <Pressable onPress={setIsActive} style={[styles.imgWrap, !isActive && { borderWidth: 0 }]}>
      <View style={[styles.imgWrapper, !isActive && { opacity: 0.5 }]}>
        <ImageBackground source={img} style={styles.img}>
          <Text style={{
            flexWrap: 'wrap',
            fontFamily: 'NunitoExtraBold',
            textAlign: 'center',
            fontSize: hp("2%"),
          }}>
            {text}
          </Text>
        </ImageBackground>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  img: {
    height: hp("12%"),
    width: wp("27%"),
    objectFit: 'contain',
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgWrapper: {
    height: hp("12%"),
    width: wp("27%"),
    objectFit: 'contain',
    borderRadius: hp("1.5%"),
    backgroundColor: '#fff',
    opacity: 1,
    overflow: 'hidden',
  },
  imgWrap: {
    backgroundColor: '#fff',
    padding: 5,
    borderWidth: 2,
    borderColor: '#bda58a',
    borderRadius: hp("2%"),
    overflow: 'hidden',
  },
});