import React, { useState } from 'react';
import { View, Text, TextInput as RNTextInput, Image } from 'react-native';
import { Auth } from 'aws-amplify';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '.';
import { useRef } from 'react';
import styles from './styles';
import FormInput, { FormInputProps } from '../../components/FormInput';
import { sanitizeCognitoErrorMessage } from './utils';
import { testProperties } from '../../utils/TestProperties';
import useAuth from '../../hooks/auth/useAuth';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import useTheme from '../../hooks/theme/useTheme';

interface FormData {
  phoneNumber: string;
  password: string;
}

const phoneRegExp =
  /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/;

const schema = yup.object().shape({
  phoneNumber: yup
    .string()
    .required('Required')
    .matches(phoneRegExp, 'Phone number must be formatted +16475238795'),
});

interface SignInProps {
  navigation: StackNavigationProp<RootStackParamList, 'SignIn'>;
  route: RouteProp<RootStackParamList, 'SignIn'>;
}

// TODO Mask phone # input
const SignIn: React.FC<SignInProps> = ({ navigation }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  const { setCognitoUser } = useAuth();
  const ref_password = useRef<RNTextInput>(null);
  const [cognitoError, setCognitoError] = useState<{
    code: string;
    message: string;
    name: string;
  } | null>(null);

  const onSubmit = async (data: FormData) => {
    await Auth.signIn(data.phoneNumber)
      .then((res) => {
        console.log(res)
        setCognitoUser(res);
        setCognitoError(null);
        navigation.navigate('ConfirmSignIn');
      })
      .catch(setCognitoError);
  };

  const formInputs: Array<FormInputProps & React.RefAttributes<any>> = [
    {
      label: 'Phone number',
      leftIcon: 'phone',
      control,
      error: errors.phoneNumber?.message,
      name: 'phoneNumber',
      phone: true,
      textInputProps: {
        ...testProperties('input-phone-number'),
        placeholder: 'Enter mobile',
        autoCapitalize: 'none',
        keyboardType: 'phone-pad',
        textContentType: 'telephoneNumber',
        returnKeyType: 'next',
        onSubmitEditing: handleSubmit(onSubmit),
      },
    },
  ];

  const theme = useTheme();

  return (
    <KeyboardAwareScrollView enableOnAndroid={true} extraScrollHeight={5} style={{backgroundColor: '#fff',}} contentContainerStyle={{justifyContent: 'center', flexGrow: 1}}>
      <View style={styles.container}>
        <Text style={{...styles.title, color: theme.colors.primary, fontSize: 36, fontWeight: "700"}}>Log In</Text>
        <Text style={{...styles.title, color: theme.colors.darkGrey, fontSize: 16, fontWeight: "400"}}>let's get there together</Text>
        {cognitoError && (
          <Text style={styles.cognitoError}>
            {sanitizeCognitoErrorMessage(cognitoError.message)}
          </Text>
        )}
        {formInputs.map((formInput, key) => (
          <FormInput key={key} {...formInput} />
        ))}
        <View style={styles.submitButtonContainer}>
          <Button
            testProps={testProperties('button-sign-in')}
            color="primary"
            fill="solid"
            size="large"
            title="Sign In"
            onPress={handleSubmit(onSubmit)}
            isLoading={isSubmitting}
          />
        </View>
        <View style={styles.forgotPasswordButtonContainer}>
          <Button
            testProps={testProperties('button-forgot-password')}
            color="primary"
            fill="clear"
            size="small"
            title="Don't have an account? Sign up."
            uppercase={false}
            onPress={() => navigation.navigate('SignUp')}
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default SignIn;
