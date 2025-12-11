import { createClient } from "@supabase/supabase-js"

// Usar específicamente las variables proporcionadas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL es requerido. Por favor, verifica tus variables de entorno.")
}

if (!supabaseKey) {
  throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY es requerido. Por favor, verifica tus variables de entorno.")
}

export const supabase = createClient(supabaseUrl, supabaseKey)
