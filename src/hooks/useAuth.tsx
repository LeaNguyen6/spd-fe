import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { authApi, tokenManager, type User, type LoginRequest } from '@/services/authApi';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (credentials: LoginRequest) => Promise<void>;
    logout: () => void;
    refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const isAuthenticated = !!user && tokenManager.isAuthenticated();

    // Initialize auth state on mount
    useEffect(() => {
        const initAuth = async () => {
            const token = tokenManager.getToken();
            if (token) {
                try {
                    const userData = await authApi.getProfile();
                    setUser(userData);
                    // Update localStorage with current role for compatibility
                    localStorage.setItem('userRole', userData.role);
                } catch (error) {
                    // Token is invalid, clear it
                    tokenManager.removeToken();
                    console.error('Failed to get user profile:', error);
                }
            }
            setIsLoading(false);
        };

        initAuth();
    }, []);

    const login = async (credentials: LoginRequest) => {
        try {
            setIsLoading(true);
            const response = await authApi.login(credentials);

            // Store token and user data
            tokenManager.setToken(response.token);
            setUser(response.user);
            localStorage.setItem('userRole', response.user.role);

            toast({
                title: 'Login Successful',
                description: `Welcome back, ${response.user.name}!`,
            });

            navigate('/dashboard');
        } catch (error: unknown) {
            const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Login failed';
            toast({
                title: 'Login Failed',
                description: errorMessage,
                variant: 'destructive',
            });
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        try {
            authApi.logout().catch(console.error); // Don't block logout on API failure
        } finally {
            tokenManager.removeToken();
            setUser(null);
            navigate('/');
            toast({
                title: 'Logged Out',
                description: 'You have been successfully logged out.',
            });
        }
    };

    const refreshToken = async () => {
        try {
            const response = await authApi.refreshToken();
            tokenManager.setToken(response.token);
        } catch (error) {
            console.error('Token refresh failed:', error);
            logout();
        }
    };

    const value: AuthContextType = {
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        refreshToken,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};