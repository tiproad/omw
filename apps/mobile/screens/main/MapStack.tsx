import React, {useState} from "react";
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import useDrawer from '../../hooks/drawer/useDrawer';
import useTheme from '../../hooks/theme/useTheme';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import {
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import Map, {MarkerData, styles} from "./map/Map";
import MapPanel from "./map/MapPanel";


const Stack: React.FC = () => {
    const [selectedMarker, setSelectedMarker] = useState(null as MarkerData);

    function onMarkerPress(marker: MarkerData): void {
        setSelectedMarker(marker);
    }

    function onMapPress(): void {
        setSelectedMarker(null);
    }
    return (
        <SafeAreaView>
            <View style={styles.container}>
                <StatusBar style='auto'/>
                <Map onMarkerPress={onMarkerPress} onMapPress={onMapPress}/>
                {selectedMarker !== null?<MapPanel marker={selectedMarker}/>:null}
            </View>
        </SafeAreaView>
    );
}

const Search: React.FC = () => {
    return (
        <SafeAreaView>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>This is the modal for search!</Text>
            </View>
        </SafeAreaView>
    );
};

type IStackNavigator = {
    Map: undefined;
    Search: undefined;
};

const StackNavigator = createStackNavigator<IStackNavigator>();

const MapStack: React.FC = () => {
    const { openDrawer } = useDrawer();
    const theme = useTheme();
    return (
        <StackNavigator.Navigator
            headerMode="screen"
            screenOptions={{
                headerLeft: () => (
                    <TouchableOpacity onPress={openDrawer} style={{ paddingHorizontal: 16 }}>
                        <MaterialCommunityIcons name="menu" size={25} color={theme.colors.foreground} />
                    </TouchableOpacity>
                ),
            }}>
            <StackNavigator.Screen name="Map" component={Stack} />
            <StackNavigator.Screen name="Search" component={Search} />
        </StackNavigator.Navigator>
    );
};

export default MapStack;
