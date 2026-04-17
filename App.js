import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import OrdersScreen from './screens/OrdersScreen';
import ProfileScreen from './screens/ProfileScreen';
import { StatusBar, Platform } from 'react-native';
import StaffCamps from './components/screens/StaffCamps';
import CheckNumberPage from './screens/auth/CheckNumberPage';
import LoginPage from './screens/auth/LoginPage';
import NotificationScreen from './screens/NotificationScreen';
import { Provider } from 'react-redux';
import { store } from './store/store';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
const Stack = createStackNavigator();

// Configure how notifications appear when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

// Register for push notifications
async function registerForPushNotificationsAsync() {
  try {
    // Skip if running in Expo Go
    if (!Device.isDevice) {
      console.log('Must use physical device for Push Notifications');
      return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token permission');
      return null;
    }

    // Only try to get push token in development build
    if (__DEV__) {
      console.log('Push notifications are not supported in Expo Go. Use development build.');
      return null;
    }

    // Configure Android channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#4d6499',
      });
    }

    return 'dummy-token-for-development';
  } catch (error) {
    console.log('Error getting push token:', error);
    return null;
  }
}

export default function App() {
  const [expoPushToken, setExpoPushToken] = React.useState('');
  const [notification, setNotification] = React.useState(false);
  const notificationListener = React.useRef();
  const responseListener = React.useRef();

  React.useEffect(() => {
    let isMounted = true;

    async function setupNotifications() {
      try {
        const token = await registerForPushNotificationsAsync();
        if (token && isMounted) {
          setExpoPushToken(token);
          console.log('Push token:', token);
        }

        // Only set up listeners in development build
        if (!__DEV__) {
          notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            if (isMounted) setNotification(notification);
          });

          responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            const { data } = response.notification.request.content;
            console.log('Notification tapped:', data);
          });
        }
      } catch (error) {
        console.log('Error setting up notifications:', error);
      }
    }

    setupNotifications();

    return () => {
      isMounted = false;
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <StatusBar style="light" />
        <Stack.Navigator initialRouteName='Home'>
          <Stack.Screen name="CheckNumber" component={CheckNumberPage} options={{ headerShown: false }} />
          <Stack.Screen name="LoginPage" component={LoginPage} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Orders" component={OrdersScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
          <Stack.Screen name="StaffCamps" component={StaffCamps} options={{ headerShown: false }} />
          <Stack.Screen name="Notification" component={NotificationScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
