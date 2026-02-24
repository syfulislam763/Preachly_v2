import {StyleSheet, Dimensions} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
const { width, height } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.75;

import { deepGreen, lightgreen1 } from '../../../../components/Constant';

const baseStyle = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 0,
    backgroundColor:'#fff'
  },
  card: {
    backgroundColor: '#edf4f5',
    paddingVertical:6,
    paddingHorizontal:20,
    borderRadius: 12,
    marginHorizontal:20,
    marginVertical:15
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    // borderBottomWidth: 1,
    // borderColor: '#dce3e4',

  },
  label: {
    fontSize: 16,
    color: '#0B172A',
    fontFamily:'NunitoBold',
    flex: 1,
  },
  valueContainer: {
    flex: 1,
    marginLeft: 10,
  },
  value: {
    fontSize: 16,
    color: '#2B4752',
    fontFamily:'NunitoBold',
    textAlign: 'right',
    
  },
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
    backgroundColor: '#96b8b9',
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
  inputFieldCard: {
    backgroundColor: '#f0f6f7',
    paddingHorizontal: 20,
    borderRadius: 12,
    marginHorizontal:20,
    elevation: 0,
  },
  inputFieldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
    
    paddingBottom: 0
  },
  inputFieldLabel: {
    fontSize: 16,
    color: '#0B172A',
    fontFamily:'NunitoBold',
    flex: 1,
  },
  inputField: {
    fontSize: 16,
    color: '#2B4752',
    fontFamily:'NunitoBold',
    flex: 1,
    padding: 8,
    textAlign: 'right',
  },
});

export const getStyles = (isSmall, isMedium, isLarge, isFold) =>  {
  const styleContainer = {
    small: baseStyle,
    medium: baseStyle,

    large: baseStyle,

    fold: baseStyle
  }
  return styleContainer[isSmall] || styleContainer[isMedium] || styleContainer[isLarge] || styleContainer[isFold]
};