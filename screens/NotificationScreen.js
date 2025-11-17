import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import RootLayout from './layouts/RootLayout';
import * as Notifications from 'expo-notifications';
import { Bell, ChevronLeftIcon } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const NotificationScreen = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Get all presented notifications when screen mounts
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    const presentedNotifications = await Notifications.getPresentedNotificationsAsync();
    setNotifications(presentedNotifications.reverse()); // Show newest first
  };

  const renderNotification = ({ item }) => {
    const { title, body, data } = item.request.content;
    const date = new Date(item.date);

    return (
      <TouchableOpacity
        style={styles.notificationItem}
        onPress={() => {
          // Handle notification tap
          if (data?.screen) {
            // Navigate to specific screen if specified
            navigation.navigate(data.screen, data.params);
          }
        }}
      >
        <View style={styles.notificationIcon}>
          <Bell size={24} color="#4d6499ff" />
        </View>
        <View style={styles.notificationContent}>
          <Text style={styles.notificationTitle}>{title || 'New Notification'}</Text>
          <Text style={styles.notificationBody}>{body}</Text>
          <Text style={styles.notificationTime}>
            {date.toLocaleDateString()} {date.toLocaleTimeString()}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <RootLayout>
      <View style={styles.container}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", gap: 10, justifyContent: 'center' }} onPress={() => navigation.goBack()}>
            <View style={{ padding: 5, backgroundColor: '#4d6499ff', borderRadius: 10 }}>
              <ChevronLeftIcon size={26} color="#fff" strokeWidth={2.5} />
            </View>
            <Text style={styles.header}>Notifications</Text>
          </TouchableOpacity>
          <Image source={require("../assets/png/sngcolor.png")} style={{ width: 53, aspectRatio: 1 / 1, resizeMode: "contain", opacity: 0.9 }} />
        </View>
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Bell size={48} color="#fff" style={{ opacity: 0.6 }} />
            <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
        ) : (
          <FlatList
            data={notifications}
            renderItem={renderNotification}
            keyExtractor={(item) => item.request.identifier}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
    </RootLayout>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#9e9fa1ff',
  },
  listContainer: {
    flexGrow: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  notificationIcon: {
    marginRight: 16,
    justifyContent: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#0F172A',
  },
  notificationBody: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  notificationTime: {
    fontSize: 12,
    color: '#94A3B8',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 17,
    color: '#64748B',
    fontWeight: '500'
  },
});