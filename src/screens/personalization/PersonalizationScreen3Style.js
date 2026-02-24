import {StyleSheet, Dimensions} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
const { width, height } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.75;

const baseStyle =  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: hp("2%"),
    paddingTop: hp('1%')
  },
  title: {
    fontFamily: 'DMSerifDisplay',
    fontSize: 30,
    textAlign: 'center',
    flexWrap: 'wrap',
    paddingTop: 35,
    paddingBottom: 25,
    paddingHorizontal: 0,
    color: '#0B172'
  },
  text: {
    fontFamily: 'NunitoSemiBold',
    fontSize: 18,
    color: '#2B4752',
    textAlign: 'center',
    flexWrap: 'wrap',
    paddingBottom: hp("3%"),
    paddingHorizontal: 0
  },
  footerText: {
    color: "#90B2B2",
    fontFamily: 'NunitoSemiBold',
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 30,
    textAlign: 'center'
  }
});


export const getStyles = (isSmall, isMedium, isLarge, isFold) =>  {
  const styleContainer = {
    small:  StyleSheet.create({
        container: {
            ...baseStyle.container,
            paddingBottom:hp("0%")
        },
        title: {
            ...baseStyle.title,
            paddingTop:10,
            paddingBottom:10,
            fontSize:28
        },
        text: {
            ...baseStyle.text,
            fontSize:16
        },
        footerText: {
            ...baseStyle.footerText
        }
    }),

    medium: baseStyle,

    large: baseStyle,

    fold: baseStyle
  }
  return styleContainer[isSmall] || styleContainer[isMedium] || styleContainer[isLarge] || styleContainer[isFold]
};