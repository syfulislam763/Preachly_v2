import {StyleSheet, Dimensions} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
const { width, height } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.75;

const baseStyle = StyleSheet.create({
  container: {flex:1, backgroundColor:'#fff', justifyContent:'space-between', paddingHorizontal: 20, paddingBottom: 60, paddingTop:10},
  title: {fontFamily:'DMSerifDisplay', fontSize:30, textAlign:'center', flexWrap:'wrap', paddingTop: 35, paddingBottom: 25, paddingHorizontal: 70, color:'#0B172A', lineHeight:35},
  text: {fontFamily:'NunitoSemiBold', fontSize:18, color: '#2B4752', textAlign:'center', flexWrap:'wrap', paddingBottom: 50, paddingHorizontal: 20},
  
})

export const getStyles = (isSmall, isMedium, isLarge, isFold) =>  {
  const styleContainer = {
    small: StyleSheet.create({
            container: {
                ...baseStyle.container,
                paddingBottom:20
            },
            title: {
                ...baseStyle.title,
                paddingTop:10,
                paddingBottom:10,
                paddingHorizontal:0,
                fontSize: 28
            },
            text: {
                ...baseStyle.text,
                fontSize:16,
                paddingBottom:10,
                paddingHorizontal:0
            },
        }),

    medium: baseStyle,

    large: baseStyle,

    fold: StyleSheet.create({
            container: {
                ...baseStyle.container
            },
            title: {
                ...baseStyle.title
            },
            text: {
                ...baseStyle.text
            },
        }),
  }
  return styleContainer[isSmall] || styleContainer[isMedium] || styleContainer[isLarge] || styleContainer[isFold]
};