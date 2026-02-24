
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
import { useAuth } from '../../../context/AuthContext';
import { delete_notifications, get_notifications } from '../TabsAPI';
import { Swipeable } from 'react-native-gesture-handler';
import Indicator from '../../../components/Indicator';

const trash = require('../../../../assets/img/Trash.png');

function ProfileNotification() {
  const navigation = useNavigation();
  const { socket } = useAuth();
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);

  const swipeableRowRef = useRef(null); // Track the currently open swipeable

  const handleDeleteNotification = (id) => {
    // Close current swipeable if any
    

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
        style={{
          width: 20,
          height: 20,
          resizeMode: 'contain',
        }}
      />
    </TouchableOpacity>
  );

  const renderItem = ({ item }) => {
    let localRef;

    return (
        <Swipeable
            ref={(ref) => {
            localRef = ref;
            }}
            onSwipeableOpen={() => {
            if (
                swipeableRowRef.current &&
                swipeableRowRef.current !== localRef
            ) {
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
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={(_, idx) => idx.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={renderItem}
        ItemSeparatorComponent={()=> <View style={{height:20}} />}
      />
      {loading && (
        <Indicator onClose={() => setLoading(false)} visible={loading}>
          <ActivityIndicator size="large" />
        </Indicator>
      )}
    </View>
  );
}

export default ProfileNotification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  notificationCard: {
    backgroundColor: '#f3f8f8',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    // marginBottom: 20,
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
    // marginVertical: 10,
  },
});

