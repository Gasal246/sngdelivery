import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import OrdersScreen from './screens/OrdersScreen';
import ProfileScreen from './screens/ProfileScreen';
import { StatusBar } from 'react-native';
import StaffCamps from './components/screens/StaffCamps';
const Stack = createStackNavigator();

export default function App() {
  return (
      <NavigationContainer>
      <StatusBar style="light" />
        <Stack.Navigator initialRouteName='Home'>
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Orders" component={OrdersScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
          <Stack.Screen name="StaffCamps" component={StaffCamps} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
  );
}
