import {StyleSheet, Dimensions} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
const { width, height } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.75;
import { deepGreen } from './Constant';

const baseStyle =  StyleSheet.create({
  container: {
    padding: 0,
  },
  planContainer: {
    borderWidth: 1,
    borderColor: '#B0CFCB',
    borderRadius: 20,
    padding: 10,
    paddingHorizontal:15,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    width:'100%',
    
  },
  selectedPlan: {
    borderColor: '#005A55',
  },
  planTitle: {
    fontFamily:'NunitoSemiBold',
    fontSize: 16,
    color: '#0B1D26',
  },
  subText: {
    fontSize: 16,
    color: '#84B3B2',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  priceText: {
    fontSize: 18,
    fontFamily:"NunitoSemiBold",
    color: '#0B172A',
  },
  radioOuter: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#46636A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: '#005F56',
    borderWidth: 1,
  },
  radioInner: {
    width: 23,
    height: 23,
    borderRadius: 23/2,
    backgroundColor: '#005A55',
  },
  badge: {
    position: 'absolute',
    right: 16,
    top: -10,
    backgroundColor: '#005A55',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    color: 'white',
    fontFamily:'NunitoSemiBold',
    fontSize:14
  },
})


export const getStyles = (isSmall, isMedium, isLarge, isFold) =>  {
  const styleContainer = {
    small: StyleSheet.create({
    container: {
        padding: 0,
    },
    planContainer: {
        ...baseStyle.planContainer,
        padding: 7,
        paddingHorizontal:15,
        marginBottom: 15,
    },
    selectedPlan: {
        borderColor: '#005A55',
    },
    planTitle: {
        ...baseStyle.planTitle,
        fontSize:14
    },
    subText: {
        ...baseStyle.subText,
        fontSize: 12,
    },
    rightSection: {
        ...baseStyle.rightSection
    },
    priceText: {
        ...baseStyle.priceText,
        fontSize: 14,
    },
    radioOuter: {
        ...baseStyle.radioOuter,
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
    },
    radioOuterSelected: {
        ...baseStyle.radioOuterSelected,
    },
    radioInner: {
        ...baseStyle.radioInner,
        width: 14,
        height: 14,
        borderRadius: 7,
    },
    badge: {
        ...baseStyle.badge
    },
    badgeText: {
        ...baseStyle.badgeText,
        fontSize:13
    },
    }),

    medium: baseStyle,

    large: baseStyle,

    fold: baseStyle
  }
  return styleContainer[isSmall] || styleContainer[isMedium] || styleContainer[isLarge] || styleContainer[isFold]
};