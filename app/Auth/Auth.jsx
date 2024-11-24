import { View, Text, TextInput, Image, ToastAndroid, TouchableOpacity, StyleSheet, Dimensions, Pressable } from 'react-native';
import React, { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import { useRouter } from 'expo-router';
import { signUp, signin, createDbUser } from '../../api/auth.api';

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const router = useRouter();

  const validatePassword = (pass) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(pass);
    const hasLowerCase = /[a-z]/.test(pass);
    const hasNumber = /\d/.test(pass);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pass);

    if (pass.length < minLength) {
      setPasswordError('Password must be at least 8 characters long');
      return false;
    }
    if (!hasUpperCase || !hasLowerCase) {
      setPasswordError('Password must contain both uppercase and lowercase letters');
      return false;
    }
    if (!hasNumber) {
      setPasswordError('Password must contain at least one number');
      return false;
    }
    if (!hasSpecialChar) {
      setPasswordError('Password must contain at least one special character');
      return false;
    }
    
    setPasswordError('');
    return true;
  };

  const signUpToast = () =>{
    ToastAndroid.show("Account Created!", ToastAndroid.SHORT)
  }

  const handleSubmit = async () => {
    if (!validatePassword(password)) {
      return;
    }

    try {
      setIsLoading(true);
      if (isSignUp) {
        if (password !== confirmPassword) {
          setPasswordError("Passwords don't match");
          return;
        }
        const user = await signUp(email, password, name);
        await createDbUser(user);
        signUpToast();
        setIsSignUp(false);
      } else {
        await signin(email, password);
      }
    } catch (error) {
      console.error('Auth error:', error);
      ToastAndroid.show(error.message, ToastAndroid.SHORT);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    // Clear form fields when switching modes
    if (!isSignUp) {
      setName('');
      setConfirmPassword('');
    }
  };

  return (
    <View style={styles.container}>
      
      <View style={{  height: '100%' }}>
        <View style={{ alignItems: 'center' }}>
        <Image 
          style={styles.image} 
          source={require('../../assets/images/designwithdesigners-4 1.png')}
          resizeMode="contain"
        />
          
        <Text style={[{marginTop: -50}, styles.title]}>{isSignUp ? 'Create An Account' : 'Login to continue'}</Text>
        </View>
      
      <View style={{  justifyContent: 'center',  }}>

        {isSignUp && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your name"
              value={name}
              onChangeText={setName}
              autoCapitalize="none"
            />
          </View>
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Enter your password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (isSignUp) validatePassword(text);
              }}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity 
              style={styles.eyeIcon} 
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
            </TouchableOpacity>
          </View>
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        </View>

        {isSignUp && (
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirm Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />
              <TouchableOpacity 
                style={styles.eyeIcon} 
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Text>{showConfirmPassword ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      
        <TouchableOpacity 
          style={styles.button} 
          onPress={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>{isSignUp ? 'SIGN UP' : 'SIGN IN'}</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.link}>
          {isSignUp ? "Don't have an account? " : 'Have an account already? '}
          <Text style={styles.linkTouchable} onPress={toggleAuthMode}>
            {isSignUp ? 'Log in' : 'Sign up now'}
          </Text>
        </Text>
      </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    marginBottom: 30,
    textAlign: 'center',
    color: '#491B6D',
    fontFamily: 'PoppinsBold', 
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 17,
    color: '#491B6D',
    marginBottom: 8,
    fontFamily: 'PoppinsSemiBold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    borderColor: '#491B6D',
    borderWidth: 1,
    borderStyle: "solid",
  },
  button: {
    backgroundColor: '#491B6D',
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 17,
    fontFamily: 'PoppinsSemiBold',
  },
  link: {
    textAlign: 'center',
    fontSize: 17,
    fontFamily: 'PoppinsSemiBold',
    marginTop: 20,
  },
  image: {
    width: Dimensions.get("window").width - 40,
    height: 120,
    alignSelf: 'center',
    marginBottom: 50,
  },
  linkTouchable: {
    color: '#491B6D',
    fontFamily: 'PoppinsSemiBold',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    height: '100%',
    justifyContent: 'center',
  },
  errorText: {
    color: '#FF0000',
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'Poppins',
  },
});
