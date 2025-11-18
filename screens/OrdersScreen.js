import React, { useEffect, useMemo, useState } from 'react'
import { StyleSheet, Image, View, TouchableOpacity, Text, FlatList } from 'react-native'
import RootLayout from './layouts/RootLayout'
import { ChevronLeftIcon, ChevronRight, Filter } from 'lucide-react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import OrderCard from '../components/ui/OrderCard'
import OrderModal from '../components/ui/OrderModal'
import { useDispatch, useSelector } from 'react-redux'
import { fetchDeliveryOrders } from '../store/slices/appslice'

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const lastWeek = new Date(today);
lastWeek.setDate(lastWeek.getDate() - 7);

const mockOrders = [
  {
    id: '1',
    customerName: 'Ahmad Al-Farsi',
    building: 'Tower A',
    floor: '02',
    room: '210',
    bottles: 5,
    packageName: 'Demo Package Name',
    zone: 'dubai-abc-1',
    status: 'pending',
    orderDate: today,
    phoneNumber: '+971501234567',
    notes: 'Please call before delivery'
  },
  {
    id: '2',
    customerName: 'Fatima Hassan',
    building: 'Building B',
    floor: '05',
    room: '503',
    bottles: 3,
    packageName: 'Family Package',
    zone: 'dubai-abc-1',
    status: 'pending',
    orderDate: today,
    phoneNumber: '+971507654321'
  },
  {
    id: '3',
    customerName: 'Mohammed Ali',
    building: 'Villa 123',
    floor: 'Ground',
    room: 'Main',
    bottles: 8,
    packageName: 'Bulk Package',
    zone: 'dubai-abc-2',
    status: 'completed',
    orderDate: today,
    deliveryTime: new Date(today.getTime() - 2 * 60 * 60 * 1000),
    phoneNumber: '+971509876543'
  },
  {
    id: '4',
    customerName: 'Sarah Ahmed',
    building: 'Tower C',
    floor: '12',
    room: '1205',
    bottles: 2,
    packageName: 'Standard Package',
    zone: 'dubai-abc-2',
    status: 'completed',
    orderDate: today,
    deliveryTime: new Date(today.getTime() - 4 * 60 * 60 * 1000),
    phoneNumber: '+971502345678'
  },
  {
    id: '5',
    customerName: 'Omar Khalil',
    building: 'Building D',
    floor: '03',
    room: '301',
    bottles: 6,
    packageName: 'Premium Package',
    zone: 'dubai-def-1',
    status: 'pending',
    orderDate: today,
    phoneNumber: '+971508765432'
  },
  {
    id: '6',
    customerName: 'Layla Ibrahim',
    building: 'Tower E',
    floor: '08',
    room: '804',
    bottles: 4,
    packageName: 'Family Package',
    zone: 'dubai-def-1',
    status: 'completed',
    orderDate: yesterday,
    deliveryTime: yesterday,
    phoneNumber: '+971503456789'
  },
  {
    id: '7',
    customerName: 'Hassan Mahmoud',
    building: 'Villa 456',
    floor: 'Ground',
    room: 'Kitchen',
    bottles: 10,
    packageName: 'Bulk Package',
    zone: 'sharjah-xyz-1',
    status: 'pending',
    orderDate: today,
    phoneNumber: '+971506789012'
  },
  {
    id: '8',
    customerName: 'Amina Rashid',
    building: 'Building F',
    floor: '06',
    room: '602',
    bottles: 3,
    packageName: 'Standard Package',
    zone: 'sharjah-xyz-1',
    status: 'completed',
    orderDate: lastWeek,
    deliveryTime: lastWeek,
    phoneNumber: '+971504567890'
  }
];

const OrdersScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const [showFilters, setShowFilters] = useState(false);
  const [dateFilter, setDateFilter] = useState('today');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const { storeId, campId, storeName, campName } = route.params || {};

  const { userToken, orders } = useSelector((state) => state.application);

  useEffect(() => {
    if (!orders && userToken) {
      dispatch(fetchDeliveryOrders({ period: "day", token: userToken }));
    }
  }, [orders, userToken, dispatch]);

  const normalizeStatus = (status) => {
    if (status === 0 || status === "0") return "pending";
    if (status === 1 || status === "1") return "completed";
    if (status === 2 || status === "2") return "cancelled";
    return status || "pending";
  };

  const parseDate = (dateVal) => {
    const date = dateVal ? new Date(dateVal) : new Date();
    return isNaN(date.getTime()) ? new Date() : date;
  };

  const sourceOrders = Array.isArray(orders) && orders.length ? orders : mockOrders;

  const filteredOrders = useMemo(() => {
    const hasStoreKey = sourceOrders.some(order => order?.store_id || order?.storeId);
    return sourceOrders.filter((order) => {
      const matchesStore = !storeId || `${order?.store_id ?? order?.storeId}` === `${storeId}`;
      const matchesCamp = !campId || `${order?.camp_id ?? order?.campId}` === `${campId}`;
      if ((storeId || campId) && !hasStoreKey) return true; // allow mock data to show when no ids present
      return matchesStore && matchesCamp;
    });
  }, [sourceOrders, storeId, campId]);

  const displayOrders = filteredOrders.map((order, index) => {
    const orderId = order?._id || order?.order_id || order?.id || `order-${index}`;
    const customerName = order?.customer_name || order?.customerName || order?.user_name || "Customer";
    const building = order?.building || order?.address || order?.block || "Building";
    const floor = order?.floor || order?.level || "0";
    const room = order?.room || order?.unit || order?.apartment || "0";
    const bottleCount = order?.bottle_count ?? order?.bottles ?? 0;
    const packageName = order?.package_name || order?.packageName || "Package";
    const orderDate = parseDate(order?.orderDate || order?.createdAt || order?.created_at);
    const deliveryTime = order?.deliveryTime ? parseDate(order.deliveryTime) : order?.deliveredAt ? parseDate(order.deliveredAt) : undefined;

    return {
      id: `${orderId}`,
      customerName,
      building,
      floor: `${floor}`,
      room: `${room}`,
      bottles: bottleCount,
      packageName,
      zone: order?.zone || campName || storeName || "Zone",
      status: normalizeStatus(order?.status),
      orderDate,
      deliveryTime,
      phoneNumber: order?.phone || order?.phoneNumber || order?.customer_phone || "",
      notes: order?.notes,
      store_id: order?.store_id ?? order?.storeId,
      camp_id: order?.camp_id ?? order?.campId,
      raw: order,
    };
  });

  const selectedLabel = useMemo(() => {
    if (storeName || campName) {
      return `${storeName ?? 'Store'}${campName ? ` / ${campName}` : ''}`;
    }
    return 'All Orders';
  }, [storeName, campName]);

  const renderFilters = () => (
    <View style={styles.filtersContainer}>
      <Text style={styles.filterTitle}>Date Filter</Text>
      <View style={styles.filterRow}>
        {(['today', 'week', 'month']).map((filter) => {
          if (!filter || filter.length > 10) return null;
          const sanitizedFilter = filter.trim();
          return (
            <TouchableOpacity
              key={filter}
              style={[styles.filterButton, dateFilter === filter && styles.activeFilterButton]}
              onPress={() => setDateFilter(filter)}
            >
              <Text style={[styles.filterButtonText, dateFilter === filter && styles.activeFilterButtonText]}>
                {sanitizedFilter.charAt(0).toUpperCase() + sanitizedFilter.slice(1)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.filterTitle}>Status Filter</Text>
      <View style={styles.filterRow}>
        {(['all', 'pending', 'completed', 'cancelled']).map((filter) => {
          if (!filter || filter.length > 15) return null;
          const sanitizedFilter = filter.trim();
          return (
            <TouchableOpacity
              key={filter}
              style={[styles.filterButton, statusFilter === filter && styles.activeFilterButton]}
              onPress={() => setStatusFilter(filter)}
            >
              <Text style={[styles.filterButtonText, statusFilter === filter && styles.activeFilterButtonText]}>
                {sanitizedFilter.charAt(0).toUpperCase() + sanitizedFilter.slice(1)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  return (
    <RootLayout>
      <View>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <ChevronLeftIcon size={26} color="#fff" strokeWidth={2.5} />
          </TouchableOpacity>
          <Image source={require("../assets/png/sngcolor.png")} style={{ width: 53, aspectRatio: 1 / 1, resizeMode: "contain", opacity: 0.9 }} />
        </View>
        <TouchableOpacity style={styles.header2} onPress={() => navigation.navigate("StaffCamps")}>
          <Text style={{ fontFamily: "Orbitron", fontSize: 17, textAlign: "left", fontWeight: "bold", opacity: 0.9 }}>
            ({displayOrders.length}) {selectedLabel}
          </Text>
          <ChevronRight size={24} strokeWidth={3} color="#000" />
        </TouchableOpacity>

        {/* Filter Toggle */}
        <View style={styles.controlContainer}>
          <TouchableOpacity style={styles.filterToggle} onPress={() => setShowFilters(!showFilters)}>
            <Filter size={16} color="white" />
            <Text style={styles.filterToggleText}>Filters</Text>
          </TouchableOpacity>
        </View>
        {showFilters && renderFilters()}

        <FlatList
          data={displayOrders}
          style={{ height: "78%", borderRadius: 10, overflow: 'hidden' }}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <OrderCard
              order={item}
              onPress={() => setSelectedOrder(item)}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.ordersList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No orders found</Text>
              <Text style={styles.emptySubtext}>Try adjusting your filters</Text>
            </View>
          }
        />
      </View>
      <OrderModal order={selectedOrder} visible={!!selectedOrder} onClose={() => setSelectedOrder(null)} />
    </RootLayout>
  )
}

export default OrdersScreen

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
  header2: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    paddingHorizontal: 16,
    borderRadius: 15,
    marginBottom: 16,
    backgroundColor: "rgba(255,255,255, 0.99)",
    shadowColor: "#000",
    shadowOffset: {
      width: 7,
      height: 7,
    },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 5,
  },
  controlContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 10
  },
  filterToggle: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 20
  },
  filterToggleText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
  filtersContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  activeFilterButton: {
    backgroundColor: '#3c96b4ff',
  },
  filterButtonText: {
    fontSize: 12,
    color: '#444a55ff',
    fontWeight: "500",
  },
  activeFilterButtonText: {
    color: 'white',
  },
  ordersList: {
    paddingBottom: 80,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  emptySubtext: {
    color: "#e0e0e0",
    marginTop: 6,
    fontSize: 12,
  },
});
