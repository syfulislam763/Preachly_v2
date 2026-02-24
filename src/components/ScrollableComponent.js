import React, { Children } from 'react';
import { View, Text, FlatList, StyleSheet, SafeAreaView, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

const DATA = Array.from({ length: 30 }, (_, i) => `Item ${i + 1}`);

const StickyFlatList = ({headerComponent, renderItem, data, children}) => {

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={headerComponent}
        stickyHeaderIndices={[0]} // make the header sticky
        contentContainerStyle={{ paddingBottom: 100 }} // give space for bottom component
      />

      {/* Bottom Fixed Component */}
      {children}
    </SafeAreaView>
  );
};

export default StickyFlatList;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#fce4b3',
    padding: 15,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  item: {
    padding: 20,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
  },
  bottom: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 20,
    backgroundColor: '#004d40',
  },
  bottomText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
