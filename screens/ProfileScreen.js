import { StyleSheet, Text, View, Image, TouchableOpacity, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import RootLayout from './layouts/RootLayout'
import { LinearGradient } from 'expo-linear-gradient'
import { ChevronLeftIcon, MoveRight } from 'lucide-react-native'
import { useNavigation } from '@react-navigation/native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'
import { baseUrl } from '../constants/endpoints'
import { useSelector } from 'react-redux'

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState(null);
  const [userStores, setUserStores] = useState([]);

  const { userData: user, userToken: token } = useSelector((state) => state.application);

  const handleGetUserData = async () => {
    if (user) {
      setUserData(user);
      const { data } = await axios.get(`${baseUrl}/delivery-staff/profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUserData(data?.data?.staff);
      setUserStores(data?.data?.assignedStores);
      await AsyncStorage.setItem("user_data", JSON.stringify(data?.data?.staff));
    }
  }

  useEffect(() => {
    handleGetUserData();
  }, []);

  const handleClickSignout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Sign Out",
        onPress: () => handeSignOut(),
      },
    ]);
  }

  const handeSignOut = async () => {
    await AsyncStorage.clear();
    navigation.reset({
      index: 0,
      routes: [{ name: "CheckNumber" }],
    });
  }

  return (
    <RootLayout>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <ChevronLeftIcon size={26} color="#fff" strokeWidth={2.5} />
          </TouchableOpacity>
          <Image source={require("../assets/png/sngcolor.png")} style={{ width: 53, aspectRatio: 1 / 1, resizeMode: "contain", opacity: 0.9 }} />
        </View>

        <View style={styles.profileHeader}>
          <Image
            style={styles.avatar}
            source={{ uri: 'https://i.pravatar.cc/148' }}
          />
          <Text style={styles.name}>{userData?.name}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoLabel}>Email</Text>
          <Text style={styles.infoContent}>{userData?.email}</Text>
        </View>

        <TouchableOpacity style={styles.clickableSection}>
          <Text style={styles.clickableSectionText}>Assigned Stores</Text>
          <MoveRight size={24} color="#fff" strokeWidth={3} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.clickableSection}>
          <Text style={styles.clickableSectionText}>Assigned Camps</Text>
          <MoveRight size={24} color="#fff" strokeWidth={3} />
        </TouchableOpacity>

        <TouchableOpacity style={{ width: "100%" }} onPress={handleClickSignout}>
          <LinearGradient colors={['#811111ff', '#960334ff']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.button}>
            <Text style={styles.buttonText}>Sign Out</Text>
          </LinearGradient>
        </TouchableOpacity>

      </View>
    </RootLayout>
  )
}

export default ProfileScreen

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
    width: "100%",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  container: {
    flex: 1,
    alignItems: 'center', // Center content horizontally
    padding: 10,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 165,
    height: 165,
    borderRadius: 82, // Makes it a perfect circle
    marginBottom: 15,
    boxShadow: '0 7px 10px rgba(0, 22, 24, 0.2)',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e3e0e0ff',
  },
  infoSection: {
    width: '100%', // Take full width
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'rgb(255, 255, 255, 0.3)', // Light gray background for the section
    borderRadius: 10,
    boxShadow: '0 5px 7px rgba(0, 0, 0, 0.1)',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 5,
  },
  infoContent: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 22,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 13,
    width: '100%',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  clickableSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: 15,
    backgroundColor: 'rgb(255, 255, 255, 0.3)',
    borderRadius: 10,
    marginBottom: 20,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  clickableSectionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
})