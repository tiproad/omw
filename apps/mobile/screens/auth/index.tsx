import React, { useState } from 'react';
import { createStackNavigator, HeaderBackButton } from '@react-navigation/stack';
import { CognitoUser } from 'amazon-cognito-identity-js';
import ConfirmSignIn from './ConfirmSignIn';
import ConfirmSignUp from './ConfirmSignUp';
import SignIn from './SignIn';
import SignUp from './SignUp';
import { AuthProvider } from '../../hooks/auth/Context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useTheme from '../../hooks/theme/useTheme';

type AuthenticationNavigatorProps = {
    updateAuthState: (state: string) => void;
};

export type RootStackParamList = {
    SignIn: undefined;
    SignUp: undefined;
    ConfirmSignUp: undefined;
    ConfirmSignIn: undefined;
};

const AuthenticationStack = createStackNavigator<RootStackParamList>();

const AuthenticationNavigator: React.FC<AuthenticationNavigatorProps> = ({ updateAuthState }) => {
    // CognitoUser needed in confirmSignUp function & confirmSignIn function
    const [cognitoUser, setCognitoUser] = useState<CognitoUser | undefined>();
    // Username needed in forgotpassword function
    const [username, setUsername] = useState<string | undefined>();
    const theme = useTheme();
    console.log("AN user: ", cognitoUser)
    return (
      <AuthProvider value={{ updateAuthState, cognitoUser, setCognitoUser, username, setUsername }}>
        <AuthenticationStack.Navigator
          headerMode="screen"
          initialRouteName="SignUp"
          screenOptions={{
            headerLeft: (props) => (
              <HeaderBackButton
                {...props}
                labelVisible={false}
                accessibilityLabel="button-back"
                backImage={() => (
                  <MaterialCommunityIcons
                    name="chevron-left"
                    size={25}
                    color={theme.colors.foreground}
                  />
                )}
              />
            ),
            headerTransparent: true,
            headerTitleStyle: {
              display: "none"
            }
          }}>
          <AuthenticationStack.Screen
            name="SignIn"
            options={{
              title: 'Sign In',
              headerBackAccessibilityLabel: 'button-back',
              headerShown: false 
            }}
            component={SignIn}
          />
          <AuthenticationStack.Screen
            name="SignUp"
            component={SignUp}
            options={{ title: 'Sign Up',
            headerShown: false 
          }}
          />
          <AuthenticationStack.Screen
            name="ConfirmSignUp"
            component={ConfirmSignUp}
            options={{ title: 'Confirm Sign Up'}}
          />
          <AuthenticationStack.Screen
            name="ConfirmSignIn"
            component={ConfirmSignIn}
            options={{ title: 'Confirm Sign In' }}
          />
        </AuthenticationStack.Navigator>
      </AuthProvider>
    );
  };
  
  export default AuthenticationNavigator;