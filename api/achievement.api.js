import { supabase } from "../utils/supabase.utils";

// save achievement to the database
const saveAchievement = async (achievement) => {
  if (!achievement) throw new Error("Achievement object is required");

  const { data, error } = await supabase
    .from("achievements")
    .insert([achievement]);

  if (error) throw error;

  return data;
};

// get all achievements from the database
const getAchievements = async () => {
  const { data, error } = await supabase.from("achievements").select("*");

  if (error) throw error;

  return data;
};

export { saveAchievement, getAchievements };
