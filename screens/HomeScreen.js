import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import RootLayout from './layouts/RootLayout';

const HomeScreen = () => {
    return (
        <RootLayout>
            <View style={{ }}>
                <Text style={{ color: "white" }}>THE HOME PAGE</Text>
            </View>
        </RootLayout>
    );
}

const styles = StyleSheet.create({})

export default HomeScreen;
