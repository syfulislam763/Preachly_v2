import {StyleSheet, Dimensions} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
const {height, width} = Dimensions.get('window');



const baseStyle =  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'#fff',
    position:'relative'
  },
  textContainer: {
    height: height * (1/5),
    width: '100%',
    backgroundColor:'#fff',
    marginTop:'8%',
    padding:20
  },
  
  btnContainer:{
    paddingHorizontal: 20,
    position:'absolute',
    bottom:30,
    left:0,
    right:0,
    zIndex: 1
  },
  title:{
    fontFamily:'DMSerifDisplay',
    fontSize:32,
    color:'#0B172A',
    textAlign:'center',
  },
  text:{
    fontFamily:"NunitoBold",
    color:"#2B4752",
    fontSize: 17,
    textAlign:'center',
    paddingHorizontal:20
  },

  bg_image:{
      height: hp('100%'), 
      width: wp('100%'), 
      objectFit:'contain',
      position:'absolute',
      top: height*0.2,
      left:0,
      right:0,
      zIndex: 1
  }
});

export const getStyles = (isSmall, isMedium, isLarge, isFold) =>  {
  const styleContainer = {
    small:StyleSheet.create({
        container: {
            ...baseStyle.container
        },
        textContainer: {
            ...baseStyle.textContainer,
            height: 'auto',
            marginTop:'0%',
            padding:0
        },
        
        btnContainer:{
            ...baseStyle.btnContainer,
            paddingHorizontal: 20,
            bottom:30,
        },
        title:{
            ...baseStyle.title,
            fontSize:28,
        },
        text:{
            ...baseStyle.text,
            fontSize: 14,
            paddingHorizontal:20
        },

        bg_image:{
            ...baseStyle.bg_image,
            top: hp("25%"),
        }
    }),

    medium: baseStyle,

    large: baseStyle,

    fold: baseStyle
  }
  return styleContainer[isSmall] || styleContainer[isMedium] || styleContainer[isLarge] || styleContainer[isFold]
};