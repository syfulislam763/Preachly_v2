import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import ModalHeader from './ModalHeader';
import { useAuth } from '../../../context/AuthContext';

const initialVersions = [
  {
    id: '1',
    title: 'Revised Standard Version Catholic Edition [RSVCE]',
    subtitle:
      'The Catholic Edition of the Revised Standard Version by Catholic Book Publishing Corp. © 1966, 2000 by the Division of Christian Education of the National Council of the Churches of Christ in the USA',
  },
  {
    id: '2',
    title: 'New International Version (NIV)',
    subtitle: 'Zondervan, © 1973, 1978, 1984, 2011 by Biblica',
  },
  {
    id: '3',
    title: 'Christian Standard Bible (CSB)',
    subtitle: 'Holman Bible Publishers, © 2017 by Holman Bible Publisher',
  },
];

export default function BibleVersionList({selectedItem, setSelectedItem, onClose}) {
  const [selectedId, setSelectedId] = useState('1');
  const {store} = useAuth()


  const renderItem = ({ item }) => {
    const isSelected = item.api_bible_id === selectedItem?.api_bible_id;

    return (
      <TouchableOpacity
        style={{
          borderBottomWidth:1,
          borderBottomColor: "#EDF3F3"
        }}
        onPress={() => setSelectedItem(item)}
      >
        <View style={styles.itemContainer}>
          <View style={styles.radioCircleWrapper}>
            <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
              {isSelected && <View style={styles.radioInner} />}
            </View>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View>
        <View style={{
            paddingVertical:10,
            paddingHorizontal:20,
            backgroundColor:'#fff'
        }}>
            <ModalHeader
                title={"Bible Version"}
                onClose={onClose}
            />
        </View>
        <FlatList
            data={store?.bible_versions}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            contentContainerStyle={styles.container}
            extraData={selectedId}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 0,
    
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  radioCircleWrapper: {
    marginTop: 4,
    marginRight: 12,
  },
  radioOuter: {
    width: 30,
    height: 30,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#999',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: '#00695c',
  },
  radioInner: {
    width: 20,
    height: 20,
    borderRadius: 50,
    backgroundColor: '#00695c',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontFamily:'NunitoSemiBold',
    color:'#0B172A'
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
    color:'#607373',
    fontFamily:'NunitoSemiBold',

  },
  separator: {
    height: 1,
    marginHorizontal: 16,
  },
});
