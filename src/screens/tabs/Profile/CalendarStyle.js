import {StyleSheet, Dimensions} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
const screenWidth = Dimensions.get('window').width;
const calendarPadding = 10;
const daySize = (screenWidth - calendarPadding * 2) / 7 - 4;


const baseStyle =  StyleSheet.create({
  title:{
    fontFamily:'DMSerifDisplay',
    fontSize:32,
    textAlign:'center',
    color:'#0B172A'
  },
  text:{
    fontFamily:'NunitoSemiBold',
    fontSize: 16,
    color:'#2B4752',
    textAlign:'center',
    paddingHorizontal: 20
  },
  footerText:{
    color: '#90B2B2',
    fontFamily:'NunitoBold',
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#90B2B2'
  },
  day:{
    width: 40,
    height: 40,
    borderRadius: daySize / 2,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 7.5,
    zIndex:100,
  },
  dayText:{ 
    fontFamily:'NunitoSemiBold', 
    fontSize:18 
  },
  dayTitle:{ 
    width: 55, 
    textAlign: 'center', 
    fontFamily:'NunitoSemiBold',
    color:'#90B2B2', 
    fontSize:14 
  },
  weeklyCheckInImage:{
    height: 170,
    width:"100%",
    objectFit:'contain',
  }
})

export const getStyles = (isSmall, isMedium, isLarge, isFold) =>  {
  const styleContainer = {
    small: StyleSheet.create({
      title:{
        ...baseStyle.title
      },
      text:{
        ...baseStyle.text
      },
      footerText:{
        ...baseStyle.footerText
      },
      day:{
        ...baseStyle.day,
        margin: 7,
        height:32,
        width:32
      },
      dayText:{ 
        ...baseStyle.dayText,
        fontSize:14
      },
      dayTitle:{ 
        ...baseStyle.dayTitle,
        width: 46, 
        fontSize:14 
      },
      weeklyCheckInImage:{
        ...baseStyle.weeklyCheckInImage,
        height: 100,
      }
    }),

    medium: baseStyle,

    large: baseStyle,

    fold: baseStyle
  }
  return styleContainer[isSmall] || styleContainer[isMedium] || styleContainer[isLarge] || styleContainer[isFold]
};