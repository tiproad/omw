import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createStackNavigator, HeaderTitle } from '@react-navigation/stack';
import { DrawerScreenProps } from '@react-navigation/drawer';
import React from 'react';
import useTheme from '../../../hooks/theme/useTheme';
import { IDrawerRoutes } from '../drawer/Drawer';
import EmergencyContacts from './EmergencyContacts';
import { TouchableOpacity } from 'react-native';

type IStackNavigator = {
  EmergencyContacts: undefined;
};

const StackNavigator = createStackNavigator<IStackNavigator>();

const EmergencyContactsStack: React.FC<DrawerScreenProps<IDrawerRoutes, 'EmergencyContacts'>> = ({ navigation }) => {
  const theme = useTheme();
  return (
    <StackNavigator.Navigator
      headerMode="screen"
      screenOptions={{
        headerLeft: () => (
          <TouchableOpacity
            onPress={navigation.goBack.bind(null)}
            style={{ paddingHorizontal: 16 }}>
            <MaterialCommunityIcons name="arrow-left" size={25} color={theme.colors.foreground} />
          </TouchableOpacity>
        ),
      }}>
      <StackNavigator.Screen name="EmergencyContacts" component={EmergencyContacts} options={{ title: "Emergency Contacts" }}/>
    </StackNavigator.Navigator>
  );
};

export default EmergencyContactsStack;
