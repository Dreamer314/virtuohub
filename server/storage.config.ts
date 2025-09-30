import { storage as memStorage } from "./storage";
import { SupabaseStorage } from "./supabaseStorage";

// Feature flag for Supabase storage
const useSupabaseStorage = process.env.USE_SUPABASE_STORAGE === 'true';
console.log(`[STORAGE] Using ${useSupabaseStorage ? 'SupabaseStorage' : 'MemStorage'}`);
export const storage = useSupabaseStorage ? new SupabaseStorage() : memStorage;
