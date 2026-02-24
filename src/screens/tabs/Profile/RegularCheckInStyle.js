import {StyleSheet, Dimensions} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
const screenWidth = Dimensions.get('window').width;



const baseStyle =  StyleSheet.create({
    container:{flex:1, backgroundColor:'#fff', alignItems:'center',  paddingHorizontal:20, paddingVertical:40},
    title:{
        fontFamily:'DMSerifDisplay',
        fontSize:32,
        color:'#0B172A',
        paddingVertical:40,
        textAlign:'center'
    },
    text:{
        fontFamily:'NunitoSemiBold',
        fontSize: 17,
        color:'#2B4752',
        textAlign:'center',
        paddingBottom: 50
    },
    img:{
        height:250,
        width: 200,
        objectFit:'contain',
        backgroundColor:'#fff',
        marginTop:hp("5%")
    }
})

export const getStyles = (isSmall, isMedium, isLarge, isFold) =>  {
  const styleContainer = {
    small:StyleSheet.create({
        container:{
            ...baseStyle.container,
            paddingVertical:0
        },
        title:{
            ...baseStyle.title,
            paddingVertical:10
        },
        text:{
            ...baseStyle.text
        },
        img:{
            ...baseStyle.img,
            height:hp("30%"),
            width:wp("100%")
        }
    }),

    medium: baseStyle,

    large: baseStyle,

    fold: baseStyle
  }
  return styleContainer[isSmall] || styleContainer[isMedium] || styleContainer[isLarge] || styleContainer[isFold]
};