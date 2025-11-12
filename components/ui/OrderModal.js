import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Linking, } from 'react-native';
import { X, Phone, MapPin, Droplets, Clock, CheckCircle, XCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function OrderModal({ order, visible, onClose }) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [emptyBottleCount, setEmptyBottleCount] = useState(order?.emptyBottles?.toString() || '0');
    const [notes, setNotes] = useState("");
    const [inputHeight, setInputHeight] = useState(80);

    React.useEffect(() => {
        if (order) {
            setEmptyBottleCount(order.emptyBottles?.toString() || '0');
        }
    }, [order]);

    if (!order) return null;

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

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return '#F59E0B';
            case 'completed': return '#10B981';
            case 'cancelled': return '#EF4444';
            default: return '#6B7280';
        }
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <LinearGradient style={styles.container} colors={["white", "#dbefefff"]}>
                <View style={styles.header}>
                    <Text style={styles.title}>Order Details</Text>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <X size={24} color="#6B7280" />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                    <View style={styles.statusContainer}>
                        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                            <Text style={styles.statusText}>{order.status.toUpperCase()}</Text>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Customer Information</Text>
                        <Text style={styles.customerName}>{order.customerName}</Text>
                        <TouchableOpacity style={styles.phoneContainer} onPress={() => Linking.openURL(`tel:${order.phoneNumber}`)}>
                            <Phone size={16} color="#2D7A7A" />
                            <Text style={styles.phoneText}>{order.phoneNumber}</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={[styles.section, { flexDirection: 'row', alignItems: 'center', gap: 12 }]}>
                        <Text style={styles.sectionTitle}>Bottle In Hand</Text>
                        <View style={[styles.bottlesContainer, { backgroundColor: '#fff3a8ff' }]}>
                            <Droplets size={16} color="#2D7A7A" />
                            <Text style={styles.bottlesText}>0 Bottles</Text>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Delivery Address</Text>
                        <View style={styles.addressContainer}>
                            <MapPin size={16} color="#6B7280" />
                            <View style={styles.addressDetails}>
                                <Text style={styles.building}>{order.building}</Text>
                                <Text style={styles.addressText}>Block: {order.floor}</Text>
                                <Text style={styles.addressText}>Floor: {order.floor}</Text>
                                <Text style={styles.addressText}>Room: {order.room}</Text>
                                <Text style={styles.zoneText}>Camp: {order.zone}</Text>
                            </View>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Order Details</Text>
                        <View style={styles.orderInfo}>
                            <View style={styles.packageContainer}>
                                <Text style={styles.packageName}>{order.packageName}</Text>
                                <View style={styles.bottlesContainer}>
                                    <Droplets size={16} color="#2D7A7A" />
                                    <Text style={styles.bottlesText}>{order.bottles} Bottles</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Timeline</Text>
                        <View style={styles.timelineContainer}>
                            <Clock size={16} color="#6B7280" />
                            <View style={styles.timelineDetails}>
                                <Text style={styles.timelineText}>
                                    Ordered: {formatDate(order.orderDate)} at {formatTime(order.orderDate)}
                                </Text>
                                <Text style={styles.timelineText}>
                                    Assigned: {formatDate(order.orderDate)} at {formatTime(order.orderDate)}
                                </Text>
                                {order.deliveryTime && (
                                    <Text style={styles.timelineText}>
                                        Delivered: {formatDate(order.deliveryTime)} at {formatTime(order.deliveryTime)}
                                    </Text>
                                )}
                            </View>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Empty Bottles to Return</Text>
                        <Text style={styles.sectionSubtitle}>Enter the number of empty bottles to collect</Text>
                        <View style={styles.emptyBottlesInputContainer}>
                            <TextInput
                                style={styles.emptyBottlesInput}
                                value={emptyBottleCount}
                                onChangeText={(value) => setEmptyBottleCount(value)}
                                keyboardType="numeric"
                                placeholder="0"
                                placeholderTextColor="#9CA3AF"
                            />
                            <Text style={styles.emptyBottlesLabel}>bottles</Text>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Notes</Text>
                        <TextInput
                            style={[styles.notesInput, { height: Math.max(80, inputHeight) }]} // auto height
                            value={notes}
                            onChangeText={(value) => {
                                if (value.length <= 300) setNotes(value); // restrict length
                            }}
                            multiline
                            onContentSizeChange={(e) =>
                                setInputHeight(e.nativeEvent.contentSize.height)
                            }
                            placeholder="Type your notes here..."
                        />
                        <Text style={styles.charCount}>{notes.length}/300</Text>
                    </View>



                </ScrollView>

                {order.status === 'pending' && (
                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.completeButton]}
                            onPress={() => { }}
                            disabled={isUpdating}
                        >
                            <CheckCircle size={20} color="white" />
                            <Text style={styles.actionButtonText}>Mark as Completed</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.actionButton, styles.cancelButton]}
                            onPress={() => { }}
                            disabled={isUpdating}
                        >
                            <XCircle size={20} color="white" />
                            <Text style={styles.actionButtonText}>Cancel Order</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </LinearGradient>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#111827',
    },
    closeButton: {
        padding: 4,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    statusContainer: {
        alignItems: 'center',
        marginBottom: 24,
    },
    statusBadge: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    statusText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 14,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 5,
    },
    notesInput: {
        backgroundColor: "#fff",
        borderRadius: 8,
        borderWidth: 2,
        borderColor: "#7a7979ff",
        padding: 10,
        textAlignVertical: "top", // important for Android multiline
        fontSize: 14,
        lineHeight: 20,
    },
    charCount: {
        textAlign: "right",
        marginTop: 4,
        color: "#666",
        fontSize: 12,
        marginBottom: 20
    },
    customerName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 8,
    },
    phoneContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#F0FDFA',
        padding: 12,
        borderRadius: 8,
    },
    phoneText: {
        fontSize: 16,
        color: '#2D7A7A',
        fontWeight: '500',
    },
    addressContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    addressDetails: {
        flex: 1,
    },
    building: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
    },
    addressText: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 2,
    },
    zoneText: {
        fontSize: 14,
        color: '#2D7A7A',
        fontWeight: '500',
        marginTop: 4,
    },
    orderInfo: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: '#aadde5ff',
    },
    packageContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    packageName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#111827',
        flex: 1,
    },
    bottlesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#E0F2F1',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    bottlesText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#2D7A7A',
    },
    timelineContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    timelineDetails: {
        flex: 1,
    },
    timelineText: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 4,
    },
    notesText: {
        fontSize: 14,
        color: '#6B7280',
        backgroundColor: '#F9FAFB',
        padding: 12,
        borderRadius: 8,
        lineHeight: 20,
    },
    actionButtons: {
        padding: 20,
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        paddingVertical: 14,
        borderRadius: 8,
    },
    completeButton: {
        backgroundColor: '#10B981',
    },
    cancelButton: {
        backgroundColor: '#EF4444',
    },
    actionButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    sectionSubtitle: {
        fontSize: 14,
        color: '#6B7280',
        marginBottom: 12,
        marginTop: -4,
    },
    emptyBottlesInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0FDFA',
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#797b7bff',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
    },
    emptyBottlesIconContainer: {
        backgroundColor: '#E0F2F1',
        padding: 8,
        borderRadius: 8,
    },
    emptyBottlesInput: {
        flex: 1,
        fontSize: 20,
        fontWeight: '600',
        color: '#111827',
        padding: 0,
    },
    emptyBottlesLabel: {
        fontSize: 16,
        color: '#2D7A7A',
        fontWeight: '500',
    },
    emptyBottlesDisplay: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: '#F0FDFA',
        padding: 16,
        borderRadius: 12,
    },
    emptyBottlesDisplayText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2D7A7A',
    }
});