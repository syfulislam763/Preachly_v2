import {StyleSheet, Dimensions} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
const { width, height } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.75;
import { deepGreen } from '../../components/Constant';

const baseStyle = StyleSheet.create({
  container: {flex:1, backgroundColor:'#fff', justifyContent:'space-between', padding: 10, paddingBottom:hp('2%')},
  title: {fontFamily:'DMSerifDisplay', fontSize:30, textAlign:'center', flexWrap:'wrap', paddingVertical: 40, paddingHorizontal: 10, lineHeight:35, color:'#0B172A'},
  subtitle: {fontFamily:'NunitoSemiBold', fontSize: 20, color: deepGreen},
  text: {fontFamily:'NunitoSemiBold', fontSize:18, color: '#2B4752', textAlign:'center', flexWrap:'wrap'},
  semitext: {color:'#90B2B2', fontFamily:'NunitoRegular', fontSize:14.5, textAlign:'center', flexWrap:'wrap', marginLeft:wp("1%") },
  img: {width:'100%',height: 180,objectFit:'contain'},
  caption: {display:'flex',flexDirection:'row', alignItems:'center',justifyContent:'center', marginTop:hp("1%")},
  textContainer:{paddingBottom:30}

})

export const getStyles = (isSmall, isMedium, isLarge, isFold) =>  {
  const styleContainer = {
    small: StyleSheet.create({
        container: {
            ...baseStyle.container
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
            ...baseStyle.text,
            fontSize:16
        },
        semitext: {
            ...baseStyle.semitext,
            marginBottom:3
        },
        img: {
            ...baseStyle.img,
            height:130,
            marginVertical:5
        },
        caption: {
            ...baseStyle.caption
        },
        textContainer: {
            ...baseStyle.textContainer,
            paddingBottom:4
        },

    }),
    medium: baseStyle,

    large: baseStyle,

    fold: baseStyle
  }
  return styleContainer[isSmall] || styleContainer[isMedium] || styleContainer[isLarge] || styleContainer[isFold]
};