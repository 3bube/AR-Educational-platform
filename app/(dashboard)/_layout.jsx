import { Tabs } from "expo-router";
import { Avatar } from "react-native-paper";
import { useAuth } from '../../context/auth';
import { Image } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';

export default function DashboardLayout() {
  const { user } = useAuth();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerShadowVisible: false,
        title: "",
        headerBackVisible: false,
        headerStyle: {
          height: 90,
        },
        headerLeftContainerStyle: {
          paddingLeft: 16,
        },
        headerRightContainerStyle: {
          paddingRight: 16,
        },
        headerLeft: () => (
          <Image source={require('./../../assets/icons/hamburger-menu.png')} />
        ),
        headerRight: () => (
          <Avatar.Text 
            size={40} 
            label={user?.user_metadata?.name ? user?.user_metadata.name[0].toUpperCase() : ''} 
          />
        ),
        tabBarActiveTintColor: '#491B6D',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          height: 80,
          paddingBottom: 10,
          paddingTop: 10,
          elevation: 0,
          shadowOpacity: 0,
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontSize: 15,
          fontFamily: 'Poppins',
          paddingBottom: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="home" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="courses"
        options={{
          tabBarLabel: 'Courses',
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="school" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <Avatar.Text 
              size={30} 
              label={user?.user_metadata?.name ? user?.user_metadata.name[0].toUpperCase() : ''} 
            />
          ),
        }}
      />
    </Tabs>
  );
}
