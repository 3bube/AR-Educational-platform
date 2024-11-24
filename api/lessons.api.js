import { supabase } from '../lib/supabase';

export const createLesson = async (lesson) => {
  if (!lesson) throw new Error("Lesson object is required");
  if (!lesson.course_id) throw new Error("Course ID is required");

  try {
    const { data, error } = await supabase
      .from("lessons")
      .insert([lesson])
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error creating lesson:', error);
    throw error;
  }
};

export const getLessons = async (courseId) => {
  if (!courseId) throw new Error("Course ID is required");

  try {
    const { data, error } = await supabase
      .from("lessons")
      .select("*")
      .eq('course_id', courseId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching lessons:', error);
    throw error;
  }
};

export const getLesson = async (id) => {
  if (!id) throw new Error("Lesson ID is required");

  try {
    const { data, error } = await supabase
      .from("lessons")
      .select("*, courses!inner(*)")
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching lesson:', error);
    throw error;
  }
};

export const updateLesson = async (id, lesson) => {
  if (!id) throw new Error("Lesson ID is required");
  if (!lesson) throw new Error("Lesson object is required");

  try {
    const { data, error } = await supabase
      .from("lessons")
      .update({
        title: lesson.title,
        content: lesson.content,
        duration: lesson.duration,
        video_url: lesson.video_url,
        updated_at: new Date(),
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error('Error updating lesson:', error);
    throw error;
  }
};

export const deleteLesson = async (id) => {
  if (!id) throw new Error("Lesson ID is required");

  try {
    const { error } = await supabase
      .from("lessons")
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting lesson:', error);
    throw error;
  }
};
