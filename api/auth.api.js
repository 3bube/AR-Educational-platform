import { supabase } from "../lib/supabase";

const signUp = async (email, password, name) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });
  if (error) throw error;

  return data;
};

const createDbUser = async (userData) => {
  if (!userData?.user) throw new Error('No user data provided');
  
  const { data, error } = await supabase
    .from("users")
    .insert([{
      id: userData.user.id,
      email: userData.user.email,
      name: userData.user.user_metadata.name,
      created_at: new Date(),
    }]);

  if (error) throw error;
  return data;
};

const signin = async (email, password) => {
  const { data: { user, session }, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return { user, session };
};

export { signUp, signin, createDbUser };
