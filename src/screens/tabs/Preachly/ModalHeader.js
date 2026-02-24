import React from 'react'
import { View, Text, StyleSheet, Pressable, Image} from 'react-native'


const ModalHeader = ({title, onClose}) => {
  return (
    <>
        <View style={styles.indicator} />
        
        {/* Header */}
        <View style={styles.header}>
        <Text style={styles.headerTitle}>
            {title}
        </Text>
        <Pressable 
            onPress={onClose}
        >
            <Image
                source={require("../../../../assets/img/Close_.png")}
                style={{
                    height:35,
                    width:35,
                    objectFit:'contain'
                }}
            />
        </Pressable>
        </View>

    </>
  )
}

export default ModalHeader

const styles = StyleSheet.create({  
  container: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 16,
    maxHeight: '100%',

  },
  indicator: {
    width: 40,
    height: 5,
    backgroundColor: '#90B2B2',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily:'NunitoExtraBold',
    color: '#0B172A',
  },
  closeBtn: {
    fontSize: 18,
    color: '#888',
  },
});