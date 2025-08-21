import axios from "axios";

const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SUPABASE_FUNCTIONS_BASE,
  withCredentials: false,
});

api.interceptors.request.use((config) => {
  config.headers = config.headers ?? {};
  config.headers["apikey"] = ANON;
  config.headers["Authorization"] = `Bearer ${ANON}`;
  return config;
});

export default api;