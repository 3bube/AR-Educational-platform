import { Stack } from "expo-router";
import { useAuth } from '../../context/auth';
import { useEffect } from "react";
import { useRouter } from "expo-router";

export default function AdminLayout() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/onboarding");
    }
  }, [user]);

  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#491B6D',
          
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontFamily: 'PoppinsBold',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "Admin Dashboard",
        }}
      />
      <Stack.Screen
        name="courses"
        options={{
          title: "Manage Courses",
        }}
      />
      <Stack.Screen
        name="quizzes"
        options={{
          title: "Manage Quizzes",
        }}
      />
      <Stack.Screen
        name="lessons"
        options={{
          title: "Manage Lessons",
        }}
      />
    </Stack>
  );
}
