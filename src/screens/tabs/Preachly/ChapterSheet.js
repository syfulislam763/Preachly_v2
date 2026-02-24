import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView,Image } from 'react-native';
import ModalHeader from './ModalHeader';

const chapters = [
  { title: 'Genesis',chapters: Array.from({ length: 10 }, (_, i) => i + 1) },
  { title: 'Exodus',chapters: Array.from({ length: 24 }, (_, i) => i + 1) },
  { title: 'Numbers',chapters: Array.from({ length: 5 }, (_, i) => i + 1) },
  { title: 'Deuteronomy',chapters: Array.from({ length: 24 }, (_, i) => i + 1) },
  { title: 'Joshua', chapters: Array.from({ length: 24 }, (_, i) => i + 1) },
  { title: 'Judges',chapters: Array.from({ length: 15 }, (_, i) => i + 1) },
  { title: 'Ruth' },
  { title: '1 Samuel',chapters: Array.from({ length: 24 }, (_, i) => i + 1) },
  // add more chapters if needed
]

const ChapterSheet = ({
  onClose=()=>{},
  handleContent=()=>{},
  handleExpand=()=>{},
  bible={},
  chapters=[],
  expanded,
  selected
}) => {
  


  
  return (
    <View style={styles.container}>
      {/* Handle Indicator */}
      
      <ModalHeader
        title={"Chapter"}
        onClose={onClose}
      />

      {/* List */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {bible?.books?.map((item, idx) => (
          <View key={idx}>
            <TouchableOpacity 
              style={(expanded === item.name && item.chapters )?{...styles.row, borderBottomWidth:0}: styles.row}
              onPress={() => handleExpand(item, bible.bible_id)}
            >
              <Text style={styles.rowText}>{item.name}</Text>
              <Image 
                source={(expanded === item.name && item.chapters )? require('../../../../assets/img/24-caret-down.png'):require("../../../../assets/img/24-caret-right.png")}
                style={
                    styles.rowArrow
                }
              />
            </TouchableOpacity>

            {/* Numbers grid if expanded */}
            {(expanded === item.name && item.chapters ) && (
              <View style={styles.grid}>
                {chapters.map((chapt) => (
                    <TouchableOpacity
                      key={chapt.id}
                      style={[
                        styles.numberBox,
                        (selected === chapt.number && expanded=== item.name) && styles.numberBoxSelected,
                      ]}
                      onPress={() => handleContent(chapt, bible.bible_id, chapt.id)}
                    >
                      <Text
                        style={[
                          styles.numberText,
                           (selected === chapt.number && expanded=== item.name) && styles.numberTextSelected,
                        ]}
                      >
                        {chapt.number}
                      </Text>
                    </TouchableOpacity>
                ))}
              </View>
            )}

          </View>
        ))}
      </ScrollView>

    </View>
  )
}

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
    backgroundColor: '#CCC',
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
    fontSize: 18,
    fontWeight: 'bold',
    color: '#222',
  },
  closeBtn: {
    fontSize: 18,
    color: '#888',
  },
  row: {
    paddingVertical: 15,
    paddingHorizontal: 0,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#EDF3F3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowText: {
    fontSize: 18,
    color: '#0B172A',
    fontFamily:'NunitoSemiBold'
  },
  rowArrow: {
    height:30,
    width:30,
    objectFit:'contain'
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 12,
    paddingHorizontal: 40,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF3F3",
    paddingBottom: 20
  },
  numberBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#EDF3F3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberBoxSelected: {
    backgroundColor: '#005A55',
  },
  numberText: {
    color: '#005A55',
    fontSize: 16,
    fontFamily:'NunitoSemiBold'
  },
  numberTextSelected: {
    color: '#fff',
    fontSize: 16,
    fontFamily:'NunitoSemiBold'
  },
});

// export
export default ChapterSheet;
