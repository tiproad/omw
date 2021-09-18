import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import useDrawer from '../../../hooks/drawer/useDrawer';
import useTheme from '../../../hooks/theme/useTheme';

const Map: React.FC = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Map!</Text>
    </View>
  );
};

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
      <StackNavigator.Screen name="Map" component={Map} />
      <StackNavigator.Screen name="Search" component={Search} />
    </StackNavigator.Navigator>
  );
};

export default MapStack;
