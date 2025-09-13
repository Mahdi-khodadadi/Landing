// src/services/supabaseService.js
import { supabase } from "../supabaseClient";

const BUCKET = "uploads"; // اسم bucket که ساختی

// Auth
export const signUp = async (email, password, metadata = {}) => {
  return supabase.auth.signUp({ email, password }, { data: metadata });
};

export const signIn = async (email, password) => {
  return supabase.auth.signInWithPassword({ email, password });
};

export const signOut = async () => {
  return supabase.auth.signOut();
};

export const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser();
  return data?.user || null;
};

// Storage: upload file into a folder per user (use email as folder)
export const uploadFile = async (email, file) => {
  const fileName = `${Date.now()}_${file.name}`;
  const path = `${email}/${fileName}`;
  const { error, data } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { upsert: false });

  if (error) throw error;
  return data; // contains path, etc
};

// List files in user's folder
export const listFiles = async (email, options = { limit: 100, offset: 0 }) => {
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .list(email, { limit: options.limit, offset: options.offset, sortBy: { column: "name", order: "desc" } });
  if (error) throw error;
  // map to consistent shape
  return data.map(d => ({
    filename: d.name,
    path: `${email}/${d.name}`,
    size: d.size,
    updated_at: d.last_modified,
  }));
};

// Create signed URL (valid for seconds)
export const createSignedUrl = async (path, expiresIn = 60) => {
  const { data, error } = await supabase.storage.from(BUCKET).createSignedUrl(path, expiresIn);
  if (error) throw error;
  return data.signedUrl;
};

// Remove file(s)
export const deleteFile = async (path) => {
  const { error, data } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) throw error;
  return data;
};
