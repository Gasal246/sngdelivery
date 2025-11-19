import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Droplets, MapPin, Clock } from 'lucide-react-native';

export default function OrderCard({ order, onPress }) {
  const ensureDate = (value) => {
    if (value instanceof Date) return value;
    const parsed = value ? new Date(value) : new Date();
    return isNaN(parsed.getTime()) ? new Date() : parsed;
  };

  const formatTime = (date) => {
    const safeDate = ensureDate(date);
    return safeDate.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    const safeDate = ensureDate(date);
    return safeDate.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const orderDate = ensureDate(order?.createdAt);
  const deliveryTime = order?.deliveryTime ? ensureDate(order.deliveryTime) : null;
  const bottles = order?.order?.bottle_count ?? 0;
  const buildingLabel = order?.order?.user?.building_no || 'nil';
  const blockLabel = order?.order?.user?.block ? ` | Block ${order.order.user.block}` : '';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} testID={`order-card-${order._id}`}>
      <View style={styles.header}>
        <View style={styles.packageBadge}>
          <Text style={styles.packageText}>{order?.order?.package_name || "Package"}</Text>
        </View>
        <View style={styles.bottlesBadge}>
          <Droplets size={14} color="#2D7A7A" />
          <Text style={styles.bottlesText}>{bottles.toString().padStart(2, '0')} Bottle{bottles === 1 ? '' : 's'}</Text>
        </View>
      </View>

      <Text style={styles.customerName}>{order?.order?.user?.name || "Customer"}</Text>
      
      <View style={styles.addressContainer}>
        <MapPin size={14} color="#e8f1f1ff" />
        <View style={styles.addressText}>
          <Text style={styles.building}>Building: {buildingLabel}{blockLabel}</Text>
          <Text style={styles.details}>Floor: {order?.order?.user?.floor_no ?? "-"}</Text>
          <Text style={styles.details}>Room: {order?.order?.user?.room_no ?? "-"}</Text>
        </View>
      </View>

      <View style={styles.timeContainer}>
        <Clock size={14} color="#e0e1e4ff" />
        <Text style={styles.timeText}>
          {formatDate(orderDate)}, {formatTime(orderDate)}
        </Text>
      </View>

      {order?.status === 'completed' && deliveryTime && (
        <View style={styles.completedBadge}>
          <Text style={styles.completedText}>
            Delivered at {formatTime(deliveryTime)}
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
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.3)',
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
