import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  Keyboard, 
  Pressable, 
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  LayoutAnimation,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import CommonInput from '../../components/CommonInput';
import { SafeAreaView } from 'react-native-safe-area-context';
import CommonButton from '../../components/CommonButton';
import { sign_up, resentOTP } from './AuthAPI';
import Indicator from '../../components/Indicator';
import { useNavigation, useRoute } from '@react-navigation/native';
import { handleToast, forget_password } from './AuthAPI';
import ReusableNavigation from '../../components/ReusabeNavigation';
import BackButton from '../../components/BackButton';

export default function SignInScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [keyboardOffset, setKeyboardOffset] = useState(30);
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    if (route?.params?.type == "reset") {
      setEmail(route.params.email);
      navigation.setOptions({ title: "Reset password" });
    }
  }, [route.params]);

  const isValidEmail = {
    "Invalid email format.": true
  };

  const handleSignUp = () => {
    setIsLoading(true);
    const payload = { email: email };

    if (route.params?.type == "reset") {
      setIsLoading(true);
      const resent_payload = { "email": route.params.email };

      forget_password(resent_payload, (res, isSuccess) => {
        if (isSuccess) {
          setIsLoading(false);
          handleToast("info", "OTP has sent again!", 3000, () => {
            navigation.navigate("ConfirmationEmail", { ...payload, type: "reset" });
          });
        } else {
          setEmail("");
          navigation.setParams(null);
          handleToast("error", "Use new email", 3000, () => {});
          setIsLoading(false);
        }
      });
    } else {
      sign_up(payload, (res, isSuccess) => {
        if (isSuccess) {
          const data = res?.data;
          if (data?.is_sent) {
            setIsLoading(false);
            navigation.navigate("ConfirmationEmail", payload);
          } else if (isValidEmail[res.message]) {
            setIsLoading(false);
            handleToast('error', res?.message, 2000, () => {});
          } else {
            setIsLoading(false);
            handleToast('info', res?.message, 3000, () => navigation.navigate("SignIn"));
          }
        } else {
          setIsLoading(false);
          console.log(res, "error in signup");
        }
      });
    }
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', e => {
      const height = e.endCoordinates.height;
      const safeOffset = Math.min(height, 100);
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setKeyboardOffset(safeOffset);
    });

    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setKeyboardOffset(30);
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <SafeAreaView edges={["top"]} className="flex-1 bg-white">

      {/* Navigation Header — same pattern as ProfileFaith */}
      <ReusableNavigation
        backgroundStyle={{ backgroundColor: '#fff' }}
        leftComponent={() => <BackButton navigation={navigation} />}
        middleComponent={() => {return <Text className='mr-10' style={{
          fontFamily: 'NunitoSemiBold',
          color: '#0b172A',
          fontSize: 18
        }}>{route?.params?.type == "reset"? "Reset Password": "Sign Up"}</Text>}}
        RightComponent={() => {return <Text></Text>}}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <Pressable onPress={() => Keyboard.dismiss()} className="flex-1">

          {/* Full ScrollView wrapper so content never gets cut off */}
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="flex-1 px-5 pt-16">

              <Text
                style={{ fontFamily: 'DMSerifDisplay' }}
                className="text-3xl text-[#0B172A] mb-4"
              >
                Enter your email
              </Text>

              <Text
                style={{ fontFamily: 'NunitoSemiBold' }}
                className="text-lg text-[#2B4752] pt-2 pb-10"
              >
                The email confirmation will be sent there
              </Text>

              <CommonInput
                type='email'
                placeholder="example@gmail.com"
                value={email}
                onChangeText={(e) => setEmail(e)}
                style={email.length ? { marginBottom: 20, borderColor: "#005A55" } : { marginBottom: 20, borderColor: '#ACC6C5' }}
                placeholderColor='#607373'
              />

            </View>
          </ScrollView>

          {/* Button pinned at bottom */}
          <View className="px-5" style={{ paddingBottom: keyboardOffset }}>
            <CommonButton
              btnText={"Send Confirmation email"}
              bgColor={"#005A55"}
              navigation={navigation}
              route={""}
              txtColor={"#fff"}
              handler={handleSignUp}
              opacity={email.length ? 1 : 0.6}
              disabled={email.length ? false : true}
            />
          </View>

          {isLoading &&
            <Indicator onClose={() => setIsLoading(false)} visible={isLoading}>
              <ActivityIndicator size="large" />
            </Indicator>
          }

        </Pressable>
      </KeyboardAvoidingView>

    </SafeAreaView>
  );
}