import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Search from './pages/Search';
import MapTest from './pages/MapTest';

const queryClient = new QueryClient();

// const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
//     const { isAuthenticated } = useAuth();
//     return isAuthenticated ? <>{children}</> : <Navigate to="/" />;
// };

const App = () => {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <Router>
                    <Routes>
                        <Route path="Fetch_takeHome_Ashutosh/" element={<Login />} />
                        <Route path="Fetch_takeHome_Ashutosh/search" element={<Search />} />
                        <Route path="Fetch_takeHome_Ashutosh/map-test" element={<MapTest />} />
                        {/* Add more routes here as we create them */}
                    </Routes>
                </Router>
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 3000,
                        style: {
                            background: '#363636',
                            color: '#fff',
                        },
                        success: {
                            iconTheme: {
                                primary: '#4ade80',
                                secondary: '#fff',
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: '#ef4444',
                                secondary: '#fff',
                            },
                        },
                    }}
                />
            </AuthProvider>
        </QueryClientProvider>
    );
};

export default App;
