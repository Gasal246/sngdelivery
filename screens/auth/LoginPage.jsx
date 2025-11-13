import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRoute } from '@react-navigation/native';
import { baseUrl } from '../../constants/endpoints';

const height = Dimensions.get('window').height;

const LoginPage = () => {
  const { phoneNumber } = useRoute().params;
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (loading) return;
    if (!password) return;
    setLoading(true);
    try {
      const { data } = await axios.post(`${baseUrl}/delivery-staff/login`, { phone: phoneNumber, password });
      if (data?.status === 200) {
        await AsyncStorage.multiSet([
          ["token", data?.data?.token],
          ["user_data", JSON.stringify(data?.data?.user_data)],
        ]);
        navigation.navigate("Home", { phone:  phoneNumber });
      } else {
        Alert.alert("Error SignIn", "Invalid credentials");
      }
    } catch (error) {
      Alert.alert("Error SignIn", "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const onClickForgotPassword = () => {
    Alert.alert("Forgot Password ?", "You will recieve a reset password link to your registered email id", [
      {
        text: "Cancel",
        onPress: () => { /* Eat Snickers & Do nothing */  },
        style: "cancel",
      },
      {
        text: "Confirm",
        onPress: sendResetMail,
      },
    ])
  }

  const sendResetMail = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const { data } = await axios.post(`${baseUrl}/delivery-staff/forgot-password`, { phone: phoneNumber });
      if (data?.status === 200) {
        Alert.alert("Success", "Reset password link has been sent to your email id");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <LinearGradient
        colors={['#0f172a', '#1e293b', '#0f172a']}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <Image source={require('../../assets/png/sngcolor.png')} style={styles.logo} />
            <Text style={styles.title}>Enter Your Password</Text>
          </View>

          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              keyboardType="default"
              secureTextEntry
              autoCorrect={false}
              autoCapitalize="none"
            />
          </View>
          <TouchableOpacity style={[styles.form, { backgroundColor: 'rgba(80, 217, 208, 1)', paddingVertical: 15, justifyContent: 'center', marginTop: 10 }]} onPress={handleLogin}>
            <Text style={styles.buttonText}>{loading ? "Loading..." : "Start Sign In"}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClickForgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password ?</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </LinearGradient>
    </KeyboardAwareScrollView>
  )
}

export default LoginPage

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
        width: "98%",
        fontSize: 18,
        fontWeight: 'bold',
        paddingLeft: 10,
        letterSpacing: 1,
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
    forgotPasswordText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 25,
        textDecorationLine: 'underline',
    },
});
