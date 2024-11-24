import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Searchbar, useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

export default function SearchBarComponent() {
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();

  const onChangeSearch = query => {
    setSearchQuery(query);
    // Add your search logic here
  };

  // handle clear button
  const handleClear = () => {
    setSearchQuery('');
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search for lessons, topics..."
        onChangeText={onChangeSearch}
        value={searchQuery}
        icon={() => <Ionicons name="search-outline" size={30} color={theme.colors.primary} />}
        clearIcon={() => (
          searchQuery ? 
            <Ionicons name="close-outline" size={30} color={theme.colors.primary} onPress={handleClear} /> 
            : null
        )}
        clearButtonMode="always"
        onIconPress={() => setSearchQuery('')}
        style={styles.searchBar}
        inputStyle={styles.input}
        placeholderTextColor={theme.colors.outline}
        iconColor={theme.colors.primary}
        elevation={0}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchBar: {
    borderRadius: 20,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#491B6D',
  },
  input: {
    fontSize: 14,
    fontFamily: 'Poppins',
  },
});