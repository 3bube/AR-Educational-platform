import { supabase } from "../utils/supabase.utils";

// save user progress to the database
const createUserProgress = async (userProgress) => {
  if (!userProgress) throw new Error("User Progress object is required");

  const { data, error } = await supabase
    .from("user_progress")
    .insert([userProgress]);

  if (error) throw error;

  return data;
};

// get all user progress from the database
const getUserProgress = async () => {
  const { data, error } = await supabase.from("user_progress").select("*");

  if (error) throw error;

  return data;
};

export { createUserProgress, getUserProgress };
