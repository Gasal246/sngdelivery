import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Linking, Alert, ActivityIndicator } from 'react-native';
import { X, Phone, MapPin, Droplets, Clock, CheckCircle, XCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { baseUrl } from '../../constants/endpoints';

export default function OrderModal({ order, visible, onClose }) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [emptyBottleCount, setEmptyBottleCount] = useState('0');
    const [notes, setNotes] = useState("");
    const [inputHeight, setInputHeight] = useState(80);
    const [deliveredCount, setDeliveredCount] = useState(1);
    const [showCompleteDialog, setShowCompleteDialog] = useState(false);

    useEffect(() => {
        setEmptyBottleCount('0');
        setNotes('');
        setInputHeight(80);
        setIsUpdating(false);
        setShowCompleteDialog(false);
        setDeliveredCount(maxDeliverableCount);
    }, [orderId, maxDeliverableCount]);

    const { userToken } = useSelector((state) => state.application);

    if (!order) return null;

    const orderId = order?._id;
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

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return '#F59E0B';
            case 'completed': return '#10B981';
            case 'cancelled': return '#EF4444';
            default: return '#6B7280';
        }
    };

    const nestedOrder = order?.order ?? {};
    const user = nestedOrder?.user ?? {};
    const packageName = nestedOrder?.package_name || nestedOrder?.packge_name || 'Package';
    const bottleCount = nestedOrder?.bottle_count ?? 0;
    const leftCount = nestedOrder?.left_count ?? bottleCount;
    const initialCount = nestedOrder?.initial_count ?? bottleCount;
    const phoneNumber = user?.phone ? `+${user?.country_code ?? ''}${user.phone}` : '';
    const building = user?.building_no || user?.block_building || 'N/A';
    const block = user?.block || user?.block_building || 'N/A';
    const floor = user?.floor_no || 'N/A';
    const room = user?.room_no || 'N/A';
    const campLabel = order?.camp?.camp_name || order?.camp_name || order?.camp_id || 'N/A';
    const statusLabel = order?.isCancelled
        ? 'cancelled'
        : (order?.status === 1 || order?.status === '1')
            ? 'completed'
            : (order?.status === 2 || order?.status === '2')
                ? 'cancelled'
                : 'pending';
    const assignedDate = ensureDate(order?.createdAt);
    const orderedDate = nestedOrder?.createdAt ? ensureDate(nestedOrder.createdAt) : assignedDate;
    const deliveredDate = statusLabel === 'completed'
        ? ensureDate(order?.updatedAt || nestedOrder?.updatedAt)
        : null;
    const bottleInHand = nestedOrder?.bottle_in_hand ?? 0;
    const maxDeliverableCount = bottleCount > 0 ? bottleCount : 1;
    const deliveredBottles = order?.delivered_bottles ?? 0;

    const handleCompleteOrder = async () => {
        if (!orderId || !userToken) {
            Alert.alert("Unable to update", "Missing order reference or user session.");
            return;
        }

        const finalDeliveredCount = Math.min(
            maxDeliverableCount,
            Math.max(1, deliveredCount || 1)
        );

        setIsUpdating(true);
        try {
            await axios.post(`${baseUrl}/delivery-staff/complete-order`, {
                orderId,
                status: "delivered",
                note: notes?.trim() || '',
                empty_bottles: Number(emptyBottleCount) || 0,
                delivered_bottles: finalDeliveredCount,
            }, {
                headers: {
                    Authorization: `Bearer ${userToken}`
                }
            });

            Alert.alert("Order completed", "Delivery marked as completed successfully.");
            setShowCompleteDialog(false);
            onClose?.();
        } catch (error) {
            const message = error?.response?.data?.message || "Failed to mark order as completed.";
            Alert.alert("Error", message);
            console.log("Complete order failed", error?.response ?? error);
        } finally {
            setIsUpdating(false);
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
                <SafeAreaView style={styles.container} edges={["top"]}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Order Details</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X size={24} color="#6B7280" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        <View style={styles.statusContainer}>
                            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(statusLabel) }]}>
                                <Text style={styles.statusText}>{statusLabel.toUpperCase()}</Text>
                            </View>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Customer Information</Text>
                            <Text style={styles.customerName}>{user?.name || 'Customer'}</Text>
                            <TouchableOpacity style={styles.phoneContainer} onPress={() => phoneNumber && Linking.openURL(`tel:${phoneNumber}`)}>
                                <Phone size={16} color="#2D7A7A" />
                                <Text style={styles.phoneText}>{phoneNumber || "Not provided"}</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={[styles.section, { flexDirection: 'row', alignItems: 'center', gap: 12 }]}>
                            <Text style={styles.sectionTitle}>Bottle In Hand</Text>
                            <View style={[styles.bottlesContainer, { backgroundColor: '#fff3a8ff' }]}>
                                <Droplets size={16} color="#2D7A7A" />
                                <Text style={styles.bottlesText}>{bottleInHand} Bottle{bottleInHand === 1 ? '' : 's'}</Text>
                            </View>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Delivery Address</Text>
                            <View style={styles.addressContainer}>
                                <MapPin size={16} color="#6B7280" />
                                <View style={styles.addressDetails}>
                                    <Text style={styles.building}>{building}</Text>
                                    <Text style={styles.addressText}>Block: {block}</Text>
                                    <Text style={styles.addressText}>Floor: {floor}</Text>
                                    <Text style={styles.addressText}>Room: {room}</Text>
                                    <Text style={styles.zoneText}>Camp: {campLabel}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Order Details</Text>
                            <View style={styles.orderInfo}>
                                <View style={styles.packageContainer}>
                                    <Text style={styles.packageName}>{packageName}</Text>
                                    <View style={styles.bottlesContainer}>
                                        <Droplets size={16} color="#2D7A7A" />
                                        <Text style={styles.bottlesText}>{bottleCount} Bottle{bottleCount === 1 ? '' : 's'}</Text>
                                    </View>
                                </View>
                                {order?.isConsumption && (
                                    <Text style={styles.consumptionMeta}>
                                        Initial: {initialCount} | Left: {leftCount}
                                    </Text>
                                )}
                            </View>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Timeline</Text>
                            <View style={styles.timelineContainer}>
                                <Clock size={16} color="#6B7280" />
                                <View style={styles.timelineDetails}>
                                    <Text style={styles.timelineText}>
                                        Ordered: {formatDate(orderedDate)} at {formatTime(orderedDate)}
                                    </Text>
                                    <Text style={styles.timelineText}>
                                        Assigned: {formatDate(assignedDate)} at {formatTime(assignedDate)}
                                    </Text>
                                    {deliveredDate && (
                                        <Text style={styles.timelineText}>
                                            Delivered: {formatDate(deliveredDate)} at {formatTime(deliveredDate)}
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
                    onChangeText={(value) => setEmptyBottleCount(value.replace(/[^0-9]/g, ''))}
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

                    {statusLabel === 'pending' && (
                        <View style={styles.actionButtons}>
                            <TouchableOpacity
                                style={[styles.actionButton, styles.completeButton]}
                                onPress={() => {
                                    setDeliveredCount(maxDeliverableCount);
                                    setShowCompleteDialog(true);
                                }}
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
                </SafeAreaView>
            </LinearGradient>

            <Modal
                visible={showCompleteDialog}
                animationType="fade"
                transparent
                onRequestClose={() => !isUpdating && setShowCompleteDialog(false)}
            >
                <View style={styles.dialogOverlay}>
                    <View style={styles.dialogCard}>
                        <View style={styles.dialogHeader}>
                            <Text style={styles.dialogTitle}>Confirm Delivery</Text>
                            <TouchableOpacity onPress={() => !isUpdating && setShowCompleteDialog(false)}>
                                <X size={18} color="#6B7280" />
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.dialogSubtitle}>
                            Adjust delivered bottles if needed. Max {maxDeliverableCount} bottles.
                        </Text>

                        <View style={styles.counterRow}>
                            <TouchableOpacity
                                style={[styles.counterButton, deliveredCount <= 1 && styles.counterButtonDisabled]}
                                onPress={() => setDeliveredCount((prev) => Math.max(1, prev - 1))}
                                disabled={deliveredCount <= 1 || isUpdating}
                            >
                                <Text style={styles.counterButtonText}>-</Text>
                            </TouchableOpacity>

                            <Text style={styles.counterValue}>{deliveredCount}</Text>

                            <TouchableOpacity
                                style={[styles.counterButton, (deliveredCount >= maxDeliverableCount) && styles.counterButtonDisabled]}
                                onPress={() => setDeliveredCount((prev) => Math.min(maxDeliverableCount, prev + 1))}
                                disabled={deliveredCount >= maxDeliverableCount || isUpdating}
                            >
                                <Text style={styles.counterButtonText}>+</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={[styles.dialogConfirmButton, isUpdating && { opacity: 0.8 }]}
                            onPress={handleCompleteOrder}
                            disabled={isUpdating}
                        >
                            {isUpdating ? (
                                <ActivityIndicator color="#ffffff" />
                            ) : (
                                <Text style={styles.dialogConfirmText}>Confirm Delivery</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
    consumptionMeta: {
        marginTop: 12,
        fontSize: 12,
        fontWeight: '600',
        color: '#2D7A7A',
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
    captionText: {
        marginTop: 8,
        fontSize: 12,
        color: '#6B7280',
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
    },
    dialogOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.4)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    dialogCard: {
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        padding: 20,
        gap: 16,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowOffset: { width: 0, height: 8 },
        shadowRadius: 20,
        elevation: 8,
    },
    dialogHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dialogTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    dialogSubtitle: {
        fontSize: 14,
        color: '#4B5563',
        lineHeight: 20,
    },
    counterRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F9FAFB',
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    counterButton: {
        width: 44,
        height: 44,
        borderRadius: 8,
        backgroundColor: '#10B981',
        alignItems: 'center',
        justifyContent: 'center',
    },
    counterButtonDisabled: {
        backgroundColor: '#D1D5DB',
    },
    counterButtonText: {
        color: '#ffffff',
        fontSize: 22,
        fontWeight: '700',
    },
    counterValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
    },
    dialogConfirmButton: {
        backgroundColor: '#10B981',
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: 'center',
    },
    dialogConfirmText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: '700',
    }
});
