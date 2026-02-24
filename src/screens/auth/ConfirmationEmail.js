

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Keyboard, 
  Pressable, 
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import CommonInput from '../../components/CommonInput';
import { 
  deepGreen,
  lighgreen,
  lightgreen1,
  primaryText, 
  primaryTextSize, 
  primaryTitle, 
  primaryTitleSize 
} from '../../components/Constant';
import { SafeAreaView } from 'react-native-safe-area-context';
import CommonButton from '../../components/CommonButton';
import { useRoute, useNavigation } from '@react-navigation/native';
export default function ConfirmationEmail() {
  const route = useRoute()
  const navigation = useNavigation()
  return (
    <View
      style={styles.container}
    >
      <Pressable onPress={() => Keyboard.dismiss()} style={{ flex: 1 }}>
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <Text style={styles.title}>Confirmation email has been sent</Text>
            <Text style={styles.text}>Check your email for {route?.params?route?.params?.email: "qwerty123@gmail.com"} to which the confirmation email was sent</Text>
          </View>
        </ScrollView>

        <View style={styles.buttonContainer}>
          <CommonButton
            btnText={"Enter Confirmation Code"}
            bgColor={deepGreen}
            navigation={navigation}
            route={""}
            handler={() => navigation.navigate("ConfirmationCode", route.params)}
            txtColor={"#fff"}
            opacity={1}
          />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  content: {
    flex: 1,
    paddingTop:20
  },
  title: {
    fontSize: primaryTitleSize,
    fontFamily:'DMSerifDisplay',
    marginBottom: 8,
    flexWrap:'wrap',
    color:'#0B172A'
  }, 
  text: {
    fontSize: 17.5,
    paddingTop: 10,
    paddingBottom: 30,
    boxSizing: 'border-box',
    color: '#2B4752',
    textAlign:'center',
    fontFamily:'NunitoSemiBold',
    lineHeight:20

  },
  input: {
    marginBottom: 20,
  },
  buttonContainer: {
    padding: 20,
    paddingBottom: 30,
  }
});