import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import DatePicker from './PersonalInfoUtils/DatePicker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CommonButton from '../../../components/CommonButton';
import { deepGreen } from '../../../components/Constant';
import { useNavigation, useRoute } from '@react-navigation/native';
import { get_profile_info, update_profile_info, handleToast } from '../../auth/AuthAPI';
import { post_onboarding_user_data } from '../../personalization/PersonalizationAPIs';
import ProfileImage from './PersonalInfoUtils/ProfileImage';
import DropdownModal from './PersonalInfoUtils/DropdownModal';
import useLogout from '../../../hooks/useLogout';
import Indicator from '../../../components/Indicator';
import dayjs from 'dayjs';
import useAppStore from '@/context/useAppStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import ReusableNavigation from '../../../components/ReusabeNavigation';
import BackButton from '../../../components/BackButton';

const faith_goal = [
  { id: 1, goal_type: 'conversation', name: 'Confidence Goal' },
  { id: 2, goal_type: 'scripture', name: 'Scripture Knowledge' },
  { id: 3, goal_type: 'share_faith', name: 'Inspiration Goal' },
];

const PersonalInfo = () => {
  const denominations = useAppStore((s) => s.onboarding.denominations);
  const bible_versions = useAppStore((s) => s.onboarding.bible_versions);
  const tone_preference_data = useAppStore((s) => s.onboarding.tone_preference_data);
  const faith_journey_reasons = useAppStore((s) => s.onboarding.faith_journey_reasons);
  const bible_familiarity_data = useAppStore((s) => s.onboarding.bible_familiarity_data);
  const faith_goal_questions = useAppStore((s) => s.onboarding.faith_goal_questions);

  const profileUserInfo = useAppStore((s) => s.profile.userInfo);
  const profileDenomination = useAppStore((s) => s.profile.denomination);
  const profileBibleVersion = useAppStore((s) => s.profile.bible_version);
  const profileTonePreference = useAppStore((s) => s.profile.tone_preference);
  const profileGoalPreference = useAppStore((s) => s.profile.goal_preference);
  const profileBibleFamiliarity = useAppStore((s) => s.profile.bible_familiarity);
  const access = useAppStore((s) => s.auth.access);
  const setProfileData = useAppStore((s) => s.setProfileData);

  const route = useRoute();
  const navigation = useNavigation();

  const [editMode, setEditMode] = useState(false);

  // Modal visibility
  const [modalVisible, setModalVisible] = useState(false);
  const [bibleModalVisible, setBibleModalVisible] = useState(false);
  const [toneModalVisible, setToneModalVisible] = useState(false);
  const [faithGoalVisible, setFaithGoalVisible] = useState(false);
  const [depthAnsVisible, setDepthAnsVisible] = useState(false);
  const [faithGoalQuestionOneVisible, setFaithGoalQuestionOneVisible] = useState(false);
  const [faithGoalQuestionTwoVisible, setFaithGoalQuestionTwoVisible] = useState(false);
  const [faithGoalQuestionThreeVisible, setFaithGoalQuestionThreeVisible] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [img, setImg] = useState(null);
  const [imageData, setImageData] = useState({});

  const [selectedBibleVersion, setSelectedBibleVersion] = useState({});
  const [selectedDenomination, setSelectedDenomination] = useState({});
  const [tone, setTone] = useState({});
  const [faithGoal, setFaithGoal] = useState({});
  const [Answer, setAnswer] = useState({});
  const [faithGoalQuestionOne, setFaithGoalQuestionOne] = useState({});
  const [faithGoalQuestionTwo, setFaithGoalQuestionTwo] = useState({});
  const [faithGoalQuestionThree, setFaithGoalQuestionThree] = useState({});

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setName(profileUserInfo?.name ?? '');
    setDob(profileUserInfo?.date_of_birth ?? '');
    setEmail(profileUserInfo?.email ?? '');
    setImg(profileUserInfo?.profile_picture ?? null);
    setSelectedDenomination(profileDenomination ?? {});
    setSelectedBibleVersion(profileBibleVersion ?? {});
    setTone(profileTonePreference ?? {});
    setFaithGoal(profileGoalPreference ?? {});
    setAnswer(profileBibleFamiliarity ?? {});

    if (faith_goal_questions?.length >= 3) {
      const selected = [];
      [0, 1, 2].forEach((i) => {
        faith_goal_questions[i]?.options?.forEach((opt) => {
          if (opt.is_selected) selected.push({ ...opt });
        });
      });
      setFaithGoalQuestionOne(selected[0] ?? {});
      setFaithGoalQuestionTwo(selected[1] ?? {});
      setFaithGoalQuestionThree(selected[2] ?? {});
    }
  }, [route.params, profileUserInfo, profileDenomination, profileBibleVersion, profileTonePreference, profileGoalPreference, profileBibleFamiliarity]);

  useEffect(() => {
    if (route.params?.editMode) setEditMode(true);
  }, [route.params]);

  const handleSaveUserInfo = () => {
    const payload = {
      denomination: { denomination_option: selectedDenomination?.id },
      goal_preference: { goal_type: faithGoal?.goal_type },
      tone_preference: { tone_preference_option: tone?.id },
      bible_familiarity: { bible_familiarity_option: Answer?.id },
      bible_version: { bible_version_option: selectedBibleVersion?.id },
    };

    let profileInfo_payload = new FormData();
    if (profileUserInfo?.email !== email) profileInfo_payload.append('email', email);
    if (dob) profileInfo_payload.append('date_of_birth', dob);
    if (name) profileInfo_payload.append('name', name);
    if (profileUserInfo?.profile_picture !== img && img) {
      profileInfo_payload.append('profile_picture', {
        uri: imageData?.uri || ' ',
        name: imageData?.fileName || ' ',
        type: imageData?.mimeType || ' ',
      });
    }

    setLoading(true);

    post_onboarding_user_data(payload, (res, success) => {
      if (!success) {
        setLoading(false);
        handleToast('error', 'Failed to update onboarding data', 3000, () => { navigation.goBack(); });
        return;
      }

      update_profile_info(profileInfo_payload, access, (response, isOk) => {
        setLoading(false);

        if (!isOk) {
          const updatedProfile = {
            denomination: selectedDenomination,
            bible_version: selectedBibleVersion,
            tone_preference: tone,
            goal_preference: faithGoal,
            bible_familiarity: Answer,
          };
          setProfileData(updatedProfile);
          handleToast('error', 'Failed to update profile', 3000, () => { navigation.goBack(); });
          return;
        }

        const updatedProfile = {
          userInfo: { ...response?.data, email: profileUserInfo?.email },
          denomination: selectedDenomination,
          bible_version: selectedBibleVersion,
          tone_preference: tone,
          goal_preference: faithGoal,
          bible_familiarity: Answer,
        };

        const emailChanged = profileUserInfo?.email !== email;
        setProfileData(updatedProfile);

        if (emailChanged) {
          navigation.navigate('ConfirmEmail', {
            email,
            change: true,
            profileSettingData: updatedProfile,
            faith_goal_questions: undefined,
          });
        } else {
          navigation.goBack();
        }
      });
    });
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
            {(route.params?.editMode ?? false) ? "Edit Personal Info": "Personal Info"}
          </Text>
        )}
        RightComponent={() => <Text />}
      />

      <KeyboardAwareScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
        enableOnAndroid={true}
        extraScrollHeight={190}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ProfileImage
          onChange={(image) => {
            setImg(image.uri);
            setImageData(image);
          }}
          disabled={!editMode}
          uri={img ?? profileUserInfo?.profile_picture}
        />

        <View style={styles.inputFieldCard}>
          <InfoRow label="Name" value={name} onChange={setName} isEditable={editMode} />
          <View style={{ height: 1, backgroundColor: '#dce3e4' }} />
          <InfoRow isDate={true} isEditable={editMode} label="Date of birth" value={dob} onChange={setDob} />
          <View style={{ height: 1, backgroundColor: '#dce3e4' }} />
          <InfoRow isEditable={editMode} label="Email" value={email} onChange={setEmail} />
        </View>

        <View style={styles.card}>
          <DropdownRow label="Denomination" value={selectedDenomination?.name} onPress={() => setModalVisible(editMode)} />
          <View style={{ height: 1, backgroundColor: '#dce3e4' }} />
          <DropdownRow label="Bible" value={selectedBibleVersion?.name} onPress={() => setBibleModalVisible(editMode)} />
        </View>

        <View style={styles.card}>
          <DropdownRow label="Tone" value={tone?.name} onPress={() => setToneModalVisible(editMode)} />
          <View style={{ height: 1, backgroundColor: '#dce3e4' }} />
          <DropdownRow label="Faith Goal" value={faithGoal?.name} onPress={() => setFaithGoalVisible(editMode)} />
          <View style={{ height: 1, backgroundColor: '#dce3e4' }} />
          <DropdownRow label="Answer Depth" value={Answer?.name} onPress={() => setDepthAnsVisible(editMode)} />
        </View>

        <View style={{ margin: 20 }}>
          <CommonButton
            btnText={route.params?.editMode ? 'Save Info' : 'Edit Info'}
            bgColor={deepGreen}
            navigation={navigation}
            route=""
            txtColor="white"
            handler={() => {
              if (editMode) {
                handleSaveUserInfo();
              } else {
                navigation.navigate('EditPersonalInfo', { editMode: true });
              }
            }}
            bold="bold"
            opacity={1}
          />
        </View>

        {/* Dropdowns */}
        <DropdownModal isVisible={faithGoalQuestionOneVisible} onClose={() => setFaithGoalQuestionOneVisible(false)} handleChage={(o) => { Keyboard.dismiss(); setFaithGoalQuestionOne(o); }} options={faith_goal_questions?.[0]?.options} selectedItem={faithGoalQuestionOne} />
        <DropdownModal isVisible={faithGoalQuestionTwoVisible} onClose={() => setFaithGoalQuestionTwoVisible(false)} handleChage={(o) => { Keyboard.dismiss(); setFaithGoalQuestionTwo(o); }} options={faith_goal_questions?.[1]?.options} selectedItem={faithGoalQuestionTwo} />
        <DropdownModal isVisible={faithGoalQuestionThreeVisible} onClose={() => setFaithGoalQuestionThreeVisible(false)} handleChage={(o) => { Keyboard.dismiss(); setFaithGoalQuestionThree(o); }} options={faith_goal_questions?.[2]?.options} selectedItem={faithGoalQuestionThree} />

        <DropdownModal isVisible={modalVisible} onClose={() => setModalVisible(false)} handleChage={(o) => { Keyboard.dismiss(); setSelectedDenomination(o); }} options={denominations?.filter((it) => it.id > 0).sort((a, b) => a.id - b.id)} selectedItem={selectedDenomination} />
        <DropdownModal isVisible={bibleModalVisible} onClose={() => setBibleModalVisible(false)} handleChage={(o) => { Keyboard.dismiss(); setSelectedBibleVersion(o); }} options={bible_versions?.filter((it) => it.id > 0).sort((a, b) => a.id - b.id)} selectedItem={selectedBibleVersion} />
        <DropdownModal isVisible={toneModalVisible} onClose={() => setToneModalVisible(false)} handleChage={(o) => { Keyboard.dismiss(); setTone(o); }} options={tone_preference_data} selectedItem={tone} />
        <DropdownModal isVisible={faithGoalVisible} onClose={() => setFaithGoalVisible(false)} handleChage={(o) => { Keyboard.dismiss(); setFaithGoal(o); }} options={faith_goal} selectedItem={faithGoal} />
        <DropdownModal isVisible={depthAnsVisible} onClose={() => setDepthAnsVisible(false)} handleChage={(o) => { Keyboard.dismiss(); setAnswer(o); }} options={bible_familiarity_data} selectedItem={Answer} />

        {loading && (
          <Indicator visible={loading} onClose={() => setLoading(false)}>
            <ActivityIndicator size="large" />
          </Indicator>
        )}

      </KeyboardAwareScrollView>

    </SafeAreaView>
  );
};

