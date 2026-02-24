import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
  Image
} from 'react-native';

const CustomSelect = ({ items = [{"id": 0,"name": "Select Denomination","is_active": false}], onSelect, placeholder = "Denomination" }) => {
  const [selected, setSelected] = useState(null);
  const [visible, setVisible] = useState(false);
  console.log("visi", visible)

  const handleSelect = (item) => {
    if(item.name === "None"){
      setSelected(null);
      onSelect && onSelect(null);
      setVisible(false);
      return;
    }
    setSelected(item);
    onSelect && onSelect(item);
    setVisible(false);
  };

  return (
    <View>
      <TouchableOpacity style={styles.dropdown} onPress={() => setVisible(true)}>
        <Text style={selected ? styles.selectedText : styles.placeholderText}>
          {selected ? selected.name : placeholder}
        </Text>

        <Image 
            source={require("../../assets/img/CaretDown.png")}
            style={{
                height:30,
                width:30,
                objectFit:'contain'
            }}
        />
      </TouchableOpacity>

      {
        visible && 
        <Modal statusBarTranslucent={true} visible={visible} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} onPress={() => setVisible(false)}>
          <View style={styles.dropdownList}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={items.sort( (a,b) => a.id - b.id )}
              keyExtractor={(item) => item.name.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.dropdownItem}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={{
                    fontFamily:'NunitoSemiBold',
                    fontSize: 18,
                  }}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
      }
    </View>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1.4,
    borderColor: '#b3c5c5',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 48,
  },
  placeholderText: {
    color: '#607373',
    fontSize: 18,
    fontFamily:'NunitoSemiBold',
    paddingLeft:5
  },
  selectedText: {
    color: '#607373',
    fontSize: 18,
    fontFamily:'NunitoSemiBold',
    width:"90%"
  },
  icon: {
    fontSize: 16,
    color: '#9ea6ab',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: 'rgba(0,0,0,0.2)',
    width:"100%",
  },
  dropdownList: {
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingVertical: 10,
    maxHeight: 300,
    elevation: 5,
    width:"100%",
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginLeft:12,
    //borderBottomWidth:0.5,
    //borderBottomColor: '#005055',
  },
});

export default CustomSelect;
