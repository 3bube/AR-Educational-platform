import Constants from 'expo-constants';
import { supabase } from '../lib/supabase';

const RAPID_API_KEY = Constants.expoConfig.extra.RAPID_API_KEY;

export const getCourse = async (query = 'javascript') => {
  const url = `https://udemy-paid-courses-for-free-api.p.rapidapi.com/rapidapi/courses/search?page=1&page_size=10&query=${query}&page=1&page_size=10`;
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': RAPID_API_KEY,
      'X-RapidAPI-Host': 'udemy-paid-courses-for-free-api.p.rapidapi.com',
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

export const saveCourse = async (courseData) => {
  try {
    if (courseData.id) {
      // Update existing course
      const { data, error } = await supabase
        .from('courses')
        .update({
          title: courseData.title,
          description: courseData.description,
          duration: courseData.duration,
          category: courseData.category,
          thumbnail: courseData.thumbnail,
          updated_at: new Date(),
        })
        .eq('id', courseData.id)
        .select();

      if (error) throw error;
      return data[0];
    } else {
      // Create new course
      const { data, error } = await supabase
        .from('courses')
        .insert([{
          title: courseData.title,
          description: courseData.description,
          duration: courseData.duration,
          category: courseData.category,
          thumbnail_url: courseData.thumbnail,
          created_at: new Date(),
        }])
        .select();

      if (error) throw error;
      return data[0];
    }
  } catch (error) {
    console.error('Error saving course:', error);
    throw error;
  }
};

export const fetchCourses = async () => {
  try {
    const { data, error } = await supabase.from('courses').select('*');
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
};

export const fetchCourse = async (id, userId) => {
  try {
    // Fetch course details
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('*')
      .eq('id', id)
      .single();

    if (courseError) throw courseError;

    // Check enrollment only if userId is provided
    if (userId) {
      const { data: enrollmentData, error: enrollmentError } = await supabase
        .from('enrollments')
        .select('*')
        .eq('course_id', id)
        .eq('user_id', userId)
        .single();

      if (enrollmentError && enrollmentError.code !== 'PGRST116') {
        // PGRST116 means no rows returned, which is fine
        throw enrollmentError;
      }

      return {
        course,
        enrollment: !!enrollmentData
      };
    }

    // If no userId, return course without enrollment check
    return {
      course,
      enrollment: false
    };
  } catch (error) {
    console.error('Error fetching course:', error);
    throw error;
  }
};

export const deleteCourse = async (id) => {
  try {
    const { error } = await supabase.from('courses').delete().eq('id', id);
    if (error) throw new Error("Error deleting course", error);
    return true;
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error;
  }
};

export const enrollUser = async (userId, courseId) => {
  try {
    const { data, error } = await supabase.from('enrollments').insert([{
      user_id: userId,
      course_id: courseId,
      enrollment_date: new Date(),
    }]);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error enrolling user:', error);
    throw error;
  }
};