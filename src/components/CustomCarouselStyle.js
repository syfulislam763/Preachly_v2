import {StyleSheet, Dimensions} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
const { width, height } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.75;

const baseStyle = StyleSheet.create({
    container: {
        marginTop: height*0.05,
        backgroundColor:'white',
    },

    fullWidthCaptionWrapper: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        alignItems: 'center',
        zIndex: 1,
    },
    fullWidthCaptionContainer: {
        width: width,
        paddingHorizontal: 20,
        paddingBottom: 15,
    },
    slideContainer: {
        width: ITEM_WIDTH,
        alignItems: 'center',
        marginTop: (height*19)/100, 
    },
    title: {
        color: '#0B172A',
        fontSize: 36,
        fontFamily: 'DMSerifDisplay',
        marginBottom: 8,
        textAlign: 'center',
        paddingTop: 20,
        width: '100%',
    },
    description: {
        fontSize: 19,
        textAlign: 'center',
        fontFamily: 'NunitoSemiBold',
        paddingTop: 10,
        paddingBottom: 10,
        color: '#2B4752',
        width: '100%',
        lineHeight:24
    },
    image: {
        width: "100%",
        height: height*0.48,
        resizeMode: 'cover',
        borderRadius: 30,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop:"5%",
        marginBottom:"0%"
    },
    dot: {
        height: 12,
        borderRadius: 50,
        marginHorizontal: 4,
        marginTop: 10
    },
})

export const getStyles = (isSmall, isMedium, isLarge, isFold) =>  {
  const styleContainer = {
    small: StyleSheet.create({
      container: {
        ...baseStyle.container,
        marginTop:0,
      },

      fullWidthCaptionWrapper: {
        ...baseStyle.fullWidthCaptionWrapper
      },
      fullWidthCaptionContainer: {
        ...baseStyle.fullWidthCaptionContainer
      },
      slideContainer: {
        ...baseStyle.slideContainer,
        marginTop: (height*18)/100, 
      },
      title: {
        ...baseStyle.title,
        fontSize: 28,
      },
      description: {
        ...baseStyle.description,
        fontSize: 14,
        lineHeight:18
      },
      image: {
        ...baseStyle.image,
        height: height*0.55,
      },
      pagination: {
        ...baseStyle.pagination,
        marginTop:'1%',
        marginBottom: "1%",
      },
      dot: {
        ...baseStyle.dot,
        marginTop:8
      },
    }),

    medium: baseStyle,

    large: baseStyle,

    fold: StyleSheet.create({
      container: {
        ...baseStyle.container,
      },

      fullWidthCaptionWrapper: {
        ...baseStyle.fullWidthCaptionWrapper
      },
      fullWidthCaptionContainer: {
        ...baseStyle.fullWidthCaptionContainer
      },
      slideContainer: {
        ...baseStyle.slideContainer,
      },
      title: {
        ...baseStyle.title,
      },
      description: {
        ...baseStyle.description,
      },
      image: {
        ...baseStyle.image,
        height: height*0.4,
        width: width*0.99,
        objectFit:'contain'
      },
      pagination: {
        ...baseStyle.pagination,
      },
      dot: {
        ...baseStyle.dot,
      },
    }),
  }
  return styleContainer[isSmall] || styleContainer[isMedium] || styleContainer[isLarge] || styleContainer[isFold]
};