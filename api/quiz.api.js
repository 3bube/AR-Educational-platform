import { supabase } from "../utils/supabase.utils";

// upload a quiz to the database
const createQuiz = async (quiz) => {
  if (!quiz) throw new Error("Quiz object is required");

  const { data, error } = await supabase.from("quizzes").insert([quiz]);

  if (error) throw error;

  return data;
};

// get all quizzes from the database
const getQuizzes = async () => {
  const { data, error } = await supabase.from("quizzes").select("*");

  if (error) throw error;

  return data;
};

export { createQuiz, getQuizzes };
