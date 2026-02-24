import {StyleSheet, Dimensions} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
const { width, height } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.75;

const baseStyle = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  questionBox: {
    backgroundColor: '#fff4dd',
    padding: 15,
    borderRadius: 20,
    marginBottom: 25,
  },
  questionText: {
    fontSize: 17,
    fontFamily:'NunitoBold',
    color: '#0B172A',
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  radioOuter: {
    height: 28,
    width: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#0b5c53',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  radioInner: {
    height: 19,
    width: 19,
    borderRadius: 50,
    backgroundColor: '#0b5c53',
  },
  optionText: {
    flex: 1,
    fontSize: 16,
    color: '#0B172A',
    fontFamily:'NunitoSemiBold'
  },
  navigation: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '45%'
  },
  dots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#c2d8d5',
    marginHorizontal: 2,
  },
  activeDot: {
    backgroundColor: '#0b5c53',
  },
});

export const getStyles = (isSmall, isMedium, isLarge, isFold) =>  {
  const styleContainer = {
    small: StyleSheet.create({
        container: {
            ...baseStyle.container
        },
        questionBox: {
            ...baseStyle.questionBox,
            marginBottom: 10
        },
        questionText: {
            ...baseStyle.questionText,
            fontSize: 15
        },
        radioRow: {
            ...baseStyle.radioRow,
            marginVertical:5
        },
        radioOuter: {
            ...baseStyle.radioOuter
        },
        radioInner: {
            ...baseStyle.radioInner
        },
        optionText: {
            ...baseStyle.optionText
        },
        navigation: {
            ...baseStyle.navigation,
            marginTop: 10
        },
        dots: {
            ...baseStyle.dots
        },
        dot: {
            ...baseStyle.dot
        },
        activeDot: {
            ...baseStyle.activeDot
        },
    }),
    medium: baseStyle,

    large: baseStyle,

    fold: baseStyle
  }
  return styleContainer[isSmall] || styleContainer[isMedium] || styleContainer[isLarge] || styleContainer[isFold]
};