import {StyleSheet, Dimensions} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
const {height, width} = Dimensions.get('window');



const baseStyle =  StyleSheet.create({
    slideContainer:{ 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginTop: 100 ,
        position:'relative',
        backgroundColor:'#fff',
        height:350,
    },
    cardContainer:{
        backgroundColor:'#EDF3F3',
        height: 350,
        width: '110%',
        borderRadius: '50%',
        overflow:'hidden',
        zIndex: 1,
        
    },
    cardOne:{
        backgroundColor:'#67B7B7',
        height: 350,
        width: `${50}%`,
        overflow:'hidden',
        position:'absolute',
        zIndex:2,
        left:0
    },
    cardTwo:{
        backgroundColor:'#fff',
        height: 330,
        width: `${95}%`,
        overflow:'hidden',
        position:'absolute',
        borderRadius:'50%',
        zIndex:3,
        top: 10,
        left:10
        // left:0,
        // bottom:0
    },
    cardThree:{
        backgroundColor:'#fff',
        height: 350/2,
        width: `${100}%`,
        overflow:'hidden',
        position:'absolute',
        zIndex:4,
        bottom:0
    },
    dotContainer:{
        backgroundColor:'#fff',
        zIndex:10,
        height:30,
        width:30,
        borderRadius: '50%',
        
        position:'absolute',
        left:100,
        top:100,
        
        display:'flex',
        alignItems:'center',
        justifyContent:'center'
    },
    dot:{
        backgroundColor:'#004F4A',
        height:20,
        width:20,
        borderRadius:'50%',
        display:'flex',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    }
})

export const getStyles = (isSmall, isMedium, isLarge, isFold) =>  {
  const styleContainer = {
    small:StyleSheet.create({
        slideContainer:{ 
            ...baseStyle.slideContainer
        },
        cardContainer:{
            ...baseStyle.cardContainer
        },
        cardOne:{
           ...baseStyle.cardOne
        },
        cardTwo:{
            ...baseStyle.cardTwo
        },
        cardThree:{
            ...baseStyle.cardThree
        },
        dotContainer:{
            ...baseStyle.dotContainer
        },
        dot:{
            ...baseStyle.dot
        }
    }),

    medium: baseStyle,

    large: baseStyle,

    fold: baseStyle
  }
  return styleContainer[isSmall] || styleContainer[isMedium] || styleContainer[isLarge] || styleContainer[isFold]
};