import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../../context/AuthContext';
import { delete_notifications, get_notifications } from '../TabsAPI';
import { Swipeable } from 'react-native-gesture-handler';
import Indicator from '../../../components/Indicator';
import ReusableNavigation from '../../../components/ReusabeNavigation';
import BackButton from '../../../components/BackButton';

const trash = require('../../../../assets/img/Trash.png');

function ProfileNotification() {
  const navigation = useNavigation();
  const { socket } = useAuth();
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const swipeableRowRef = useRef(null);

  const handleDeleteNotification = (id) => {
    setLoading(true);
    delete_notifications(id, (res, success) => {
      if (success) {
        if (swipeableRowRef.current) {
          swipeableRowRef.current.close();
          swipeableRowRef.current = null;
        }
        get_notifications((res, success) => {
          setLoading(false);
          if (success) {
            setNotifications(res?.data);
            socket.setNotifications(res?.data);
          }
        });
      } else {
        setLoading(false);
      }
    });
  };

  const renderRightActions = (progress, dragX, itemId) => (
    <TouchableOpacity
      onPress={() => handleDeleteNotification(itemId)}
      style={styles.deleteButton}
    >
      <Image
        source={trash}
        style={{ width: 20, height: 20, resizeMode: 'contain' }}
      />
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => {
    let localRef;

    return (
      <Swipeable
        ref={(ref) => { localRef = ref; }}
        onSwipeableOpen={() => {
          if (swipeableRowRef.current && swipeableRowRef.current !== localRef) {
            swipeableRowRef.current.close();
          }
          swipeableRowRef.current = localRef;
        }}
        renderRightActions={(progress, dragX) =>
          renderRightActions(progress, dragX, item.id)
        }
      >
        <View style={styles.notificationCard}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.message}>{item.message}</Text>
        </View>
      </Swipeable>
    );
  };

  useEffect(() => {
    setNotifications(socket.notifications);
  }, [socket.notifications]);

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
            Notifications
          </Text>
        )}
        RightComponent={() => <Text />}
      />

      <View className="flex-1 px-5 pt-5 pb-2">
        <FlatList
          data={notifications}
          keyExtractor={(_, idx) => idx.toString()}
          showsVerticalScrollIndicator={false}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View className="h-5" />}
        />
      </View>

      {loading && (
        <Indicator onClose={() => setLoading(false)} visible={loading}>
          <ActivityIndicator size="large" />
        </Indicator>
      )}

    </SafeAreaView>
  );
}

export default ProfileNotification;

const styles = StyleSheet.create({
  notificationCard: {
    backgroundColor: '#f3f8f8',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    overflow: 'hidden',
  },
  title: {
    fontSize: 20,
    fontFamily: 'NunitoSemiBold',
    color: '#0B172A',
  },
  message: {
    fontFamily: 'NunitoBold',
    fontSize: 14,
    color: '#2B4752',
    paddingTop: 15,
  },
  deleteButton: {
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
});