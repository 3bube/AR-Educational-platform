import { supabase } from "../utils/supabase.utils";

// save user answers to the database
const createUserAnswers = async (userAnswers) => {
  if (!userAnswers) throw new Error("User Answers object is required");

  const { data, error } = await supabase
    .from("user_answers")
    .insert([userAnswers]);

  if (error) throw error;

  return data;
};

// get all user answers from the database
const getUserAnswers = async () => {
  const { data, error } = await supabase.from("user_answers").select("*");

  if (error) throw error;

  return data;
};

export { createUserAnswers, getUserAnswers };
