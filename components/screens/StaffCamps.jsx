import React from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import RootLayout from '../../screens/layouts/RootLayout'
import { ChevronLeftIcon } from 'lucide-react-native'
import { useNavigation } from '@react-navigation/native'
import { LinearGradient } from 'expo-linear-gradient'

const StaffCamps = () => {
    const navigation = useNavigation();

    // Find the Staff_Assigned_Camps (Store Distinct) and Out_For_Delivery Orders in Each Here

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
                <Text style={styles.headerText}>Select Service Area</Text>
            </View>

            <View style={styles.wrapper}>
                <TouchableOpacity style={styles.shadowWrapper} onPress={() => navigation.goBack()}>
                    <LinearGradient
                        colors={["#243B55", "#141E30"]}
                        style={styles.boxItem}
                    >
                        <Text style={styles.boxText}>Example Camp Area</Text>
                    </LinearGradient>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>99</Text>
                    </View>
                </TouchableOpacity>
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
        padding: 15,
    },
    shadowWrapper: {
        borderRadius: 12,
        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
        marginBottom: 15,
        position: "relative",
    },
    boxItem: {
        borderRadius: 12,
        padding: 12,
        alignItems: "center",
        justifyContent: "center",
        minHeight: 70,
    },
    boxText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
    badge: {
        position: "absolute",
        top: -4,
        right: -4,
        backgroundColor: "red",
        minWidth: 22,      // ensures it stays wide enough for 2 digits
        height: 22,
        borderRadius: 11,  // half of height for a perfect circle
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 0, // remove horizontal padding
    },
    badgeText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "bold",
    },
})
