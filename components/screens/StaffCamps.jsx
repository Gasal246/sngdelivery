import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native'
import RootLayout from '../../screens/layouts/RootLayout'
import { ChevronDown, ChevronLeftIcon, ChevronRight } from 'lucide-react-native'
import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'
import axios from 'axios'
import { baseUrl } from '../../constants/endpoints'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDeliveryOrders } from '../../store/slices/appslice'

const StaffCamps = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { userToken, orders } = useSelector((state) => state.application);
    const [storeCamps, setStoreCamps] = useState([]);
    const [expandedStoreId, setExpandedStoreId] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!userToken) return;
        if (!orders) dispatch(fetchDeliveryOrders({ period: "day", token: userToken }));
        fetchStoreCamps();
    }, [userToken, dispatch]);

    const fetchStoreCamps = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${baseUrl}/delivery-staff/stores-camps`, {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            setStoreCamps(data?.data ?? []);
        } catch (error) {
            console.log("Failed to fetch store camps", error?.response ?? error);
        } finally {
            setLoading(false);
        }
    };

    const toggleStore = (storeId) => {
        setExpandedStoreId((prev) => prev === storeId ? null : storeId);
    };

    const getStoreOrdersCount = (storeId) => {
        if (!orders) return 0;
        return orders.filter(order => `${order.store_id}` === `${storeId}`).length;
    };

    const getCampOrdersCount = (storeId, campId) => {
        if (!orders) return 0;
        return orders.filter(order => `${order.store_id}` === `${storeId}` && `${order.camp_id}` === `${campId}`).length;
    };

    return (
        <RootLayout>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <ChevronLeftIcon size={26} color="#fff" strokeWidth={2.5} />
                </TouchableOpacity>
                <Image
                    source={require("../../assets/png/sngcolor.png")}
                    style={styles.logo}
                />
            </View>

            <View style={styles.header2}>
                <Text style={styles.headerText}>Select The Area</Text>
            </View>

            <View style={styles.wrapper}>
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator color="#243B55" size="large" />
                        <Text style={styles.loadingText}>Loading stores...</Text>
                    </View>
                ) : (
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {storeCamps?.map((store, storeIndex) => {
                            const storeOrders = getStoreOrdersCount(store?._id);
                            const storeKey = store?._id ?? `store-${storeIndex}`;
                            return (
                                <View key={storeKey} style={{ padding: 15, paddingBottom: 3}}>
                                    <TouchableOpacity style={styles.storeCard} onPress={() => toggleStore(store?._id)}>
                                        <LinearGradient
                                            colors={["#243B55", "#141E30"]}
                                            style={styles.boxItem}
                                        >
                                            <View style={styles.storeRow}>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={styles.boxText}>{store?.store_name || "Store"}</Text>
                                                    {store?.store_address && (
                                                        <Text style={styles.boxSubText}>{store.store_address}</Text>
                                                    )}
                                                </View>
                                                {expandedStoreId === store?._id ? <ChevronDown size={20} color="#fff" /> : <ChevronRight size={20} color="#fff" />}
                                            </View>
                                            <View style={styles.badge}>
                                                <Text style={styles.badgeText}>{storeOrders}</Text>
                                            </View>
                                        </LinearGradient>
                                    </TouchableOpacity>

                                    {expandedStoreId === store?._id && (
                                        <View style={styles.campContainer}>
                                            {(store?.camps ?? []).map((camp, campIndex) => {
                                                const campOrders = getCampOrdersCount(store?._id, camp?._id);
                                                const campKey = camp?._id ?? `camp-${campIndex}`;
                                                return (
                                                    <TouchableOpacity
                                                        key={campKey}
                                                        style={styles.campRow}
                                                        onPress={() => navigation.navigate("Orders", {
                                                            storeId: store?._id,
                                                            campId: camp?._id,
                                                            storeName: store?.store_name,
                                                            campName: camp?.camp_name
                                                        })}
                                                    >
                                                        <Text style={styles.campName}>{camp?.camp_name || "Camp"}</Text>
                                                        {camp?.camp_city && <Text style={styles.campMeta}>{camp.camp_city}</Text>}
                                                        <View style={[styles.badge, styles.campBadge]}>
                                                            <Text style={styles.badgeText}>{campOrders}</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                );
                                            })}
                                            {(store?.camps ?? []).length === 0 && (
                                                <Text style={styles.noCampsText}>No camps assigned to this store.</Text>
                                            )}
                                        </View>
                                    )}
                                </View>
                            );
                        })}
                        {!storeCamps?.length && (
                            <Text style={styles.noStoresText}>No stores assigned.</Text>
                        )}
                    </ScrollView>
                )}
            </View>
        </RootLayout>
    )
}

export default StaffCamps

const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 16,
    },
    backButton: {
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
        borderRadius: 8,
        backgroundColor: "rgba(255,255,255,0.2)",
    },
    logo: {
        width: 53,
        aspectRatio: 1 / 1,
        resizeMode: "contain",
        opacity: 0.9,
    },
    header2: {
        marginBottom: 16,
        padding: 8,
        borderRadius: 12,
        backgroundColor: "white",
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
    },
    headerText: {
        fontFamily: "Orbitron",
        fontSize: 16,
        fontWeight: "bold",
        opacity: 0.9,
        textAlign: "center",
    },
    wrapper: {
        backgroundColor: "rgba(255,255,255,0.3)",
        borderRadius: 12,
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
        minHeight: 300,
    },
    shadowWrapper: {
        borderRadius: 12,
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
        marginBottom: 15,
        position: "relative",
    },
    cardWrapper: {
        position: "relative",
        paddingTop: 12,
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
        borderRadius: 12,
    },
    storeCard: {
        position: "relative",
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
        borderRadius: 12,
    },
    boxItem: {
        borderRadius: 12,
        padding: 12,
        alignItems: "center",
        justifyContent: "center",
        minHeight: 70,
        position: "relative",
    },
    boxText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    badge: {
        position: "absolute",
        top: -5,
        right: -5,
        backgroundColor: "red",
        minWidth: 26,
        height: 26,
        borderRadius: 13,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 0,
    },
    badgeText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "bold",
    },
    storeRow: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        gap: 10,
    },
    boxSubText: {
        color: "#e0e0e0",
        fontSize: 12,
        opacity: 0.8,
        marginTop: 4,
    },
    accordionIcon: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "bold",
    },
    campContainer: {
        backgroundColor: "rgba(255,255,255,0.08)",
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
        marginTop: 8,
        borderRadius: 10,
        paddingVertical: 8,
        paddingHorizontal: 8,
        gap: 8,
    },
    campRow: {
        backgroundColor: "rgba(0,0,0,0.2)",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 12,
        position: "relative",
    },
    campName: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },
    campMeta: {
        color: "#d0d0d0",
        fontSize: 12,
        marginTop: 2,
    },
    campBadge: {
        top: 8,
        right: 8,
        backgroundColor: "#610000",
    },
    noCampsText: {
        color: "#d0d0d0",
        fontSize: 12,
        textAlign: "center",
        paddingVertical: 6,
    },
    noStoresText: {
        color: "#fff",
        textAlign: "center",
        marginTop: 12,
    },
    loadingContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        paddingVertical: 12,
    },
    loadingText: {
        color: "#243B55",
        fontWeight: "600",
    },
})
