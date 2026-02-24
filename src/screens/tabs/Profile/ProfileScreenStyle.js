import {StyleSheet, Dimensions} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
const { width, height } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.75;


const baseStyle =  StyleSheet.create({
  tootltipText:{
    fontFamily:'NunitoSemiBold',
    fontSize:14,
    color:'#966F44'
  },
  tooltip: {
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    width: 100
  },
  menuText:{
    fontFamily:'NunitoSemiBold',
    color:'#0B172A',
    fontSize: 18
  },
  weeklyCheckIn:{
    display: 'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    backgroundColor:'#F3F8F8',
    padding: 15,
    borderRadius: 20,
  },
  caretRight:{
    width:20,
    height:20,
    objectFit:"contain"
  },
  semitext: {color:'#90B2B2', fontFamily:'NunitoRegular', fontSize:16, textAlign:'center', flexWrap:'wrap', },
  caption: {display:'flex',flexDirection:'row', alignItems:'center',justifyContent:'center', marginTop: hp("1.5%")},
  img: {width:'100%',height: 150,objectFit:'contain'},
  headerContainer:{
    position:'relative'
  },
  profileContainer:{
    position: 'absolute',
    top: hp("14%"),
    left: (width*38)/100,
    display:'flex',
    flexDirection:'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: hp("18%"),
    zIndex:100
  },
  profileText:{
    fontSize: 20,
    fontFamily: 'NunitoBold',
    color:'#0B172A',
    marginTop: hp("1%")
  },
  iconContainer:{
    position:"absolute",
    top: 30,
    right: 30,
    display:'flex',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between',
    width:  80,
    paddingTop: 20
  },
  icon:{
    width: 25,
    height: 25,
    objectFit:'contain'
  },
  profileImage:{
    width: 100,
    height: 100,
    objectFit:'contain'
  },
  bgImage:{
    width:"100%",
    height: hp("21%"),
    objectFit:'cover',
    borderBottomRightRadius: hp("5%"),
    borderBottomLeftRadius: hp("5%")
  },
  semiContainer:{
        marginTop: hp("11%"),
        paddingHorizontal: 20
    }
});


export const getStyles = (isSmall, isMedium, isLarge, isFold) =>  {
  const styleContainer = {
    small: StyleSheet.create({
      tootltipText:{
        ...baseStyle.tootltipText
      },
      tooltip: {
        ...baseStyle.tooltip
      },
      menuText:{
        ...baseStyle.menuText
      },
      weeklyCheckIn:{
        ...baseStyle.weeklyCheckIn,
        paddingHorizontal:20,
        paddingVertical:3,
      },
      caretRight:{
        ...baseStyle.caretRight
      },
      semitext: {
        ...baseStyle.semitext
      },
      caption: {
        ...baseStyle.caption,
        marginTop: hp("0.5%")
      },
      img: {
        ...baseStyle.img,
        height:130
      },
      headerContainer:{
        position:'relative'
      },
      profileContainer:{
        ...baseStyle.profileContainer,
        left: wp("37%"),
        top: hp("13%")
        
      },
      profileText:{
        ...baseStyle.profileText,
        fontSize:14
      },
      iconContainer:{
        ...baseStyle.iconContainer
      },
      icon:{
        ...baseStyle.icon
      },
      profileImage:{
        ...baseStyle.profileImage,
        height:80,
        width:80
      },
      bgImage:{
       ...baseStyle.bgImage
      },
      semiContainer:{
        ...baseStyle.semiContainer,
        marginTop:hp("9%")
      }
    }),

    medium: baseStyle,

    large: baseStyle,

    fold: baseStyle
  }
  return styleContainer[isSmall] || styleContainer[isMedium] || styleContainer[isLarge] || styleContainer[isFold]
};