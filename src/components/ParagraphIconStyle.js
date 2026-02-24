import {StyleSheet, Dimensions} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
import { deepGreen } from './Constant';
const { width, height } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.75;

const baseStyle = StyleSheet.create({
    container:{
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'flex-start',
        width:'100%',
        paddingVertical:10,
        paddingRight: 35
    },
    img: {
        height:25,
        width:25,
        objectFit: 'contain',
        marginRight:12
    },
    text: {
        fontFamily:'NunitoSemiBold',
        color:'#2B4752',
        fontSize: 18,
        flexWrap:'wrap',
    }
})


export const getStyles = (isSmall, isMedium, isLarge, isFold) =>  {
  const styleContainer = {
    small: StyleSheet.create({
        container:{
            ...baseStyle.container,
            paddingVertical:1,
            paddingRight: 35
        },
        img: {
            ...baseStyle.img,
            height:20,
            width:20,
        },
        text: {
            ...baseStyle.text,
            fontSize: 14
        }
    }),

    medium: baseStyle,

    large: baseStyle,

    fold: baseStyle
  }
  return styleContainer[isSmall] || styleContainer[isMedium] || styleContainer[isLarge] || styleContainer[isFold]
};