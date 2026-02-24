import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Image,
  ActivityIndicator
} from 'react-native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Swipeable } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import HistoryNotFound from './HistoryNotFound';
import useLayoutDimention from '../../../hooks/useLayoutDimention'
import {getStyles} from './HistoryScreenStyle';
import { get_all_sessions, delete_session, make_favorite_session, bookmark_message } from '../TabsAPI';
import Indicator from '../../../components/Indicator';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../../context/AuthContext';
import useLogout from '../../../hooks/useLogout'

const star = require("../../../../assets/img/VectorStar.png")
const bookmark = require("../../../../assets/img/24-bookmark.png")
const bookmark1 = require("../../../../assets/img/Bookmark1.png")
const trash = require("../../../../assets/img/Trash.png")

const FILTERS = [{img:'', txt:'All chats'}, {img:star,txt:'Favorites'}, {img:bookmark, txt: 'Answers'}];


/*

{
    id: '9',
    title: '',
    snippet: '',
    replies: 0,
    timeAgo: '',
    isFavorite: ,
    type: 'answer',
  },


*/

const HistoryScreen = () => {
  useLogout();
  const [selectedFilter, setSelectedFilter] = useState('All chats');
  const [searchText, setSearchText] = useState('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const navigation = useNavigation();
  
  const {isSmall, isMedium, isLarge, isFold} = useLayoutDimention()
  const styles = getStyles(isSmall, isMedium, isLarge, isFold);
  const {updateStore, updateSession} = useAuth()

  const handleDelete = (id) => {
    setData((prev) => prev.filter((item) => item.id !== id));
  };


  const handleDeleteSession = (session_id) =>{
    delete_session(session_id, (res, success) =>{
      if(success){
        handleGetAllData();
      }
    })
  }

  const handleBookmark = (message_id) =>{
      const payload = {
        bookmark: false,
        message_id: message_id
      }
      bookmark_message(payload, (res, success) => {
        if(success){
          handleGetAllData();
          
        }
      })
      console.log("book mark...");
  }

  const handleMakeFavorite = (item) =>{
    const payload = {
      session_id: item.id,
      favorite: !item.isFavorite
    }
    make_favorite_session(payload, (res, success) =>{
      if(success){
        handleGetAllData();
      }else{
        console.log("mm", res);
      }
    })
  }

 
  function timeAgo(isoString) {
    const now = new Date();
    const createdAt = new Date(isoString);
    const diffMs = now - createdAt;

    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 365));

    if (seconds < 60) return `${seconds}s`;
    else if (minutes < 60) return `${minutes}m`;
    else if (hours < 24) return `${hours}h`;
    else if (days < 365) return `${days}d`;
    else return `${years}y`;
  }


  const handleGetAllData = () => {
    
    setLoading(true);
    get_all_sessions((res, success) => {
      if(success){
        //const temp_data = res?.data
        let temp_data = res?.data?.sessions?.map(item => {
          let snippet = "";
          let searchContent = "";
          if(item?.messages?.length){
            snippet = item?.messages[item.messages.length-1].content.substring(0, 150)+"...";
            item?.messages.forEach(msg => {
              searchContent += msg.content;
            })
          }

          return {
            id: item?.id,
            title: item?.title,
            snippet: snippet,
            replies: item?.messages?.length,
            timeAgo: timeAgo(item?.created_at),
            isFavorite: item?.is_favorite,
            searchContent: searchContent,
            time: new Date(item?.created_at).getTime(),
            type: 'chat',
          }
        });

        res?.data?.sessions.forEach(item => {
          ///chat/messages/bookmarked/
          item?.messages.forEach(msg => {
            if(msg.bookmark){
              temp_data.push(
                {
                  id: msg.id,
                  title: "",
                  snippet: msg.content,
                  replies: 0,
                  timeAgo: timeAgo(msg.created_at),
                  isFavorite: false,
                  isBookmarked: msg.bookmark,
                  searchContent: msg.content,
                  time: new Date(item?.created_at).getTime(),
                  type: 'answer',
                }
              )
            }
          })
        })
        temp_data = temp_data.sort((a,b) => b.time-a.time)
        setData(temp_data)
        handleFilter(selectedFilter, temp_data);
      }else{
        console.log("hddsfs", res)
      }
      setLoading(false);
    })
  }

  useFocusEffect(
    useCallback(() =>{
      handleGetAllData()
    }, [])
  )


  const handleFilter = (label, temp=[]) =>{
    const container = temp.length?temp:data;
    const filteredData = container
    .filter((item) => {
      if (label === 'Favorites') return item.isFavorite;
      if (label === 'Answers') return item.type === 'answer';
      return item.type == "chat"
    })
    setFilteredData(filteredData)
    setSelectedFilter(label);
  }


  

  
  const handleSearch = (e) => {
    setSearchText(e);  
  }

  let searchedData = filteredData.filter(item => {
    let charArr = item.searchContent.split(" ");
    charArr = charArr.map(ch => ch.toLowerCase());
    return charArr.join(" ").includes(searchText.toLowerCase());
  })
  
  searchedData = searchText.length?searchedData:filteredData


  //console.log("data", JSON.stringify(searchedData, null, 2))
    // .filter(item => {
    //   item.searchContent.split(" ").includes(searchText.toLowerCase())
    // })

  const renderRightActions = (progress, dragX, itemId) => (
    <TouchableOpacity
      onPress={() => handleDeleteSession(itemId)}
      style={styles.deleteButton}
    >
      {/* <MaterialIcons name="delete" size={24} color="#fff" /> */}
      <Image 
        source={trash}
        style={{
          width:20,
          height:20,
          objectFit:'contain'
        }}
      />
    </TouchableOpacity>
  );

  const renderContent = (item) => (
    <TouchableOpacity onPress={() => {
      if(item.type != "answer"){
        console.log("id_", item.id)
        updateSession(item)
        navigation.navigate("MessageScreen", {session_id: item.id})
      }
    }}>
      <View style={styles.itemContainer}>
        <View style={{ flex: 1 }}>
          {(item?.type != "answer") && <Text style={styles.itemTitle}>{item.title}</Text>}
          <Text style={(item?.type != "answer")?{...styles.itemSnippet}:{...styles.itemSnippet, paddingVertical:0}}>{item.snippet}</Text>
          <View style={styles.metaRow}>
            {(item?.type != "answer") && <MaterialCommunityIcons name="reply" size={16} color="#966F44" />}
            {(item?.type != "answer") && <Text style={{...styles.metaText, marginRight:10}}>{item.replies} replies</Text>}
            <MaterialIcons name="access-time" size={16} color="#966F44"  />
            <Text style={styles.metaText}>{item.timeAgo}</Text>
          </View>
        </View>
        {(item?.type==="answer")? <TouchableOpacity onPress={()=>handleBookmark(item.id)}>
          <Image
          source={bookmark1}
          style={{
            height:20,
            width:20,
            objectFit:'contain',
            marginTop: (item?.type != "answer")?0:5
          }}
        />
        </TouchableOpacity> : <TouchableOpacity onPress={() => handleMakeFavorite(item)}>
          <MaterialIcons
            name={item.isFavorite ? 'star' : 'star-border'}
            size={24}
            color={item.isFavorite ? '#f4c10f' : '#aaa'}
          />
        </TouchableOpacity>}
      </View>
    </TouchableOpacity>
  )

  const renderItem = ({ item }) => {
    return item.type == "answer"?renderContent(item):<Swipeable renderRightActions={(progress, dragX) => renderRightActions(progress, dragX, item.id)}>
        {renderContent(item)}
    </Swipeable>
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>History</Text>

      <View style={styles.searchBar}>
        <Image 
          source={require("../../../../assets/img/24-search.png")}
          style={{
            height:30,
            width: 30,
            objectFit:'contain',
            marginHorizontal: 10
          }}
        />
        <TextInput
          placeholder="Ask or search for answers..."
          style={styles.searchInput}
          value={searchText}
          placeholderTextColor={"#607373"}
          onChangeText={e => handleSearch(e)}
        />
      </View>

      <View style={styles.filterContainer}>
        {FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter.txt}
            style={[
              styles.filterButton,
              selectedFilter === filter.txt && styles.activeFilterButton,
            ]}
            onPress={() => handleFilter(filter.txt)}
          >
            
            {filter?.img?<Image
              source={filter.img}
              style={styles.filterIcon}
            />:null}
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter.txt && styles.activeFilterText,
              ]}
            >
              {filter.txt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={searchedData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
        ListEmptyComponent={() => {
          if(selectedFilter == 'All chats'){
            return <HistoryNotFound
              title={"No Chats Yet"}
              text={"Ask Preachly for clarity, insight, and scripture-bvacked answers. Your past chats will be saved here for easy reference"}
            />
          }else if(selectedFilter == "Favorites"){
            return  <HistoryNotFound
              title={"No Favorites Yet"}
              text={"Looks like you haven't saved any chats yet. When you find a conversation that resonates tap the favorite icon to keep it handy"}
            />
          }else {
            return <HistoryNotFound 
              title={"No Saved Answers Yet"}
              text={"Looks like you haven't saved any key answers. When you find an answer worth keeping, tap the bookmark to store it for quick reference"}
            />
          }
           
        }}
      />
      {loading && <Indicator visible={loading} onClose={()=>setLoading(false)}>
        <ActivityIndicator size={"large"}/>
      </Indicator>}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  header: { fontSize: 32, fontFamily:'DMSerifDisplay', marginBottom: 16,color:'#0B172A' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#ACC6C5',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
   
  },
  filterContainer: { flexDirection: 'row', marginBottom: 16, },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#EDF3F3',
    width: 'auto',
    display:'flex',
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center'
  },
  activeFilterButton: { backgroundColor: '#005A55',  },
  filterText: { fontSize: 16, fontFamily:'NunitoSemiBold', color:'#0B172A'},
  activeFilterText: { color: '#fff' },
  itemContainer: {
    flexDirection: 'row',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
    alignItems: 'flex-start',
  },
  itemTitle: { fontSize: 15, marginBottom: 4, fontFamily:'NunitoSemibold', color:'#0B172A' },
  itemSnippet: { color: '#2B4752', fontSize: 13, marginBottom: 6, fontFamily:'NunitoSemiBold', paddingVertical:10 },
  metaRow: { flexDirection: 'row', alignItems: 'center' },
  metaText: { fontSize: 12, color: '#966F44', marginLeft: 4, fontFamily:'NunitoSemiBold' },
  deleteButton: {
    backgroundColor: '#e74c3c',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    marginVertical: 4,
  },
});

export default HistoryScreen;
