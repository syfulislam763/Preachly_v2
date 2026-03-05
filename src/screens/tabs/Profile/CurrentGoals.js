import React, { useCallback, useState } from 'react';
import {
  View, Text, Image, StyleSheet, Pressable,
  ActivityIndicator, ImageBackground, FlatList
} from 'react-native';
import CommonButton from '../../../components/CommonButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { deepGreen, primaryText } from '../../../components/Constant';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { get_current_goal } from '../TabsAPI';
import Indicator from '../../../components/Indicator';
import { useAuth } from '../../../context/AuthContext';
import ProgressBar from '../../../components/ProgressBar';
import ReusableNavigation from '../../../components/ReusabeNavigation';
import BackButton from '../../../components/BackButton';

const img1 = require('../../../../assets/img/card_bg9.png');
const img2 = require('../../../../assets/img/card_bg10.png');
const scripture = require("../../../../assets/img/scripture.png");
const conversation = require("../../../../assets/img/conversation.png");
const share_faith = require("../../../../assets/img/share_faith.png");

const lavel = {
  "conversation": "Confidence Goal",
  "scripture": "Scripture Knowledge",
  "share_faith": "Inspiration Goal",
};

const goal_description = {
  conversation: {
    text1: "Confidence",
    text2: "Your Bold Flame is Growing!",
    text3: "Leveling up your boldness! Every question you face adds fuel to your fire, making you braver and brighter in sharing God's truth.",
  },
  scripture: {
    text1: "Scripture Knowledge",
    text2: "Your Faith IQ is Rising!",
    text3: "Bible scholar in the making! Every verse sharpens your wisdom and fuels your faith, your spiritual library is stacking up strong.",
  },
  share_faith: {
    text1: "Inspiration",
    text2: "Your Light is Reaching New Heights!",
    text3: "Look at you, planting flags of hope! Every share is a mountaintop moment, inspiring hearts and sparking faith in ways you might not even see.",
  },
};

const images = {
  "conversation": conversation,
  "scripture": scripture,
  "share_faith": share_faith,
};

const CurrentGoals = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [currentWeek, setCurrentWeek] = useState({});
  const { store } = useAuth();

  console.log(JSON.stringify(currentWeek, null, 2), "..");

  const timeAgo = (string) => {
    if (string == "") return " ";
    const month_string = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const now = new Date(string);
    const day = now.getUTCDate();
    const month = month_string[now.getUTCMonth()];
    const year = now.getUTCFullYear();
    return `${day} ${month} ${year}`;
  };

  const renderItem = ({ item, isCurrent = false }) => {
    const week_end = (item?.week_end) ? timeAgo(item?.week_end) : "";
    const week_start = (item?.week_start) ? timeAgo(item?.week_start) : "";
    const current = isCurrent ? "" : "";
    const goals = item.goal || {};

    console.log(goals);

    return (
      <Pressable className="bg-white" onPress={() => {}}>
        <View className="items-center">
          <Text style={styles.title2}>{goal_description[goals.goal_type]?.text1}</Text>
          <View className="h-3.5" />
          <Text style={{ ...styles.text1, fontSize: 17 }}>{goal_description[goals.goal_type]?.text2}</Text>
          <Text style={{ ...styles.text1, color: "#2B4752" }}>{goal_description[goals.goal_type]?.text3}</Text>

          <Image
            style={{ height: "40%", width: "100%", objectFit: "contain" }}
            source={images[goals?.goal_type]}
          />
          <View className="h-5" />
          <Text style={{ ...styles.title2, fontSize: 16, textAlign: 'center' }}>
            {`${goals?.current_count}/${goals?.target_count} completed`}
          </Text>
          <View className="h-5" />
          <ProgressBar filled={{}} container={{}} progress={`${goals.progress_percentage}`} />
          <View className="h-5" />
          <Text style={styles.text1}>{`${week_start} - ${week_end} ${current}`}{" "}</Text>
          <Text style={styles.text1}>{`Remaining days ${item?.days_remaining}`}{" "}</Text>
        </View>
      </Pressable>
    );
  };

  const handle_get_current_goal = () => {
    setLoading(true);
    get_current_goal((res, success) => {
      if (success) {
        console.log(res, "res");
        setCurrentWeek(res?.data);
      }
      setLoading(false);
    });
  };

  useFocusEffect(
    useCallback(() => {
      handle_get_current_goal();
    }, [])
  );

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-white">

      <ReusableNavigation
        backgroundStyle={{ backgroundColor: '#fff' }}
        leftComponent={() => <BackButton navigation={navigation} />}
        middleComponent={() => (
          <Text
            style={{ fontFamily: 'NunitoSemiBold', color: '#0B172A', fontSize: 18 }}
            className="mr-10"
          >
            Current Goals
          </Text>
        )}
        RightComponent={() => <Text />}
      />

      <View className="flex-1 px-5 pb-5 pt-20">
        <FlatList
          ListHeaderComponent={() => renderItem({ item: currentWeek, isCurrent: true })}
          data={[]}
          keyExtractor={(item, idx) => idx.toString()}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {loading &&
        <Indicator visible={loading} onClose={() => setLoading(false)}>
          <ActivityIndicator size="large" />
        </Indicator>
      }

    </SafeAreaView>
  );
};

const Card = ({ img, index = 0, title, text, progress }) => {
  return (
    <ImageBackground
      source={(index == 1) ? img2 : img1}
      style={styles.background}
      resizeMode="cover"
    >
      <View className="p-4 justify-center items-center">
        <Text style={(index == 1) ? { ...styles.title, color: "#ffffff" } : styles.title}>
          {title || "Memorize 5 Scriptures"}
        </Text>
        <Text style={(index == 1) ? { ...styles.text, color: "#ffffff99" } : styles.text}>
          {text || "3/5 completed"}
        </Text>
      </View>
    </ImageBackground>
  );
};

export default CurrentGoals;

const styles = StyleSheet.create({
  background: {
    height: 82,
    width: '100%',
    alignContent: "center",
    marginBottom: 15,
    overflow: 'hidden',
    borderRadius: 15,
  },
  title2: {
    fontFamily: 'DMSerifDisplay',
    fontSize: 25,
    textAlign: 'center',
    color: '#0B172A',
    marginTop: 20,
  },
  title: {
    fontFamily: "NunitoSemiBold",
    fontSize: 15,
    marginBottom: 7,
    color: "#0B172A",
  },
  text: {
    marginRight: "5%",
    fontFamily: "NunitoSemiBold",
    fontSize: 12,
    color: "#53381E",
  },
  text1: {
    fontFamily: "NunitoSemiBold",
    fontSize: 15,
    color: "#0B172A",
    marginBottom: 10,
    textAlign: 'center',
  },
});