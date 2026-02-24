import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
  Image,
} from 'react-native';

// Enable layout animation for Android
// if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
//   UIManager.setLayoutAnimationEnabledExperimental(true);
// }

const SelectableCard = ({
  title,
  description,
  quote,
  selected,
  onSelect,
  index,
  icon
}) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { borderColor: selected ? '#00695C' : '#AFC5C5' },
      ]}
      onPress={() => onSelect(index)}
      activeOpacity={0.9}
    >
      <View style={styles.header}>
        {/* Replace this with your custom icon */}
        {/* <Text style={styles.leafIcon}>🍃</Text> */}
        <Image
            source={icon}
            style={{...styles.icon, marginRight:15}}
        />

        <Text style={styles.title}>{title}</Text>

        <TouchableOpacity onPress={toggleExpand}>
            {expanded?<Image
                source={require("../../assets/img/CaretUp.png")}
                style={styles.icon}
            /> :<Image
                source={require("../../assets/img/CaretDown.png")}
                style={styles.icon}
            />}
          {/* <Text style={styles.arrow}>{expanded ? '▲' : '▼'}</Text> */}
        </TouchableOpacity>

        <View style={styles.radioContainer}>
          <View style={styles.radioOuter}>
            {selected && <View style={styles.radioInner} />}
          </View>
        </View>
      </View>

      {expanded && (
        <View style={styles.body}>
          <Text style={styles.description}>{description}</Text>
          <Text style={styles.quote}>
            <Text style={{ fontFamily:'NunitoExtraBold', color:'#0B172A', fontSize:17, fontStyle: 'italic' }}>{quote}</Text>
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    borderRadius: 18,
    padding: 14,
    marginVertical: 8,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  leafIcon: {
    fontSize: 18,
    marginRight: 8,
    color: '#A46B36', // Replace with your own icon color
  },
  title: {
    flex: 1,
    fontSize: 18,
    color: '#0B172A',
    fontFamily:'NunitoBold'
  },
  arrow: {
    fontSize: 16,
    color: '#9BB0AF',
    paddingHorizontal: 8,
  },
  radioContainer: {
    paddingLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#3F5862',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  radioInner: {
    width: 17,
    height: 17,
    borderRadius: 17/2,
    backgroundColor: '#00695C',
  },
  body: {
    marginTop: 12,
  },
  description: {
    fontSize: 16,
    color: '#4C5B5C',
    marginBottom: 8,
    fontFamily:'NunitoSemiBold'
  },
  quote: {
    fontSize: 17,
    color: '#0B172A',
    fontFamily:'NunitoExtraBold'
  },
  icon:{
        height:30,
        width:30,
        objectFit:'contain'
    }
});

export default SelectableCard;
