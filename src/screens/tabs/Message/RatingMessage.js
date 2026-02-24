import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native';
import CustomModal from '../../../components/CustomModal';
import CommonButton from '../../../components/CommonButton';
import { deepGreen, primaryText } from '../../../components/Constant';
import { useNavigation } from '@react-navigation/native';

const RatingMessage = ({visible, onClose, rating, setRatting}) => {

    const {navigation} = useNavigation()


  return (
    <CustomModal
        visible={visible}
        onClose={onClose}
        headerStyle={{
            paddingHorizontal: 10
        }}
    >
        <View style={{
            paddingHorizontal: 20
        }}>
            <Text style={styles.title}>
                Was this chat helpful?
            </Text>

            <View>
                <Text style={styles.subtitle}>Your opinion is very important to us, please</Text>
                <Text style={styles.subtitle}>rate how useful communication with</Text>
                <Text style={styles.subtitle}>the <Text style={{color:'#3F5862', fontFamily:'NunitoExtraBold'}}>Preachly</Text> was for you?</Text>
            </View>

            <View style={{
                display:'flex',
                flexDirection:'row',
                alignItems:'center',
                justifyContent:'center'
            }}>
                <Image
                    source={require("../../../../assets/img/Star.png")}
                    style={styles.star}
                />
                <Image
                    source={require("../../../../assets/img/Star.png")}
                    style={styles.star}
                />
                <Image
                    source={require("../../../../assets/img/Star.png")}
                    style={styles.star}
                />
                <Image
                    source={require("../../../../assets/img/Star.png")}
                    style={styles.star}
                />
                <Image
                    source={require("../../../../assets/img/Star.png")}
                    style={[styles.star,{marginRight:0}]}
                />
            </View>

            <View style={{paddingBottom:20}}>
                <CommonButton
                    btnText={"Submit"}
                    bgColor={deepGreen}
                    navigation={navigation}
                    route={""}
                    txtColor={primaryText}
                    bold='bold'
                    handler={() => setRatting(2)}
                    opacity={0.7}
                />
            </View>
        </View>
    </CustomModal>
  )
}

export default RatingMessage

const styles = StyleSheet.create({
    star:{
        height:40,
        width:40,
        objectFit:'contain',
        marginRight:7,
        marginVertical: 30
    },
    title: {
        fontFamily:"DMSerifDisplay",
        fontSize:30,
        color:'#0B172A',
        marginBottom: 30,
        textAlign:'center'
    },
    subtitle:{
        color:'#3F5862',
        fontFamily:'NunitoSemiBold',
        fontSize:16,
        textAlign:'center'
    },

})
