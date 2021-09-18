import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Amplify, { Auth } from 'aws-amplify';
import { PortalProvider } from '@gorhom/portal';
import { ThemeProvider } from "./hooks/theme/Context"
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from "./screens/auth"
import { UpdateAuthStateProvider } from './hooks/updateAuthState/Context';
import Drawer from './screens/main/drawer/Drawer';

Amplify.configure({
  Auth: {
    region: 'us-east-1',
    userPoolId: 'us-east-1_XIcdCn8or',
    userPoolWebClientId: '1bgqdocm6fouhns3q4b6jsvqjs',
  },
});

const Initializing = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="tomato" />
    </View>
  );
};

const App: React.FC = () => {
  const [isUserLoggedIn, setUserLoggedIn] = useState('initializing');
  useEffect(() => {
    void checkAuthState();
  }, []);
  async function checkAuthState() {
    try {
      await Auth.currentAuthenticatedUser();
      console.log('✅ User is signed in');
      setUserLoggedIn('loggedIn');
    } catch (err) {
      console.log('❌ User is not signed in');
      setUserLoggedIn('loggedOut');
    }
  }
  function updateAuthState(isUserLoggedIn: string) {
    setUserLoggedIn(isUserLoggedIn);
  }

  return (
    <ThemeProvider>
      <SafeAreaProvider style={{ backgroundColor: '#fff', flex: 1 }} >
        <PortalProvider>
          <UpdateAuthStateProvider value={updateAuthState}>
            <StatusBar />
            <NavigationContainer>
              {isUserLoggedIn === 'initializing' && <Initializing />}
              {isUserLoggedIn === 'loggedIn' && <Drawer />}
              {isUserLoggedIn === 'loggedOut' && <AuthStack updateAuthState={updateAuthState} />}
            </NavigationContainer>
          </UpdateAuthStateProvider>
        </PortalProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
