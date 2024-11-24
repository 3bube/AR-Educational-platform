import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ToastAndroid,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Avatar, Button, Card, TextInput, Title, IconButton } from 'react-native-paper';
import { useAuth } from '../../context/auth';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../lib/supabase';

export default function Profile() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: user?.user_metadata?.name || '',
    email: user?.email || '',
    phone: user?.user_metadata?.phone || '',
    bio: user?.user_metadata?.bio || '',
  });

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          onPress: async () => {
            try {
              await signOut();
              ToastAndroid.show('Logged out successfully', ToastAndroid.SHORT);
              router.replace('/');
            } catch (error) {
              console.error('Error logging out:', error);
              ToastAndroid.show('Error logging out', ToastAndroid.SHORT);
            }
          },
          style: 'destructive'
        }
      ]
    );
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
        // Here you would typically upload the image to Supabase storage
        // and update the user's metadata with the new image URL
      }
    } catch (error) {
      console.error('Error picking image:', error);
      ToastAndroid.show('Error selecting image', ToastAndroid.SHORT);
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: form.fullName,
          phone: form.phone,
          bio: form.bio,
        }
      });

      if (error) throw error;

      ToastAndroid.show('Profile updated successfully', ToastAndroid.SHORT);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      ToastAndroid.show('Error updating profile', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  const renderProfileInfo = () => (
    <View style={styles.infoContainer}>
      <Text style={styles.label}>Full Name</Text>
      <Text style={styles.value}>{form.name ?? 'Not set'}</Text>

      <Text style={styles.label}>Email</Text>
      <Text style={styles.value}>{form.email}</Text>

      {/* <Text style={styles.label}>Phone</Text>
      <Text style={styles.value}>{form.phone ?? 'Not set'}</Text> */}

      {/* <Text style={styles.label}>Bio</Text>
      <Text style={styles.value}>{form.bio ?? 'No bio added'}</Text> */}
    </View>
  );

  const renderEditForm = () => (
    <View style={styles.formContainer}>
      <TextInput
        label="Full Name"
        value={form.fullName}
        onChangeText={(text) => setForm({ ...form, fullName: text })}
        style={styles.input}
        mode="outlined"
      />

      <TextInput
        label="Phone"
        value={form.phone}
        onChangeText={(text) => setForm({ ...form, phone: text })}
        style={styles.input}
        mode="outlined"
        keyboardType="phone-pad"
      />

      <TextInput
        label="Bio"
        value={form.bio}
        onChangeText={(text) => setForm({ ...form, bio: text })}
        style={[styles.input, styles.bioInput]}
        mode="outlined"
        multiline
        numberOfLines={4}
      />

      <View style={styles.buttonContainer}>
        <Button
          mode="outlined"
          onPress={() => setEditMode(false)}
          style={styles.button}
        >
          Cancel
        </Button>
        <Button
          mode="contained"
          onPress={handleUpdateProfile}
          loading={loading}
          style={styles.button}
        >
          Save Changes
        </Button>
      </View>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.profileCard}>
        <View style={styles.header}>
          <TouchableOpacity onPress={pickImage}>
            <Avatar.Image
              size={100}
              source={{ uri: profileImage ?? null }}
              style={styles.avatar}
            />
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        {editMode ? renderEditForm() : renderProfileInfo()}

        <View style={styles.actionButtons}>
          <Button
            mode={editMode ? "outlined" : "contained"}
            onPress={() => setEditMode(!editMode)}
            style={styles.editButton}
          >
            {editMode ? 'Cancel' : 'Edit Profile'}
          </Button>
          <Button
            mode="outlined"
            onPress={handleLogout}
            style={styles.logoutButton}
            textColor="#ff4444"
          >
            Logout
          </Button>
        </View>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  profileCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    backgroundColor: '#e1e1e1',
  },
  changePhotoText: {
    marginTop: 8,
    color: '#491B6D',
    textAlign: 'center',
  },
  infoContainer: {
    gap: 12,
  },
  formContainer: {
    gap: 16,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#fff',
  },
  bioInput: {
    height: 100,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  actionButtons: {
    marginTop: 24,
    gap: 12,
  },
  editButton: {
    backgroundColor: '#491B6D',
  },
  logoutButton: {
    borderColor: '#ff4444',
  },
});
