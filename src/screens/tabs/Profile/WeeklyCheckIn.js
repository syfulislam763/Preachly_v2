import React, { useCallback, useState } from 'react'
import { View, Text, Image, StyleSheet, Pressable, ActivityIndicator, ImageBackground, FlatList } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useFocusEffect, useNavigation } from '@react-navigation/native'
import { get_weekly_check_in_history } from '../TabsAPI'
import Indicator from '../../../components/Indicator'
import Entypo from '@expo/vector-icons/Entypo'

const img1   = require('../../../../assets/img/card_bg8.png')
const img4   = require('../../../../assets/img/card_bg11.png')
const leaf_b = require('../../../../assets/img/leaf_b.png')
const leaf_w = require('../../../../assets/img/leaf_w.png')

const timeAgo = (string) => {
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"]
    const d = new Date(string)
    return `${d.getUTCDate()} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

const WeeklyCheckIn = () => {
    const navigation = useNavigation()
    const [history, setHistory] = useState([])   // ← fixed: was [history, setLoading]
    const [loading, setLoading] = useState(false) // ← fixed: was [loading, setLoadingState]

    const handleGetHistory = () => {
        setLoading(true)
        get_weekly_check_in_history((res, success) => {
            setLoading(false)
            if (success) {
                const filtered = res?.data?.completed_weekly_checkins.filter(i => i.status !== "locked")
                setHistory(filtered)
            }
        })
    }

    useFocusEffect(useCallback(() => { handleGetHistory() }, []))

    const renderItem = ({ item, index }) => {
        const isEven     = index % 2 === 0
        const bgImage    = isEven ? img1 : img4
        const leafIcon   = isEven ? leaf_b : leaf_w
        const titleColor = isEven ? '#0B172A' : '#ffffff'
        const dateColor  = isEven ? '#966F44' : '#90B2B2'

        return (
            <Pressable
                onPress={() => {
                    if (item.is_completed) {
                        navigation.navigate("WeeklyCheckIn_", { ...item, title: `${item.week_number} Weekly Check-In` })
                    } else {
                        navigation.navigate("RegularCheckIn", { title: `${item.week_number} Weekly Check-In` })
                    }
                }}
            >
                <ImageBackground source={bgImage} style={styles.background} resizeMode="cover">
                    <View style={styles.card}>
                        <View style={styles.cardWrap}>
                            <Image source={leafIcon} style={styles.leafIcon} />
                            <View>
                                <Text style={[styles.title, { color: titleColor }]}>
                                    {(history.length - item.week_number) + 1}. Week Check-In
                                </Text>
                                <Text style={[styles.text, { color: dateColor }]}>
                                    {item?.completed_at ? timeAgo(item.completed_at) : "Available"}
                                </Text>
                            </View>
                        </View>
                        <Entypo name="chevron-thin-right" size={24} color="white" />
                    </View>
                </ImageBackground>
            </Pressable>
        )
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={[...history].sort((a, b) => b.week_number - a.week_number)}
                keyExtractor={(item) => String(item.week_number)}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
            />
            {loading && (
                <Indicator visible={loading} onClose={() => setLoading(false)}>
                    <ActivityIndicator size="large" />
                </Indicator>
            )}
        </View>
    )
}

export default WeeklyCheckIn

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    listContent: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 100,
    },
    background: {
        height: 82,
        width: '100%',
        marginBottom: 20,
        overflow: 'hidden',
        borderRadius: 15,
    },
    card: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 10,
    },
    cardWrap: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        width: '92%',
    },
    leafIcon: {
        height: 24,
        width: 24,
        objectFit: 'contain',
        marginRight: 6,
    },
    title: {
        fontFamily: 'NunitoSemiBold',
        fontSize: 16,
    },
    text: {
        fontFamily: 'NunitoSemiBold',
        fontSize: 12,
        marginTop: 3,
    },
})