import {StyleSheet, Dimensions} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
const { width, height } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.75;
import { deepGreen } from '../../../components/Constant';

const baseStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    position:'relative',
  },
  textContainer: {
    height: height * (1/5),
    width: '100%',
    backgroundColor:'#fff',
    marginTop:'8%',
    padding:20
  },
  bg_image: {
        height:'100%', 
        width:'100%', 
        objectFit:'contain',
        position:'absolute',
        top: (height*17)/100,
        left:0,
        right:0,
        bottom:0,
        zIndex: 1
    },
  btnContainer:{
    paddingHorizontal: 20,
    position:'absolute',
    bottom:(height*6)/100,
    left:0,
    right:0,
    zIndex: 5
  },
  successText: {
    fontSize: 32,
    fontFamily:'DMSerifDisplay',
    color:"#0B172A"
  },
  welcomeTitle: {
    fontSize: 32,
    fontFamily:'DMSerifDisplay',
    color:"#0B172A"
  },
  subtitle: {
    color: '#2B4752',
    textAlign: 'center',
    fontFamily:'NunitoSemiBold',
    fontSize: 18,
    padding: 20,
    lineHeight:22
  },
  
});


export const getStyles = (isSmall, isMedium, isLarge, isFold) =>  {
  const styleContainer = {
    small: StyleSheet.create({
    container: {
        ...baseStyle.container
    },
    textContainer: {
        ...baseStyle.textContainer,
        height:'auto',
        backgroundColor:'#fff',
        paddingBottom:0,
        paddingTop:0,
        marginTop: 0
    },
    bg_image: {
        ...baseStyle.imageSection
    },
    btnContainer:{
        ...baseStyle.btnContainer,
        bottom: hp("2%")
    },
    successText: {
        ...baseStyle.successText,
        fontSize:28
    },
    welcomeTitle: {
        ...baseStyle.welcomeTitle,
        fontSize:28
    },
    subtitle: {
        ...baseStyle.subtitle,
        paddingTop:10,
        paddingBottom:10,
        fontSize:16
    },
    }),

    medium: baseStyle,

    large: baseStyle,

    fold: baseStyle
  }
  return styleContainer[isSmall] || styleContainer[isMedium] || styleContainer[isLarge] || styleContainer[isFold]
};