import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, PermissionsAndroid, Platform } from 'react-native';
import Contacts from 'react-native-contacts';

const EmergencyContactListItem: React.FC<{name: string}> = ({name}) => {
    return (
        <View style={styles.contactLi}>
            <View style={styles.contactInfo}>
            <Text style={styles.contactName}>{name}</Text>
            <Text style={styles.contactPhone}>{"Phone # here"}</Text>
        </View>
            {/* Remove button goes here */}
        </View>
    )
}

type Contact = {
    name: string;
    phoneNumber: string;
}

const EmergencyContactsScreen: React.FC = () => {
    const [contacts, setContacts] = useState<Array<Contact>>([]);
    useEffect(() => {
        // If api res state has contacts
        if(Platform.OS === "android"){
        PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
            {
              'title': 'Contacts',
              'message': 'This app would like to view your contacts.',
              'buttonPositive': 'Continue'
            }
          ).then(() => {
              // Loop through contactIds and get contacts
              const list: Array<Contact> = [];
              setContacts(list)
          })
        }
    }, [{/* API res state */}])
    // Get contactIDs of emergency contacts from backend
    // Find matching contacts in phone
  return (
    <View style={styles.container}>
      <FlatList data={[{key: "Ethan Orlander"}, {key: "Aaron Pham"}]} renderItem={({item}) => <EmergencyContactListItem name={item.key}/>}/>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
     flex: 1,
     paddingTop: 22
    },
    contactLi: {
      padding: 10,
      flex: 1,
      flexDirection: 'row'
    },
    contactInfo: {
        flex: 1,
        flexDirection: 'column'
    },
    contactName: {
        fontSize: 18,
    },
    contactPhone: {
        fontSize: 14
    }
  });

export default EmergencyContactsScreen;
