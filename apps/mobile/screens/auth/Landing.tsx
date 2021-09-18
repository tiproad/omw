import React from 'react';
import { View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { testProperties } from '../../utils/TestProperties';
import Button from '../../components/Button';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import { RootStackParamList } from ".";

interface LandingProps {
  navigation: StackNavigationProp<RootStackParamList, 'Landing'>;
  route: RouteProp<RootStackParamList, 'Landing'>;
}

const Landing: React.FC<LandingProps> = ({ navigation }) => {
  return (
    <LinearGradient
      style={{
        display: 'flex',
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
        paddingHorizontal: 20,
      }}
      colors={['#D1F7FF', '#17D5FF']}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '80%',
          alignContent: 'center',
          justifyContent: 'center',
        }}>
        <Button
          color="primary"
          fill="solid"
          size="large"
          testProps={testProperties('button-navigate-sign-in')}
          title="Sign In"
          onPress={() => navigation.navigate('SignIn')}
        />
        <View style={{ height: 20 }} />
        <Button
          color="secondary"
          fill="solid"
          size="large"
          testProps={testProperties('button-navigate-sign-up')}
          title="Sign Up"
          onPress={() => navigation.navigate('SignUp')}
        />
      </View>
    </LinearGradient>
  );
};

export default Landing;
