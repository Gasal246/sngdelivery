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

  const normalizeStatus = (status, isCancelled = false) => {
    if (isCancelled) return "cancelled";
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
            ({filteredOrders.length}) {selectedLabel}
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
          data={filteredOrders}
          style={{ height: "78%", borderRadius: 10, overflow: 'hidden' }}
          keyExtractor={(item) => item?._id}
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
