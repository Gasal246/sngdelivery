// /components/RootBottomBar.js
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { Home, Package, User } from 'lucide-react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { BlurView } from 'expo-blur'

const RootBottomBarList = [
  {
    name: "Home",
    icon: (active) => <Home size={26} strokeWidth={active ? 3 : 2} color={active ? "#5AE7A6" : "#D1D5DB"} />,
    screen: "Home",
  },
  {
    name: "Orders",
    icon: (active) => <Package size={26} strokeWidth={active ? 3 : 2} color={active ? "#5AE7A6" : "#D1D5DB"} />,
    screen: "Orders",
  },
  {
    name: "Profile",
    icon: (active) => <User size={26} strokeWidth={active ? 3 : 2} color={active ? "#5AE7A6" : "#D1D5DB"} />,
    screen: "Profile",
  },
]

const RootBottomBar = () => {
  const navigation = useNavigation();
  const current = useRoute().name;

  return (
    <View style={styles.wrapper}>
      <BlurView intensity={45} tint="light" style={styles.container}>
        {RootBottomBarList.map((item, index) => {
          const active = current === item.screen
          return (
            <TouchableOpacity
              key={index}
              onPress={() => navigation.navigate(item.screen)}
              style={styles.navItem}
            >
              {item.icon(active)}
              <Text style={[styles.label, active && { color: "#5AE7A6" }]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )
        })}
      </BlurView>
    </View>
  )
}

export default RootBottomBar

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    bottom: 24,
    left: 20,
    right: 20,
  },

  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 14,
    borderRadius: 26,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.25)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.5)",
  },

  navItem: {
    alignItems: "center",
    justifyContent: "center",
  },

  label: {
    marginTop: 4,
    fontSize: 12,
    color: "#D1D5DB",
    fontWeight: "600",
  },
})
