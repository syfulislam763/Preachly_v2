
import React, { useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet,ActivityIndicator,Keyboard, Pressable, ScrollView, FlatList} from 'react-native';
import ModalHeader from './ModalHeader';
import { search_bible } from '../TabsAPI';  
import Indicator from '../../../components/Indicator';

const ScriptureSearch = ({onClose, bibleId, title}) => {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState([]);
  const [verses, setVerses] = useState([]);

  const handleSearch = (value) => {
    const payload = {
      bibleId: bibleId,
      query: value,
      limit: 20
    }
    setValue(value);
    setLoading(true);
    search_bible(payload, (res, success) => {
      if(success){
        setVerses(res?.data?.search_results?.verses);
        setContent(res?.data);
      }
      setLoading(false);
    })
  }


  return (
    <Pressable onPress={()=> Keyboard.dismiss()}>

        <View
            style={{paddingVertical:10, paddingHorizontal:20}}
        >
            <ModalHeader
                title={"Search"}
                onClose={onClose}
            />
        </View>



        <View style={styles.container}>
      
        <View style={styles.searchContainer}>
           
    
            <Image
                source={require("../../../../assets/img/24-search.png")}
                style={styles.searchIcon}
            />

            <TextInput
              style={styles.search}
              placeholder="Ask or search for answers..."
              placeholderTextColor={"#607373"}
              onChangeText={(e) => handleSearch(e)}
            />
        </View>

        {verses.length<=0?<View>
          <View style={styles.imageContainer}>

            <Image
            source={require("../../../../assets/img/nightImage.png")} 
            style={styles.image}
            />
            </View>

      
            <Text style={styles.primaryText}>
                What’s on your heart today?
            </Text>


            <Text style={styles.secondaryText}>
                Search the Scriptures for the wisdom you need
            </Text>

            <Text style={styles.quoteText}>
                "Seek, and you will find; knock, and it will be opened to you." — Matthew 7:7
            </Text>
        </View>:
          loading?<View style={{
            height:300,
            width:"100%",
            justifyContent:'center',
            alignItems:"center"
          }}>
            <ActivityIndicator size={"large"}/>
          </View>:
          
            <FlatList
              data={verses}
              style={{height: "80%"}}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={() => (<View style={{paddingTop:10}}></View>)}
              ListFooterComponent={() => (<View style={{paddingBottom:30}}></View>)}
              renderItem={({ item: verse }) => (
                
                <View style={{
                  paddingVertical: 10,
                  borderBottomWidth:1,
                  borderBottomColor:"#EDF3F3"
                }}>
                  <Text
                    style={{
                      fontFamily: 'NunitoSemiBold',
                      fontSize: 14,
                      color: '#3F5862',
                      
                    }}
                  >
                    {verse.text}
                  </Text>
                  <View style={{
                    flexDirection:"row",
                    alignItems:'center',
                  }}>
                    <Text
                      style={{
                        fontFamily: 'NunitoSemiBold',
                        fontSize: 16,
                        color: '#966F44',
                        marginRight:20
                      }}
                    >
                      {verse.reference}
                    </Text>
                    <Text
                      style={{
                        fontFamily: 'NunitoSemiBold',
                        fontSize: 16,
                        color: '#966F44',
                      }}
                    >
                      {title}
                    </Text>
                  </View>
                </View>
            
              )}
            />
        
        }
        
        </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({ 
  container: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  searchContainer: {
    width: '100%',
    position: 'relative',
    marginBottom: 20,
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    top: 18,
    width: 20,
    height: 20,
    objectFit:'contain',
    // This serves as icon's circle
  },
  search: {
    width: '100%',
    paddingLeft: 44, // space for icon
    paddingVertical: 16,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: '#ACC6C5'
  },
  imageContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 20,
    objectFit:'contain',
    marginTop: 50
  },
  primaryText: {
    fontSize: 30,
    fontFamily:'DMSerifDisplay',
    textAlign:'center',
    paddingHorizontal: 50,
    marginBottom: 12,
    marginTop:20
  },
  secondaryText: {
    fontSize: 18,
    marginBottom: 12,
    color:'#2B4752',
    fontFamily:'NunitoSemiBold',
    paddingHorizontal: 60,
    textAlign:'center'
  },
  quoteText: {
    fontSize: 16,
    fontFamily:'NunitoSemiBold',
    color: '#90B2B2',
    textAlign:'center',
    paddingHorizontal:40
  },
});

// export
export default ScriptureSearch;

