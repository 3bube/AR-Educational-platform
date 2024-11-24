import { supabase } from "../utils/supabase.utils";

// save ar model to the database
const createARModel = async (arModel) => {
  if (!arModel) throw new Error("AR Model object is required");

  const { data, error } = await supabase.from("ar_models").insert([arModel]);

  if (error) throw error;

  return data;
};

// get all ar models from the database
const getARModels = async () => {
  const { data, error } = await supabase.from("ar_models").select("*");

  if (error) throw error;

  return data;
};

export { createARModel, getARModels };
