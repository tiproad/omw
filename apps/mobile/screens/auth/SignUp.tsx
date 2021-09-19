import React, { useRef } from 'react';
import { View, Text, TextInput as RNTextInput, Image } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Auth } from 'aws-amplify';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '.';
import styles from './styles';
import FormInput, { FormInputProps } from '../../components/FormInput';
import Button from '../../components/Button';
import { useState } from 'react';
import { getRandomString, sanitizeCognitoErrorMessage } from './utils';
import { testProperties } from '../../utils/TestProperties';
import useAuth from '../../hooks/auth/useAuth';
import useTheme from '../../hooks/theme/useTheme';

interface FormData {
  phoneNumber: string;
  }

const phoneRegExp =
  /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/;

const schema = yup.object().shape({
  phoneNumber: yup
    .string()
    .required('Required')
    .matches(phoneRegExp, 'Phone number must be formatted +16475238795'),
});

interface SignUpProps {
  navigation: StackNavigationProp<RootStackParamList, 'SignUp'>;
  route: RouteProp<RootStackParamList, 'SignUp'>;
}

const SignUp: React.FC<SignUpProps> = ({ navigation }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({ resolver: yupResolver(schema) });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setCognitoUser, cognitoUser } = useAuth();
  const ref_phoneNumber = useRef<RNTextInput>(null);
  const [cognitoError, setCognitoError] = useState<{
    code: string;
    message: string;
    name: string;
  } | null>(null);

  const theme = useTheme();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    const params = new URLSearchParams({ phone_number: encodeURIComponent(data.phoneNumber) });
    // This checks if a user abandoned signup with this phone number, and deletes the abandoned record if it exists
    await fetch(
      `https://0xny7s40fh.execute-api.us-east-2.amazonaws.com/stage/preSignUp?${params.toString()}`,
    );
    await Auth.signUp({
      username: data.phoneNumber,
      password: getRandomString(30),
      attributes: {
        phone_number: data.phoneNumber,
      },
    })
      .then((res) => {
        console.log(res)
        setCognitoUser(res.user);
        setCognitoError(null);
        console.log('✅ Sign-up Confirmed');
        navigation.navigate('ConfirmSignUp');
      })
      .catch(setCognitoError);
    setIsSubmitting(false);
  };

  const formInputs: Array<FormInputProps & React.RefAttributes<any>> = [
    {
      label: 'Phone number',
      leftIcon: 'phone',
      control,
      error: errors.phoneNumber?.message,
      name: 'phoneNumber',
      ref: ref_phoneNumber,
      phone: true,
      textInputProps: {
        placeholder: 'Enter mobile',
        autoCapitalize: 'none',
        keyboardType: 'phone-pad',
        textContentType: 'telephoneNumber',
        returnKeyType: 'next',
        onSubmitEditing: handleSubmit(onSubmit),
      },
    },
  ];

  return (
    <KeyboardAwareScrollView enableOnAndroid={true} extraScrollHeight={5} style={{backgroundColor: '#fff',}} contentContainerStyle={{justifyContent: 'center', flexGrow: 1}}>
      <View style={styles.container}>
        <Text style={{...styles.title, color: theme.colors.primary, fontSize: 36, fontWeight: "700"}}>Sign Up</Text>
        <Text style={{...styles.title, color: theme.colors.darkGrey, fontSize: 16, fontWeight: "400"}}>let's get there together</Text>
        {cognitoError && (
          <Text style={styles.cognitoError}>
            {sanitizeCognitoErrorMessage(cognitoError.message)}
          </Text>
        )}
        {formInputs.map((formInput, key) => (
          <FormInput key={key} {...formInput} />
        ))}
        <Button
          testProps={testProperties('button-sign-up')}
          color="primary"
          fill="solid"
          size="large"
          title="Next"
          onPress={handleSubmit(onSubmit)}
          isLoading={isSubmitting}
        />
        <View style={styles.forgotPasswordButtonContainer}>
          <Button
            testProps={testProperties('button-forgot-password')}
            color="primary"
            fill="clear"
            size="small"
            title="Already have an account? Sign in."
            uppercase={false}
            onPress={() => navigation.navigate('SignIn')}
          />
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default SignUp;
