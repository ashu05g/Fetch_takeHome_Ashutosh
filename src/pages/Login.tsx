import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import dogLoverIllustration from '../assets/3d-rendering-visual-impairment-character.png';

const Login = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await login(name, email);
            toast.success('Welcome to DogFinder! 🐾');
            navigate('search');
        } catch (error) {
            toast.error('Login failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen gradient-background flex items-center justify-center p-8">
            <div className="flex items-center justify-center max-w-6xl ">
                {/* Left side - Form */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-[35%]"
                >
                    <div className="login-card">
                        <div className="mb-8">
                            <div className="flex items-center justify-center gap-2 mb-2" style={{ marginBottom: "1rem" }}>
                                <span role="img" aria-label="paw" className="text-2xl" style={{ fontSize: "2rem" }}>🐾</span>
                                <h2 className="text-xl font-semibold text-purple-600" style={{fontSize: "2rem" , fontFamily: "'Borel', cursive", paddingTop: "1rem", textShadow: "1px 0 currentColor, -1px 0 currentColor",marginBottom: "1rem" }}>DogFinder</h2>
                            </div>
                            {/* <h1 className="flex items-center justify-center text-3xl font-bold text-gray-900 mb-1">Welcome back!</h1> */}
                            <p className="flex items-center justify-center text-gray-500" style={{ fontFamily: "'Poppins', sans-serif", fontSize: "1rem" }}>Find your perfect furry friend today</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5 ">
                            <div className="form-group flex items-center justify-center">
                                <label htmlFor="name" className="form-label">
                                    
                                </label>
                                <motion.input
                                    whileFocus={{ scale: 1.01 }}
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="input-primary"
                                    placeholder="Enter your name"
                                />
                            </div>
                            <br/>
                            <div className="form-group flex items-center justify-center">
                                <label htmlFor="email" className="form-label">
                                    
                                </label>
                                <motion.input
                                    whileFocus={{ scale: 1.01 }}
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="input-primary"
                                    placeholder="Enter your email"
                                />
                            </div>
                            <br/>
                            <div className="flex items-center justify-center">
                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    type="submit"
                                    disabled={isLoading}
                                    className={`btn-primary ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {isLoading ? 'Logging in...' : 'Get Started'}
                                </motion.button>
                            </div>
                            

                            <div className="text-center text-sm text-gray-500" style={{ fontFamily: "'Poppins', sans-serif", fontSize: "0.8rem" }}>
                                <p>By continuing, you agree to help find forever homes for our furry friends!</p>
                            </div>
                        </form>
                    </div>
                </motion.div>

                {/* Right side - Illustration */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="w-[35%]"
                >
                    <div className="illustration-container">
                        <img 
                            src={dogLoverIllustration}
                            alt="Person sitting with laptop and cactus illustration"
                            className="w-[80%] h-auto"
                        />
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Login; 