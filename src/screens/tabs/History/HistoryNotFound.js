import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import CommonButton from '../../../components/CommonButton'
import { useNavigation } from '@react-navigation/native'

const HistoryNotFound = ({title, text, route, starIcon}) => {
    const navigation = useNavigation();

    const renderText = () => {
        if (!starIcon || !text.includes('{{}}')) {
            return <Text style={styles.text}>{text}</Text>;
        }

        const [before, after] = text.split('{{}}');

        return (
            <Text style={styles.text}>
                {before}
                <Image 
                    source={starIcon} 
                    style={{ 
                        width: 16, 
                        height: 16,
                        transform: [{ translateY: 2 }]
                    }} 
                />
                {after}
            </Text>
        );
    };

  return (
    <View style={styles.container}>

        <Text style={styles.title}>{title}</Text>

        {renderText()}

        <CommonButton
            btnText={"Ask Preachly"}
            bgColor={"#005A55"}
            route={""}
            handler={() => navigation.navigate(route)}
            txtColor={"#fff"}
            opacity={1}
        />
    </View>
  )
}

export default HistoryNotFound

const styles = StyleSheet.create({
    container:{
        display:'flex',
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        paddingVertical: 100
    },
    title:{
        fontFamily: 'DMSerifDisplay',
        fontSize: 32,
        color:'#0B172A',
        paddingBottom: 30
    },
    text:{
        fontFamily:'NunitoSemiBold',
        fontSize:17,
        color:'#2B4752',
        paddingHorizontal: 20,
        textAlign:'center',
        paddingBottom: 70,
        alignItems:'center'
    }
})