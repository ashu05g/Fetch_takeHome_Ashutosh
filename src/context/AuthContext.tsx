import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import { api } from '../services/api';

interface User {
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    login: (name: string, email: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    const login = async (name: string, email: string) => {
        await api.login(name, email);
        setUser({ name, email });
    };

    const logout = async () => {
        await api.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 