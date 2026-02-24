import {StyleSheet, Dimensions} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen'
const { width, height } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.75;


const baseStyle =  StyleSheet.create({
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
  filterIcon: {
    height:20,
    width:20,
    objectFit:'contain',
    marginRight:10
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
})


export const getStyles = (isSmall, isMedium, isLarge, isFold) =>  {
  const styleContainer = {
    small: StyleSheet.create({
    container: {
        ...baseStyle.container
    },
    header: { 
        ...baseStyle.header
    },
    searchBar: {
       ...baseStyle.searchBar
    },
    searchInput: {
        ...baseStyle.searchInput
    },
    filterContainer: {
        ...baseStyle.filterContainer
    },
    filterButton: {
        ...baseStyle.filterButton,
        paddingVertical: 7,
        paddingHorizontal: 10,
    },
    filterIcon:{
      ...baseStyle.filterIcon
    },
    activeFilterButton: {
        ...baseStyle.activeFilterButton
    },
    filterText: {
        ...baseStyle.filterText,
        fontSize:14,
        fontFamily:'NunitoBold'
    },
    activeFilterText: { 
        ...baseStyle.activeFilterText
     },
    itemContainer: {
       ...baseStyle.itemContainer
    },
    itemTitle: {
        ...baseStyle.itemTitle
     },
    itemSnippet: {
        ...baseStyle.itemSnippet
     },
    metaRow: { 
        ...baseStyle.metaRow
     },
    metaText: { 
        ...baseStyle.metaText
     },
    deleteButton: {
        ...baseStyle.deleteButton
    },
    }),

    medium: baseStyle,

    large: baseStyle,

    fold: baseStyle
  }
  return styleContainer[isSmall] || styleContainer[isMedium] || styleContainer[isLarge] || styleContainer[isFold]
};