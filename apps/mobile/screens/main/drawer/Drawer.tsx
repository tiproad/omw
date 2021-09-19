import * as React from 'react';
import { Platform, TouchableOpacity, View, StyleSheet, Text } from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerContentComponentProps,
  DrawerContentOptions,
} from '@react-navigation/drawer';
import MainNavigator from '../MapNavigator';
import { Auth } from 'aws-amplify';
import useUpdateAuthState from '../../../hooks/updateAuthState/useUpdateAuthState';
import { Theme } from '../../../hooks/theme/Theme';
import useTheme from '../../../hooks/theme/useTheme';
import { EvilIcons } from '@expo/vector-icons';
import EmergencyContactsStack from '../emergency-contacts/EmergencyContactsStack';

export type IDrawerRoutes = {
  MapNavigator: undefined;
  EmergencyContacts: undefined;
};

const DrawerNavigator = createDrawerNavigator<IDrawerRoutes>();

const DrawerContent: React.FC<DrawerContentComponentProps<DrawerContentOptions>> = (props) => {
  const updateAuthState = useUpdateAuthState();
  const theme = useTheme();
  const signOut = async () => {
    try {
      await Auth.signOut();
      updateAuthState('loggedOut');
    } catch (error) {
      console.log('Error signing out: ', error);
    }
  };
  const styles = styleSheet(theme);
  return (
    <View style={{ flex: 1 }}>
      <View style={{ height: '90%' }}>
        <DrawerContentScrollView {...props}>
        <TouchableOpacity
            style={styles.contactUsContainer}
            onPress={() => {
              props.navigation.navigate('EmergencyContacts');
            }}>
            <EvilIcons name={'user'} size={30} color={'black'} />
            <Text style={styles.drawerText}>Emergency Contacts</Text>
          </TouchableOpacity>
        </DrawerContentScrollView>
      </View>

      <TouchableOpacity style={styles.logoutContainer} onPress={signOut}>
        <Text style={styles.logoutText}>SIGN OUT</Text>
      </TouchableOpacity>
    </View>
  );
};

const Drawer: React.FC = () => {
  return (
    <DrawerNavigator.Navigator
      initialRouteName="MapNavigator"
      drawerContent={(props) => <DrawerContent {...props} />}>
      <DrawerNavigator.Screen name="MapNavigator" component={MainNavigator} />
      <DrawerNavigator.Screen name="EmergencyContacts" component={EmergencyContactsStack} />

    </DrawerNavigator.Navigator>
  );
};

export default Drawer;

const drawerStyle = {
  activeTintColor: 'black',
  inactiveTintColor: 'black',
  labelStyle: {
    marginVertical: 16,
    marginHorizontal: 0,
  },
  iconContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemStyle: {},
};

const styleSheet = (theme: Theme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      paddingTop: Platform.OS === 'android' ? 25 : 0,
    },
    container: {
      flex: 1,
    },
    image: {
      resizeMode: 'contain',
      width: '80%',
      height: '100%',
    },
    contactUsContainer: {
      flexDirection: 'row',
      width: '100%',
      height: 50,
      alignItems: 'center',
      paddingLeft: 15,
    },
    logoutContainer: {
      flexDirection: 'row',
      width: '100%',
      height: 50,
      alignItems: 'flex-end',
      justifyContent: 'center',
    },
    drawerText: {
      marginLeft: 16,
    },
    logoutText: {
      color: theme.colors.darkGrey,
    },
  });
