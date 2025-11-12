import { View, StyleSheet} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

const RootLayout = ({ children, layoutViewStyle }) => {
    return (
        <SafeAreaView style={styles.safeArea}>
            <LinearGradient colors={["#0f172a", "#313647", "#0f172a"]} style={[styles.container, layoutViewStyle]}>
                {children}
            </LinearGradient>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#0f172a',
        color: '#fff',
    },
    container: {
        flex: 1,
        backgroundColor: '#313647',
        padding: 15,
    },
});

export default RootLayout;
