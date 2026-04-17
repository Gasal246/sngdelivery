import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';

export default function CustomAlert({
    visible,
    title,
    description,
    actions = [],
    children,
    icon,
    onRequestClose = () => {},
}) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onRequestClose}
        >
            <View style={styles.overlay}>
                <TouchableWithoutFeedback onPress={onRequestClose}>
                    <View style={StyleSheet.absoluteFill} />
                </TouchableWithoutFeedback>

                <View style={styles.card}>
                    {icon ? <View style={styles.iconContainer}>{icon}</View> : null}

                    {title ? <Text style={styles.title}>{title}</Text> : null}
                    {description ? <Text style={styles.description}>{description}</Text> : null}

                    {children}

                    {actions.length > 0 && (
                        <View style={styles.actionsRow}>
                            {actions.map(({ text, onPress, variant = 'primary' }, index) => {
                                const isPrimary = variant === 'primary';
                                const isDestructive = variant === 'destructive';
                                return (
                                    <TouchableOpacity
                                        key={`${text}-${index}`}
                                        style={[
                                            styles.actionButton,
                                            isPrimary && styles.primaryButton,
                                            isDestructive && styles.destructiveButton,
                                        ]}
                                        onPress={onPress}
                                        activeOpacity={0.9}
                                    >
                                        <Text
                                            style={[
                                                styles.actionText,
                                                (isPrimary || isDestructive) && styles.actionTextInverted,
                                            ]}
                                        >
                                            {text}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    card: {
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: 14,
        padding: 20,
        gap: 12,
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowOffset: { width: 0, height: 12 },
        shadowRadius: 18,
        elevation: 10,
    },
    iconContainer: {
        alignSelf: 'flex-start',
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#ECFEF3',
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    description: {
        fontSize: 14,
        color: '#4B5563',
        lineHeight: 20,
    },
    actionsRow: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 4,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
    },
    primaryButton: {
        backgroundColor: '#10B981',
        borderColor: '#10B981',
    },
    destructiveButton: {
        backgroundColor: '#EF4444',
        borderColor: '#EF4444',
    },
    actionText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#111827',
    },
    actionTextInverted: {
        color: '#ffffff',
    },
});
