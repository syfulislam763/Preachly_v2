import {StyleSheet, Dimensions} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
const { width, height } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.75;
import { deepGreen } from '../../components/Constant';
 
const baseStyle =  StyleSheet.create({
  footerHighlighter:{color:'black', textDecorationLine:'underline', fontFamily: 'NunitoExtraBold'},

  footerText:{fontSize:16, color:'#90B2B2', paddingHorizontal: 16, paddingVertical:20, textAlign:'center', fontFamily:'NunitoSemiBold', paddingBottom:100},

  googleAppleAuth:{
      display:"flex",
      flexDirection:"row",
      width: "30%",
      justifyContent:'space-between',
      padding: 40,
      boxSizing:'content-box'
  },
  background: {
    height: height*0.28,
    width:'100%'
  },
  content: {
    width:"100%",
    backgroundColor:'#fff',
    position:'absolute',
    top: height*0.22,
    left:0,
    right:0,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding:20,
  },
  title:{
    fontFamily:'DMSerifDisplay',
    fontSize:32,
    paddingHorizontal:32,
    paddingTop:10,
    lineHeight:35,
    color:'#0B172A',
    textAlign:'center'
  },
});


export const getStyles = (isSmall, isMedium, isLarge, isFold) =>  {
  const styleContainer = {
    small: StyleSheet.create({
      footerHighlighter:{
        ...baseStyle.footerHighlighter
      },
    
      footerText:{
        ...baseStyle.footerText,
        paddingVertical:5,
        fontSize: 14

      },
    
      googleAppleAuth:{
          ...baseStyle.googleAppleAuth
      },
      background: {
        ...baseStyle.background,
        height:hp("30%")
      },
      content: {
        ...baseStyle.content,
        top:hp("20%"),
        paddingTop:10
      },
    
      title:{
        ...baseStyle.title,
        paddingTop:0,
        lineHeight:26,
        fontSize:28,
        paddingHorizontal:10
      },
      
    }),

    medium: baseStyle,

    large: baseStyle,

    fold: baseStyle
  }
  return styleContainer[isSmall] || styleContainer[isMedium] || styleContainer[isLarge] || styleContainer[isFold]
};