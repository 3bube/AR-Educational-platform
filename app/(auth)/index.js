import { View, SafeAreaView } from 'react-native'
import React from 'react'
import Auth from '../../app/Auth/Auth.jsx';

export default function Index() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <Auth />
      </View>
    </SafeAreaView>
  );
}