const InfoRow = ({ label, value, onChange, isEditable = true, isDate = false }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <View style={styles.inputFieldRow}>
      <Text style={styles.inputFieldLabel}>{label}</Text>
      {isEditable ? (
        isDate ? (
          <DatePicker
            value={value}
            onChange={(val) => onChange(dayjs(val).format('YYYY-MM-DD'))}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        ) : (
          <TextInput
            style={styles.inputField}
            value={value}
            onChangeText={onChange}
            placeholder={`Enter ${label.toLowerCase()}`}
            textAlign="right"
            editable={isEditable}
            returnKeyType="done"
          />
        )
      ) : (
        <Text style={{ ...styles.inputField, width: '70%' }}>{value}</Text>
      )}
    </View>
  );
};

const DropdownRow = ({ label, value, onPress, rowStyle = {} }) => (
  <TouchableOpacity
    style={{ ...styles.row, ...rowStyle }}
    onPress={() => { onPress(); Keyboard.dismiss(); }}
  >
    <Text style={styles.label}>{label}</Text>
    <View style={styles.valueContainer}>
      <Text style={styles.value} numberOfLines={1}>{value}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  inputFieldCard: {
    backgroundColor: '#F3F8F8',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#F3F8F8',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12 },
  label: { fontSize: 16, color: '#0B172A', fontFamily: 'NunitoBold', flex: 1 },
  valueContainer: { flex: 1, marginLeft: 10 },
  value: { fontSize: 16, color: '#2B4752', fontFamily: 'NunitoBold', textAlign: 'right' },
  inputFieldRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 8 },
  inputFieldLabel: { fontSize: 16, color: '#0B172A', fontFamily: 'NunitoBold' },
  inputField: { fontSize: 16, color: '#2B4752', fontFamily: 'NunitoBold', padding: 8, textAlign: 'right', flexWrap:'wrap' },
});

export default PersonalInfo;