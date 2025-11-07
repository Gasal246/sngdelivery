import React from 'react';
import { View, StyleSheet } from 'react-native';

const RootLayout = ({ children }) => {
    return (
        <View className="bg-slate-900 h-10 border-2 border-black">
            {children}
        </View>
    );
}

const styles = StyleSheet.create({})

export default RootLayout;
