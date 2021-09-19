import React, { useState } from 'react';
import { View, Text, Image } from 'react-native';
import { Auth } from 'aws-amplify';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '../../components/Button';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '.';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import FormInput, { FormInputProps } from '../../components/FormInput';
import styles from './styles';
import { sanitizeCognitoErrorMessage } from './utils';
import { testProperties } from '../../utils/TestProperties';
import useAuth from '../../hooks/auth/useAuth';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import useTheme from '../../hooks/theme/useTheme';

interface FormData {
  code: string;
}

const schema = yup.object().shape({
  code: yup.string().required('Please enter the code we sent to your phone.'),
});

interface ConfirmSignUpProps {
  navigation: StackNavigationProp<RootStackParamList, 'ConfirmSignUp'>;
  route: RouteProp<RootStackParamList, 'ConfirmSignUp'>;
}

const ConfirmSignUp: React.FC<ConfirmSignUpProps> = ({ navigation }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });
  const { cognitoUser } = useAuth();
  const [cognitoError, setCognitoError] = useState<{
    code: string;
    message: string;
    name: string;
  } | null>(null);

  const onSubmit = async (data: FormData) => {
    console.log(cognitoUser)
    if (cognitoUser)
      await Auth.confirmSignUp(cognitoUser.getUsername(), data.code)
        .then(() => {
          setCognitoError(null);
          navigation.navigate('SignIn');
        })
        .catch(setCognitoError);
    else throw Error('Cognito user is undefined');
  };

  const formInput: FormInputProps & React.RefAttributes<any> = {
    label: 'Verification Code',
    leftIcon: 'numeric',
    control,
    error: errors.code?.message,
    name: 'code',
    textInputProps: {
      placeholder: 'Enter verification code',
      autoCapitalize: 'none',
      keyboardType: 'numeric',
      textContentType: 'oneTimeCode',
      returnKeyType: 'done',
      onSubmitEditing: handleSubmit(onSubmit),
    },
  };

  const theme = useTheme();

  return (
    <KeyboardAwareScrollView enableOnAndroid={true} extraScrollHeight={5} style={{backgroundColor: '#fff',}} contentContainerStyle={{justifyContent: 'center', flexGrow: 1}}>
      <View style={styles.container}>
        <Text style={{...styles.title, color: theme.colors.primary, fontSize: 24, fontWeight: "700"}}>Verify your phone number.</Text>
        <Text style={{...styles.title, color: theme.colors.darkGrey, fontSize: 16, fontWeight: "400"}}>Please enter the verification code sent to {cognitoUser.getUsername()}</Text>

        {cognitoError && (
          <Text style={styles.cognitoError}>
            {sanitizeCognitoErrorMessage(cognitoError.message)}
          </Text>
        )}
        <FormInput {...formInput} />
        <Button
          color="primary"
          fill="solid"
          size="large"
          testProps={testProperties('button-confirm-sign-up')}
          title="Verify"
          onPress={handleSubmit(onSubmit)}
          isLoading={isSubmitting}
        />
      </View>
    </KeyboardAwareScrollView>
  );
};

export default ConfirmSignUp;
