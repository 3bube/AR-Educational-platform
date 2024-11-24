import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { AuthProvider } from "../context/auth";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

SplashScreen.preventAutoHideAsync();

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#491B6D',
    secondary: '#6B2E98',
  },
  fonts: {
    ...MD3LightTheme.fonts,
    regular: {
      fontFamily: 'Poppins',
    },
    medium: {
      fontFamily: 'PoppinsSemiBold',
    },
    bold: {
      fontFamily: 'PoppinsBold',
    },
  },
};

const queryClient = new QueryClient();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Poppins': require('../assets/fonts/Poppins-Regular.ttf'),
    'PoppinsSemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
    'PoppinsBold': require('../assets/fonts/Poppins-Bold.ttf'),
  });

  useEffect(() => {
    const loadApp = async () => {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    };

    loadApp();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PaperProvider theme={theme}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen 
              name="index" 
              options={{ 
                headerShown: true,
                headerTitle: "",
                headerShadowVisible: false,
              }} 
            />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen 
              name="(dashboard)" 
              options={{ 
                headerShown: false,
              }}
            />
          </Stack>
        </PaperProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
