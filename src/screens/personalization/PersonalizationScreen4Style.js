import {StyleSheet, Dimensions} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
const { width, height } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.75;
import { deepGreen } from '../../components/Constant';

const baseStyle = StyleSheet.create({
  container: {flex:1, backgroundColor:'#fff', justifyContent:'space-between', padding: 10, paddingBottom:30},
  title: {fontFamily:'DMSerifDisplay', fontSize:30, textAlign:'center', flexWrap:'wrap', paddingVertical: 40, paddingHorizontal: 40, color:'#0B172A', lineHeight:35},
  subtitle: {fontFamily:'NunitoBold', fontSize: 25, color: deepGreen, textAlign:'center'},
  text: {fontFamily:'NunitoSemiBold', fontSize:18, color: '#2B4752', textAlign:'center', flexWrap:'wrap'},
  semitext: {color:'#90B2B2', fontFamily:'NunitoRegular', fontSize:16, textAlign:'center', flexWrap:'wrap', paddingVertical:30},
  img: { height:130,width: 120, objectFit:'contain'},
  imageContainer: {display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between', backgroundColor:'#fff'},
  textContainer:{paddingHorizontal:25, paddingVertical:30}
})

export const getStyles = (isSmall, isMedium, isLarge, isFold) =>  {
  const styleContainer = {
    small: StyleSheet.create({
      container: {
        ...baseStyle.container,
      },
      title: {
        ...baseStyle.title,
        paddingVertical:10,
        paddingHorizontal:0,
        fontSize:28
      },
      subtitle: {
        ...baseStyle.subtitle
      },
      text: {
        ...baseStyle.text
      },
      semitext: {
        ...baseStyle.semitext,
        paddingVertical:10
      },
      img: { 
        ...baseStyle.img
      },
      imageContainer: {
        ...baseStyle.imageContainer
      },
      textContainer:{
        ...baseStyle.textContainer,
        paddingVertical:10
      }
    
    }),
    medium: baseStyle,

    large: baseStyle,

    fold: baseStyle
  }
  return styleContainer[isSmall] || styleContainer[isMedium] || styleContainer[isLarge] || styleContainer[isFold]
};