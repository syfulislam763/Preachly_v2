import React from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import useLayoutDimention from '../hooks/useLayoutDimention'
import { getStyles } from './ParagraphIconStyle'

const ParagraphIcon = ({icon, text, textStyle={}}) => {
    const {isSmall, isMedium, isLarge,isFold} = useLayoutDimention()
    const styles = getStyles(isSmall, isMedium, isLarge, isFold)
  return (
    <View style={styles.container}>
        <Image 
        source={icon}
        style={styles.img}
        />
        <Text style={{...styles.text, ...textStyle}}>{text}</Text>
    </View>
  )
}

export default ParagraphIcon

