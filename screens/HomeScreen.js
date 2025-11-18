import React, { useCallback, useEffect, useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RootLayout from './layouts/RootLayout';
import * as Font from "expo-font";
import { BlurView } from 'expo-blur'
import { Milk, Package, PackageOpen } from 'lucide-react-native';
import RootBottomBar from '../components/shared/RootBottomBar';
import { useSelector, useDispatch } from 'react-redux';
import { fetchDeliveryOrders } from '../store/slices/appslice';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [loaded, setLoaded] = useState(false);
    const [now, setNow] = useState(new Date());
    const { orders, userToken } = useSelector((state) => state.application);

    const [pendingOrders, setPendingOrders] = useState(0);
    const [deliveredOrders, setDeliveredOrders] = useState(0);
    const [deliveredBottles, setDeliveredBottles] = useState(0);
    const [collectedBottles, setCollectedBottles] = useState(0);

    useEffect(() => {
        Font.loadAsync({
            Orbitron: require("../assets/fonts/Orbitron-Regular.ttf"),
        }).then(() => setLoaded(true));

        const interval = setInterval(() => setNow(new Date()), 1000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (userToken) setupInsights();
    }, [userToken]);

    const setupInsights = async () => {
        if (!userToken) {
            console.log("Not Authorized!!");
            return;
        }
        try {
            const data = await dispatch(fetchDeliveryOrders({ period: "day", token: userToken })).unwrap();
            if (data && data?.length > 0) {
                console.log("Fetched Orders: ", data?.length);
                const pending = data.filter(order => order.status === 0);
                const delivered = data.filter(order => order.status === 1);
                const collected_bottles = delivered.reduce((acc, order) => acc + order.empty_bottles_collected, 0);
                const delivered_bottles = delivered.reduce((acc, order) => acc + order.bottle_count, 0);
                setPendingOrders(pending.length);
                setDeliveredOrders(delivered.length);
                setDeliveredBottles(delivered_bottles);
                setCollectedBottles(collected_bottles);
            }
        } catch (err) {
            console.log("Failed to fetch orders", err?.response ?? err);
        }
    };

    if (!loaded) return null;

    const dateStr = now.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", }).replaceAll(' ', ' | '); // → “07 | Nov | 2025”

    const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true, }).replaceAll(" ", "").toLowerCase(); // → “07:15:30 am”

    return (
        <RootLayout layoutViewStyle={{ padding: 0 }}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <View>
                        <Text style={{ fontFamily: "Orbitron", fontSize: 18, textAlign: "left", color: "#fff", fontWeight: "bold", opacity: 0.9 }}>{dateStr}</Text>
                        <Text style={{ fontFamily: "Orbitron", fontSize: 18, textAlign: "left", color: "#fff", fontWeight: "bold", opacity: 0.9 }}>{timeStr}</Text>
                    </View>
                    <Image source={require("../assets/png/sngcolor.png")} style={{ width: 53, aspectRatio: 1 / 1, resizeMode: "contain", opacity: 0.9 }} />
                </View>

                <View style={styles.boxContainer}>
                    <TouchableOpacity style={styles.boxItem} onPress={() => navigation.navigate("StaffCamps")}>
                        <BlurView intensity={45} tint="light" style={styles.box}>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 5, justifyContent: "center", marginBottom: 10 }}>
                                <Package size={18} color="yellow" />
                                <Text style={styles.boxTitle}>Pending </Text>
                            </View>
                            <Text style={styles.boxSubTitle}>{pendingOrders}</Text>
                            <Text style={styles.boxSubTitle2}>Today</Text>
                        </BlurView>
                    </TouchableOpacity>
                    <View style={styles.boxItem}>
                        <BlurView intensity={45} tint="light" style={styles.box}>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 5, justifyContent: "center", marginBottom: 10 }}>
                                <PackageOpen size={18} color="#5AE7A6" />
                                <Text style={styles.boxTitle}>Completed</Text>
                            </View>
                            <Text style={styles.boxSubTitle}>{deliveredOrders}</Text>
                            <Text style={styles.boxSubTitle2}>Today</Text>
                        </BlurView>
                    </View>
                </View>
                <View style={styles.boxContainer}>
                    <View style={styles.boxItem}>
                        <BlurView intensity={45} tint="light" style={styles.box}>
                            <Text style={styles.boxTitle}>Delivered</Text>
                            <Text style={styles.boxSubTitle}>{deliveredBottles}</Text>
                            <Text style={styles.boxSubTitle2}>Bottles Today</Text>
                        </BlurView>
                    </View>
                    <View style={styles.boxItem}>
                        <BlurView intensity={45} tint="light" style={styles.box}>
                            <Text style={styles.boxTitle}>Collected</Text>
                            <Text style={styles.boxSubTitle}>{collectedBottles}</Text>
                            <Text style={styles.boxSubTitle2}>Bottles Today</Text>
                        </BlurView>
                    </View>
                </View>
                <View style={styles.boxContainer}>
                    <View style={[styles.boxItem, { width: "100%" }]}>
                        <BlurView intensity={45} tint="light" style={styles.box}>
                            <Text style={[styles.boxSubTitle2, { marginBottom: 7 }]}>Monthly Summary</Text>
                            <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 40 }}>
                                <View>
                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 5, justifyContent: "center", marginBottom: 5 }}>
                                        <PackageOpen size={18} color="#5AE7A6" />
                                        <Text style={[styles.boxTitle, { marginBottom: 0 }]}>Delivered</Text>
                                    </View>
                                    <Text style={styles.boxSubTitle}>0</Text>
                                </View>
                                <View>
                                    <View style={{ flexDirection: "row", alignItems: "center", gap: 5, justifyContent: "center", marginBottom: 5 }}>
                                        <Milk size={20} color="#D6F4ED" />
                                        <Text style={[styles.boxTitle, { marginBottom: 0 }]}>Collected</Text>
                                    </View>
                                    <Text style={styles.boxSubTitle}>0</Text>
                                </View>
                            </View>
                        </BlurView>
                    </View>
                </View>
            </View>
            <RootBottomBar />
        </RootLayout>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 15
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
        paddingHorizontal: 21,
        marginBottom: 20
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    headerText2: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff',
    },
    boxContainer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        paddingHorizontal: 10,
    },
    boxItem: {
        padding: 5,
        width: "50%",
        borderRadius: 15,
    },
    box: {
        borderWidth: 1,
        backgroundColor: "rgba(255,255,255,0.1)",
        borderColor: "rgba(255,255,255,0.3)",
        borderRadius: 15,
        overflow: "hidden",
        height: 130,
        padding: 10,
        paddingTop: 20,
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
    },
    boxTitle: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center",
        color: "white",
        opacity: 0.9,
    },
    boxSubTitle: {
        fontSize: 28,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 10,
        color: "white",
    },
    boxSubTitle2: {
        fontSize: 12,
        fontWeight: "bold",
        textAlign: "center",
        color: "white",
        opacity: 0.8,
    },
})

export default HomeScreen;
