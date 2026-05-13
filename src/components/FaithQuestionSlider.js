
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions,Image, Pressable, Text, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';
import useLayoutDimention from '../hooks/useLayoutDimention'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'

const isIPad = Platform.OS === 'ios' && Platform.isPad;
const window = Dimensions.get("window")
const InactiveColor = "#90B2B2"
const ActiveColor = "#004F4A"

const progressPercentage = {
    0: isIPad? 15: 10,
    1: isIPad? 30: 30,
    2: isIPad? 50: 50,
    3: isIPad? 70: 70,
    4: isIPad? 100:100
}

const Dot = ({dotNumber=0, left, top,activeDot,group, pressEvent}) => {
    return <Pressable
                onPress={()=>pressEvent(dotNumber)}
                style={{
                    ...styles.dotContainer,
                    left: left,
                    top: top,
                    height: activeDot[dotNumber]?40:30,
                    width: activeDot[dotNumber]?40:30,
                    
                }}
            >
                {
                    activeDot[dotNumber]?<View style={{
                        ...styles.dot,
                        height: activeDot[dotNumber]?30:20,
                        width: activeDot[dotNumber]?30:20,
                        padding: activeDot[dotNumber]?5:0
                    }}>
                        <AntDesign name="left" size={10} color="white" />
                        <AntDesign name="right" size={10} color="white" />
                    </View>:
                    <View style={{
                        ...styles.dot,
                        backgroundColor: group[dotNumber]?ActiveColor:InactiveColor
                    }}>
                    
                    </View>
                }
                
            </Pressable>
}
  

function FaithQuestionSlider({Answers, selectedOption=0, ans, setAns}) {

    const {isSmall,isMedium, height} = useLayoutDimention()

    const [progress, setProgress] = useState(0)
    const [activeDot, setActiveDot] = useState({0:false,1:false,2:false,3:false, 4:false})

    const [group, setGroup] = useState({0:false,1:false,2:false,3:false, 4:false})

    const handleActiveDots = (label)=>{
        let temp = {0:false,1:false,2:false,3:false, 4:false}
        temp[label] = true;
        setActiveDot({...temp})
    }

    const handleGroupDots = (label)=>{
        let temp = {0:false,1:false,2:false,3:false, 4:false}
        for(let i=0;i<=label;i++){
            temp[i]=true
        }
        setGroup({...temp})
    }

    const progressHandler = (label) =>{
        setProgress(progressPercentage[label])
        handleActiveDots(label)
        handleGroupDots(label)
        setAns(Answers[label])
    }

   useEffect(()=>{
    progressHandler(selectedOption)
   },[Answers])
 
  return (
    <View style={{
        // flex:1,
        backgroundColor:'#fff'
    }}>
        <View style={{...styles.slideContainer}}>

            <View style={styles.cardContainer} >


                <View style={{...styles.cardOne, width: `${progress}%`,}}></View>

                <View style={styles.cardTwo}></View>


                <View style={styles.cardThree}></View>
            </View>

            {/* middle dot*/}
            
            <View style={{
                width:"100%",
                zIndex:20,
                position:'absolute'
            }}>
                <Text style={{
                    fontFamily:'DMSerifDisplay',
                    fontSize:hp("4%"),
                    textAlign:'center',
                    color:'#0B172A'
                }}>{ans?.option_text}</Text>
            </View>

            
            <Dot
                dotNumber={2}
                left={isIPad?(window.width*48)/100:(window.width*46)/100}
                top={isIPad? (activeDot[2]?-18:-10):(activeDot[2]?-15:-12)}
                pressEvent={progressHandler}
                activeDot={activeDot}
                group={group}
            />
            <Dot
                dotNumber={0}
                left={isIPad?(window.width*10)/100:(window.width*4)/100}
                top={ isIPad? (activeDot[0]?100:112) : (activeDot[0]?65:70)}
                pressEvent={progressHandler}
                activeDot={activeDot}
                group={group}
            />
            <Dot
                dotNumber={1}
                left={isIPad?(window.width*27)/100 : (window.width*23.5)/100}
                top={ isIPad? (activeDot[1]?15:25) : (activeDot[1]?1:6)}
                pressEvent={progressHandler}
                activeDot={activeDot}
                group={group}
            />
            <Dot
                dotNumber={3}
                left={ isIPad?(window.width*71)/100 : (window.width*69)/100}
                top={ isIPad? (activeDot[3]?15:18) : (activeDot[3]?8:10)}
                pressEvent={progressHandler}
                activeDot={activeDot}
                group={group}
            />
            <Dot
                dotNumber={4}
                left={(window.width*87)/100}
                top={ isIPad ? (activeDot[4]?90:90) : (activeDot[4]?67:70)}
                pressEvent={progressHandler}
                activeDot={activeDot}
                group={group}
            />
            
        </View>
    </View>
  );
};

export default FaithQuestionSlider;



const styles = StyleSheet.create({
    slideContainer:{ 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginTop: 0 ,
        position:'relative',
        backgroundColor:'#fff',
        height:isIPad? 600: 350,
        width:"100%"
    },
    cardContainer:{
        backgroundColor:'#EDF3F3',
        height: isIPad? 600: 350,
        width: '110%',
        borderRadius: '50%',
        overflow:'hidden',
        zIndex: 1,
        
    },
    cardOne:{
        backgroundColor:'#67B7B7',
        height: isIPad? 600: 350,
        width: `${50}%`,
        overflow:'hidden',
        position:'absolute',
        zIndex:2,
        left:0,
        width: '110%',
    },
    cardTwo:{
        backgroundColor:'#fff',
        height: isIPad? 600: 330,
        width: `${isIPad?97.3:95}%`,
        overflow:'hidden',
        position:'absolute',
        borderRadius:'50%',
        zIndex:3,
        top: 10,
        left:10,
        // left:0,
        // bottom:0
    },
    cardThree:{
        backgroundColor:'#fff',
        height: isIPad? 600/2: 350/2,
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