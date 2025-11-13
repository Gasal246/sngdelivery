import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseUrl } from '../../constants/endpoints';

const height = Dimensions.get('window').height;

const CheckNumberPage = () => {
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');

    const [showSplash, setShowSplash] = useState(true);

    const hanldeContinue = async () => {
        if (loading) return;
        if (!phoneNumber) return;
        let trimmedNumber = phoneNumber.replace(/^0+/, "");
        setLoading(true);
        try {
            const { data } = await axios.post(`${baseUrl}/delivery-staff/check-phone`, { phone: trimmedNumber });
            // console.log(`${baseUrl}/delivery-staff/check-phone:\n`, data);
            if (data?.status === 201) {
                Alert.alert("Phone Number Not Found", "Please enter a valid phone number");
            } else if (data?.status === 202) {
                Alert.alert("Set Password", `We Have Sent an Email to ${data?.data?.email} to set your password, continue after setting password.`)
            } else if (data?.status === 200) {
                navigation.navigate("LoginPage", { phoneNumber: trimmedNumber });
            }
        } catch (error) {
            Alert.alert("Error", "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    const handleCheckAuth = async () => {
        const token = await AsyncStorage.getItem("token");
        if (token) {
            navigation.navigate("Home");
        }
    }

    useEffect(() => {
        setTimeout(() => {
            setShowSplash(false);
            handleCheckAuth();
        }, 4000);
    }, []);

    return (
        <KeyboardAwareScrollView style={styles.container}>
            <LinearGradient
                colors={['#0f172a', '#1e293b', '#0f172a']}
                style={styles.container}
            >
                <SafeAreaView style={styles.safeArea}>
                    <Image source={require('../../assets/png/sngcolor.png')} style={styles.logo} />
                    {
                        showSplash && (
                            <Image source={require('../../assets/gif/loopanimation.gif')} style={styles.splash} />
                        )
                    }
                    {!showSplash && <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center'}}>
                        <View style={styles.header}>
                            <Text style={styles.title}>Welcome To SNG Delivery</Text>
                            <Text style={styles.subtitle}>Enter your phone number to get started</Text>
                        </View>

                        <View style={styles.form}>
                            <View style={styles.inputContainer}>
                                <Text style={styles.inputText}>+971</Text>
                            </View>
                            <TextInput
                                style={styles.input}
                                placeholder="Phone Number"
                                value={phoneNumber}
                                onChangeText={setPhoneNumber}
                                keyboardType="phone-pad"
                            />
                        </View>
                        <TouchableOpacity style={[styles.form, { backgroundColor: 'rgba(80, 217, 208, 1)', paddingVertical: 15, justifyContent: 'center', marginTop: 10 }]} onPress={hanldeContinue}>
                            <Text style={styles.buttonText}>{loading ? "Loading..." : "Continue"}</Text>
                        </TouchableOpacity>
                    </View>}
                </SafeAreaView>
            </LinearGradient>
        </KeyboardAwareScrollView>
    );
};

export default CheckNumberPage;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    container: {
        flex: 1,
        height: height
    },
    header: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        marginTop: -50
    },
    logo: {
        width: 100,
        height: 100,
        aspectRatio: 1 / 1,
        resizeMode: 'contain',
        marginBottom: 20
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 10,
    },
    subtitle: {
        fontSize: 16,
        color: '#fff',
        marginTop: 10,
    },
    form: {
        paddingVertical: 5,
        width: '80%',
        paddingHorizontal: 15,
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputText: {
        color: '#5c5959ff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    input: {
        color: '#000',
        width: "85%",
        fontSize: 18,
        fontWeight: 'bold',
        paddingLeft: 10,
        letterSpacing: 1
    },
    button: {
        backgroundColor: 'rgba(80, 217, 208, 1)',
        padding: 10,
        borderRadius: 15,
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 15,
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    splash: {
        width: 200,
        height: 45,
        resizeMode: 'contain',
        marginBottom: 20
    },
});
