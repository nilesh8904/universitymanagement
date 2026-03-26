import { createContext, useContext, useState, ReactNode } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {

  // ✅ Safe localStorage parsing
  const [user, setUser] = useState<User | null>(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;

      // Ensure valid user with role
      if (parsedUser && parsedUser.role) {
        return parsedUser;
      }

      return null;
    } catch (error) {
      console.error('Invalid user data in localStorage');
      return null;
    }
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Login function
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('🔐 AuthContext: Calling authService.login');
      const userData = await authService.login({ email, password });
      console.log('🔐 AuthContext: Received userData:', userData);

      // Validate response
      if (!userData || !userData.role) {
        console.log('🔐 AuthContext: Invalid user data - no userData or no role');
        throw new Error('Invalid user data');
      }

      console.log('🔐 AuthContext: Setting user and localStorage');
      setUser(userData);

      // ✅ Store in localStorage
      localStorage.setItem('user', JSON.stringify(userData));

      return true;
    } catch (err: any) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Login failed. Please check your credentials.';
      console.log('🔐 AuthContext: Login failed with error:', errorMessage);
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Logout function
  const logout = () => {
    setUser(null);
    setError(null);

    // ✅ Remove from localStorage
    localStorage.removeItem('user');

    authService.logout();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ✅ Custom hook
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}