import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CustomModal = ({animationType="fade", visible, onClose, title, overlayStyle={}, modalContainerStyle={},headerStyle={}, children }) => {
  return (
    <Modal
      transparent={true}
      presentationStyle='overFullScreen'
      statusBarTranslucent={true}
      visible={visible}
      animationType={animationType}
      onRequestClose={onClose}
    >
      <SafeAreaView style={{...styles.overlay, ...overlayStyle}}>
        <View style={{...styles.modalContainer, ...modalContainerStyle}}>
            <View style={{
                display:'flex',
                flexDirection:'row-reverse',
                alignItems:'center',
                justifyContent:'space-between',
                ...headerStyle
            }}>
                <Pressable onPress={onClose}>
                    <Image
                        source={require("../../assets/img/Close.png")}
                        style={{
                            height:30,
                            width:30,
                            objectFit:'contain'
                        }}
                    
                    />
                </Pressable>
                {title && title()}

                <View></View>
            </View>
            {children}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default CustomModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#000000CC',
    justifyContent: 'center',
    alignItems: 'center',
    padding:20,
    height:'100%',
    zIndex:1090
    // backgroundColor:'#fff'
  },
  modalContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 15,
    // height:'100%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 0,
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  closeText: {
    color: '#fff',
    fontWeight: '600',
  },
});
