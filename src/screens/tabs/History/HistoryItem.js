import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HistoryItem = ({ item }) => {
  const [favorite, setFavorite] = useState(item.isFavorite);

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.title}>{item.title}</Text>
        <TouchableOpacity onPress={() => setFavorite(!favorite)}>
          <Icon
            name={favorite ? 'star' : 'star-border'}
            size={24}
            color={favorite ? '#FFD700' : '#999'}
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.snippet}>{item.snippet}</Text>

      <View style={styles.metaRow}>
        <Icon name="reply" size={16} color="#999" />
        <Text style={styles.metaText}>{item.replies} replies</Text>

        <Icon name="access-time" size={16} color="#999" style={{ marginLeft: 16 }} />
        <Text style={styles.metaText}>{item.timeAgo}</Text>
      </View>
    </View>
  );
};

export default HistoryItem;

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  title: { fontSize: 16, fontWeight: '600', flex: 1, paddingRight: 8 },
  snippet: { fontSize: 14, color: '#666', marginBottom: 8 },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  metaText: { fontSize: 13, color: '#777', marginLeft: 4 },
});
