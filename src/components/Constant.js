import BackButton from "./BackButton";


export const deepGreen = "#005A55";
export const lighgreen = "#9bb3ad";
export const lightgreen1 = "#EDF3F3"
export const primaryText = "#fff";
export const secondaryText = "#000"
export const primaryTitle = "#000";
export const primaryQuestionBg = "#FDF2D8";

export const primaryTextSize = 16;
export const primaryTitleSize = 32;
export const primaryDelete = "#D85B4B"

export const slideStyle = {
          width: 10,
          height: 10,
          borderRadius: 50,
          backgroundColor: lighgreen,
        }
export const activeSlideStyle = {
          overflow: 'hidden',
          backgroundColor: deepGreen,
        }

export const commonNavigationOptions =  ({ navigation }) => ({
    title: "",
    headerTitleAlign: "center",
    headerShadowVisible: false,
    headerTitleStyle: {
      fontFamily: 'NunitoSemiBold',
      color: '#0b172A',
    },
    headerStyle: {
      elevation: 0,
      shadowOpacity: 0,
      borderBottomWidth: 0,
      backgroundColor: '#fff',
    },
    headerLeft: () => <BackButton navigation={navigation}/>
  })
