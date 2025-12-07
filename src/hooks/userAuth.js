import { useAuthContext } from "@/providers/AuthProvider";

export const useAuth = () => {
  const { user, loading, login, logout, register} = useAuthContext();
  // Get instructor by ID
 
  return { user, loading, login, logout, register };
};