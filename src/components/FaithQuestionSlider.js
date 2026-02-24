
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Dimensions,Image, Pressable, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';
import useLayoutDimention from '../hooks/useLayoutDimention'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'


const window = Dimensions.get("window")
const InactiveColor = "#90B2B2"
const ActiveColor = "#004F4A"

const progressPercentage = {
    0: 10,
    1: 30,
    2: 50,
    3: 70,
    4: 100
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
    <SafeAreaView style={{
        flex:1,
        backgroundColor:'#fff'
    }}>
        <View style={{...styles.slideContainer, marginTop: isSmall?height*0.05:height*0.1}}>

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
                left={(window.width*46)/100}
                top={ activeDot[2]?-15:-12}
                pressEvent={progressHandler}
                activeDot={activeDot}
                group={group}
            />
            <Dot
                dotNumber={0}
                left={(window.width*4)/100}
                top={ activeDot[0]?50:55}
                pressEvent={progressHandler}
                activeDot={activeDot}
                group={group}
            />
            <Dot
                dotNumber={1}
                left={(window.width*23.5)/100}
                top={ activeDot[1]?1:6}
                pressEvent={progressHandler}
                activeDot={activeDot}
                group={group}
            />
            <Dot
                dotNumber={3}
                left={ (window.width*69)/100}
                top={ activeDot[3]?3:6}
                pressEvent={progressHandler}
                activeDot={activeDot}
                group={group}
            />
            <Dot
                dotNumber={4}
                left={(window.width*87)/100}
                top={ activeDot[4]?49:50}
                pressEvent={progressHandler}
                activeDot={activeDot}
                group={group}
            />
            
        </View>
    </SafeAreaView>
  );
};

export default FaithQuestionSlider;



const styles = StyleSheet.create({
    slideContainer:{ 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginTop: 100 ,
        position:'relative',
        backgroundColor:'#fff',
        height:350,
        width:"100%"
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
        left:0,
        width: '110%',
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
        left:10,
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