import { Modal, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { View, Text } from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'

const DropdownModal = ({ isVisible, onClose, handleChage, options, selectedItem }) => (
  <Modal
    visible={isVisible}
    transparent={true}
    animationType="slide"
    onRequestClose={onClose}
    presentationStyle='overFullScreen'
    statusBarTranslucent={true}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContainer}>
        <View style={{
          alignItems:'center',
          justifyContent:'center',
          width:'100%'
        }}>
          <View 
            style={{
              backgroundColor:'#ACC6C5',
              height:6,
              width:50,
              borderRadius: 2
            }}
          />
        </View>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={options}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.optionRow}
              onPress={() => handleChage(item)}
            >
              <Text style={styles.optionText}>{item?.name}</Text>
              <View style={[
                styles.radioCircle,
                selectedItem?.name === item?.name && {borderColor:'#005A55'}
              ]}>
                <View style={selectedItem?.name === item.name? styles.radioSelected:{}} />
              </View>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity
          style={styles.selectBtn}
          onPress={onClose}
        >
          <Text style={styles.selectBtnText}>Select</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);


const styles = StyleSheet.create({
  
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000055',
    justifyContent: 'flex-end',

  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: hp('60%'),
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',


    paddingVertical: 17,
   
  },
  optionText: {
    fontFamily:'NunitoBold',
    fontSize: 18,
    color: '#0B172A',
    flex: 1,
  },
  radioCircle: {
    height: 30,
    width: 30,
    borderRadius: 30/2,
    borderWidth: 2,
    borderColor: '#3F5862',
    marginLeft: 10,
    alignItems:'center',
    justifyContent:'center'
  },
  radioSelected: {
    backgroundColor: '#005A55',
    height: 20,
    width: 20,
    borderRadius: 10,
  },
  selectBtn: {
    backgroundColor: '#005A55',
    paddingVertical: hp("2%"),
    borderRadius: 27,
    alignItems: 'center',
    marginTop: hp("1%"),
    marginBottom : hp("1%")
  },
  selectBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default DropdownModal



