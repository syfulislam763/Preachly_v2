import React, { useCallback, useState } from 'react';
import {
  View, Text, Image, StyleSheet, Pressable,
  ActivityIndicator, ImageBackground, FlatList,
  Modal, TouchableOpacity, TouchableWithoutFeedback
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

// ── Modal content per goal type ──────────────────────────────────────────────
const modal_info = {
  conversation: {
    emoji: "🔥",
    badge: "Confidence",
    heading: "How to Grow Your Confidence",
    body: "Start new conversations inside Preachly. Each conversation strengthens your confidence in responding to real-life questions.",
  },
  scripture: {
    emoji: "📙",
    badge: "Scripture Knowledge",
    heading: "Your Faith IQ is Rising",
    body: "You're building a strong foundation in God's Word. Each chapter you complete deepens your understanding and builds confidence in scripture.",
    extra: "Read and complete chapters in the Bible section. Each chapter deepens your understanding and strengthens your foundation.",
  },
  share_faith: {
    emoji: "✨",
    badge: "Inspiration",
    heading: "How to Grow Your Inspiration",
    body: "Share your faith boldly! Every time you inspire someone, your own light grows brighter and reaches further than you know.",
  },
};
// ─────────────────────────────────────────────────────────────────────────────

const images = {
  "conversation": conversation,
  "scripture": scripture,
  "share_faith": share_faith,
};

// ── GoalInfoModal ─────────────────────────────────────────────────────────────
const GoalInfoModal = ({ visible, onClose, goalType }) => {
  const info = modal_info[goalType] || modal_info.conversation;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 justify-center items-center px-5" style={{ backgroundColor: 'rgba(11,23,42,0.5)' }}>
          <TouchableWithoutFeedback>
            <View className="bg-white rounded-3xl px-6 pt-8 pb-7 w-full">

              {/* Emoji circle */}
              <View className="self-center w-14 h-14 rounded-full bg-green-50 items-center justify-center mb-4">
                <Text style={{ fontSize: 28 }}>{info.emoji}</Text>
              </View>

              {/* Badge */}
              <View className="self-center bg-green-50 rounded-full px-4 py-1 border border-green-100 mb-3">
                <Text className="text-xs text-green-800" style={{ fontFamily: 'NunitoSemiBold' }}>
                  {info.badge}
                </Text>
              </View>

              {/* Heading */}
              <Text className="text-xl text-center text-gray-900 mb-3" style={{ fontFamily: 'DMSerifDisplay' }}>
                {info.heading}
              </Text>

              {/* Divider */}
              <View className="h-px bg-gray-100 mb-4" />

              {/* Body */}
              <Text className="text-sm text-center leading-6 text-gray-500 mb-4" style={{ fontFamily: 'NunitoSemiBold' }}>
                {info.body}
              </Text>

              {/* Optional extra tip block */}
              {info.extra && (
                <View className="flex-row bg-gray-50 rounded-2xl p-4 mb-4 items-start" style={{ gap: 10 }}>
                  <Text style={{ fontSize: 16, marginTop: 1 }}>💡</Text>
                  <Text className="flex-1 text-sm leading-6 text-gray-500" style={{ fontFamily: 'NunitoSemiBold' }}>
                    {info.extra}
                  </Text>
                </View>
              )}

              {/* Got it button */}
              <TouchableOpacity
                className="bg-gray-900 rounded-full py-4 items-center mt-1"
                onPress={onClose}
                activeOpacity={0.85}
              >
                <Text className="text-white text-base" style={{ fontFamily: 'NunitoSemiBold', letterSpacing: 0.3 }}>
                  Got it!
                </Text>
              </TouchableOpacity>

            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
// ─────────────────────────────────────────────────────────────────────────────

const CurrentGoals = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [currentWeek, setCurrentWeek] = useState({});
  const [modalVisible, setModalVisible] = useState(false);   // ← NEW
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
    //setLoading(true);
    get_current_goal((res, success) => {
      if (success) {
        console.log(res, "res");
        setCurrentWeek(res?.data);
      }
      //setLoading(false);
    });
  };

  useFocusEffect(
    useCallback(() => {
      handle_get_current_goal();
      setModalVisible(true);
    }, [])
  );

  // Derive goal type for modal
  const goalType = currentWeek?.goal?.goal_type || 'conversation';

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

      {/* ── Goal Info Modal ── */}
      <GoalInfoModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        goalType={goalType}
      />
      {/* ──────────────────── */}

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