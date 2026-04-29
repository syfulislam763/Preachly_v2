import React, { useCallback, useState } from 'react';
import { View, Text, Image, StyleSheet, Pressable, ActivityIndicator, ImageBackground, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { get_weekly_check_in_history } from '../TabsAPI';
import Indicator from '../../../components/Indicator';
import Entypo from '@expo/vector-icons/Entypo';
import ReusableNavigation from '../../../components/ReusabeNavigation';
import BackButton from '../../../components/BackButton';
import SeedPlantedModal from '@/components/SeedPlantedModal';

const img1   = require('../../../../assets/img/card_bg8.png');
const img4   = require('../../../../assets/img/card_bg11.png');
const leaf_b = require('../../../../assets/img/leaf_b.png');
const leaf_w = require('../../../../assets/img/leaf_w.png');

const timeAgo = (string) => {
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const d = new Date(string);
  return `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
};

const WeeklyCheckIn = () => {
  const navigation = useNavigation();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false)

  const handleGetHistory = () => {
    setLoading(true);
    get_weekly_check_in_history((res, success) => {
      console.log("hdf")
      setLoading(false);
      if (success) {
        console.log("fdds", JSON.stringify(res.data, null, 2))
        const filtered = res?.data?.weeks ?? []
        setHistory(filtered);
      }
    });
  };

  useFocusEffect(useCallback(() => { handleGetHistory(); }, []));

  const renderItem = ({ item, index }) => {
    const isEven     = index % 2 === 0;
    const bgImage    = isEven ? img1 : img4;
    const leafIcon   = isEven ? leaf_b : leaf_w;
    const titleColor = isEven ? '#0B172A' : '#ffffff';
    const dateColor  = isEven ? '#966F44' : '#90B2B2';

    return (
      <Pressable
        onPress={() => {
          //setShowModal(true);
          if (item?.status === 'completed') {
            navigation.navigate("WeeklyCheckIn_", { ...item, title: `${item.week_number} Weekly Check-In` });
          } else {
            navigation.navigate("RegularCheckIn", { title: `${item.week_number} Weekly Check-In` });
          }
        }}
      >
        <ImageBackground source={bgImage} style={styles.background} resizeMode="cover">
          <View style={styles.card}>
            <View style={styles.cardWrap}>
              <Image source={leafIcon} style={styles.leafIcon} />
              <View>
                <Text style={[styles.title, { color: titleColor }]}>
                  {(history.length - item.week_number) + 1}. Week Check-In
                </Text>
                <Text style={[styles.text, { color: dateColor, fontSize: 12 }]}>
                  {`${timeAgo(item?.week_start)} - ${timeAgo(item?.week_end)}`}
                </Text>
                <Text style={[styles.text, { color: dateColor }]}>
                  {item?.status}
                </Text>
              </View>
            </View>
            <Entypo name="chevron-thin-right" size={24} color="white" />
          </View>
        </ImageBackground>
      </Pressable>
    );
  };

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
            Weekly Check-In
          </Text>
        )}
        RightComponent={() => <Text />}
      />

      <View className="flex-1">
        <FlatList
          data={[...history].sort((a, b) => b.week_number - a.week_number)}
          keyExtractor={(item) => String(item.week_number)}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>

      {loading && (
        <Indicator visible={loading} onClose={() => setLoading(false)}>
          <ActivityIndicator size="large" />
        </Indicator>
      )}

      <SeedPlantedModal
        visible={showModal}
        onClose={() => setShowModal(false)}
        badgeUrl=""
      />

    </SafeAreaView>
  );
};

export default WeeklyCheckIn;

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 100,
  },
  background: {
    height: 82,
    width: '100%',
    marginBottom: 20,
    overflow: 'hidden',
    borderRadius: 15,
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  cardWrap: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '92%',
  },
  leafIcon: {
    height: 24,
    width: 24,
    objectFit: 'contain',
    marginRight: 6,
  },
  title: {
    fontFamily: 'NunitoSemiBold',
    fontSize: 16,
  },
  text: {
    fontFamily: 'NunitoSemiBold',
    fontSize: 12,
    marginTop: 3,
  },
});