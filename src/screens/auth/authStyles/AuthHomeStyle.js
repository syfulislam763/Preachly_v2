import {StyleSheet, Dimensions} from 'react-native'


const window = Dimensions.get("window")

const baseStyle = StyleSheet.create({
  footerHighlighter:{color:'black', textDecorationLine:'underline', fontFamily: 'NunitoExtraBold'},

  footerText:{fontSize:16, color:'#90B2B2', paddingRight:50, paddingLeft:50, paddingTop:30, paddingBottom:30, textAlign:'center', fontFamily:'NunitoSemiBold'},

  googleAppleAuth:{
      display:"flex",
      flexDirection:"row",
      width: "30%",
      justifyContent:'space-between',
      padding: 40,
      boxSizing:'content-box'
  },
  background: {
    height: (window.height*40)/100,
    width:'100%'
  },
  content: {
    width:"100%",
    backgroundColor:'#fff',
    position:'absolute',
    top: (window.height*28)/100,
    left:0,
    right:0,
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    padding:10,
  },
 
  title:{
    textAlign:'center',
    fontSize: 36,
    padding:30,
    paddingHorizontal:20,
    fontFamily: 'DMSerifDisplay',
    color: '#0B172A',
    lineHeight:38
  },
  subtitle:{
    fontSize:18,
    paddingBottom: 50,
    fontFamily: 'NunitoSemiBold',
    color:"#2B4752"
  },
  divider: {
    marginTop:20
  }
});

export const getStyles = (isSmall, isMedium, isLarge, isFold) => {
    const styleContainer = {
        small: StyleSheet.create({
          footerHighlighter:{
            ...baseStyle.footerHighlighter
          },
        
          footerText:{
            ...baseStyle.footerText,
            paddingTop:10,
            paddingLeft:30,
            paddingRight:30,
          },
        
          googleAppleAuth:{
            ...baseStyle.googleAppleAuth,
            paddingHorizontal:40,
            paddingVertical:10,
          },
          background: {
            ...baseStyle.background,
          
          },
          content: {
            ...baseStyle.content
          },
         
          title:{
            ...baseStyle.title,
            fontSize: 28,
            lineHeight:28,
            paddingVertical:15
          },
          subtitle:{
            ...baseStyle.subtitle,
            fontSize: 16,
            paddingBottom:20
          },
          divider:{
            ...baseStyle.divider,
            marginTop:0
          }
        }),
        medium: baseStyle,
        large: StyleSheet.create({
          footerHighlighter:{
            ...baseStyle.footerHighlighter
          },
        
          footerText:{
            ...baseStyle.footerText
          },
        
          googleAppleAuth:{
            ...baseStyle.googleAppleAuth
          },
          background: {
            ...baseStyle.background
          },
          content: {
            ...baseStyle.content
          },
         
          title:{
            ...baseStyle.title
          },
          subtitle:{
            ...baseStyle.subtitle
          },
          divider:{
            ...baseStyle.divider,
          }
        }),
        fold: baseStyle,

    }

    return styleContainer[isSmall] || styleContainer[isMedium] || styleContainer[isLarge] || styleContainer[isFold]
}