import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Droplets, MapPin, Clock } from 'lucide-react-native';

export default function OrderCard({ order, onPress }) {
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} testID={`order-card-${order.id}`}>
      <View style={styles.header}>
        <View style={styles.packageBadge}>
          <Text style={styles.packageText}>{order.packageName}</Text>
        </View>
        <View style={styles.bottlesBadge}>
          <Droplets size={14} color="#2D7A7A" />
          <Text style={styles.bottlesText}>{order.bottles.toString().padStart(2, '0')} Bottles</Text>
        </View>
      </View>

      <Text style={styles.customerName}>{order.customerName}</Text>
      
      <View style={styles.addressContainer}>
        <MapPin size={14} color="#e8f1f1ff" />
        <View style={styles.addressText}>
          <Text style={styles.building}>Building: {order.building}</Text>
          <Text style={styles.details}>Floor: {order.floor}</Text>
          <Text style={styles.details}>Room: {order.room}</Text>
        </View>
      </View>

      <View style={styles.timeContainer}>
        <Clock size={14} color="#e0e1e4ff" />
        <Text style={styles.timeText}>
          {formatDate(order.orderDate)}, {formatTime(order.orderDate)}
        </Text>
      </View>

      {order.status === 'completed' && order.deliveryTime && (
        <View style={styles.completedBadge}>
          <Text style={styles.completedText}>
            Delivered at {formatTime(order.deliveryTime)}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 7,
      height: 7,
    },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 3,
    borderColor: 'rgba(255,255,255,0.6)',
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  packageBadge: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    flex: 1,
    marginRight: 8,
  },
  packageText: {
    color: '#065F46',
    fontSize: 12,
    fontWeight: '500',
  },
  bottlesBadge: {
    backgroundColor: '#E0F2F1',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bottlesText: {
    color: '#2D7A7A',
    fontSize: 12,
    fontWeight: '600',
  },
  customerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffffff',
    marginBottom: 8,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 6,
  },
  addressText: {
    flex: 1,
  },
  building: {
    fontSize: 14,
    color: '#f0f4f5ff',
    fontWeight: '500',
  },
  details: {
    fontSize: 13,
    color: '#ebf0faff',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    fontSize: 12,
    color: '#dfe0e4ff',
  },
  completedBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  completedText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '500',
  },
});