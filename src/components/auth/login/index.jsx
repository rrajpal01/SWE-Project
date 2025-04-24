import React, { useState } from 'react';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { doSignInWithEmailAndPassword } from '../../../firebase/auth';
import { useAuth } from '../../../contexts/authContext';
import gator from '../../../assets/gator.png';
import "./LoginPage.css";

const Login = () => {
    const { userLoggedIn } = useAuth();
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isSigningIn, setIsSigningIn] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const onSubmit = async (e) => {
        e.preventDefault();
        setIsSigningIn(true);
        try {
            await doSignInWithEmailAndPassword(username, password);
            navigate('/Search', { replace: true });
        } catch (error) {
            console.error("Error logging in:", error);
            setErrorMessage("Invalid login credentials");
            setIsSigningIn(false);
        }
    };

    if (userLoggedIn) {
        return <Navigate to="/Search" replace={true} />;
    }

    return (
        <div className="swamp-stays-container">
            {/* Main content */}
            <div className="login-content">
                <h1>Log In</h1>
                
                <form onSubmit={onSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {errorMessage && (
                        <div className="error-message">{errorMessage}</div>
                    )}

                    <button 
                        type="submit" 
                        className="create-account-btn" 
                        disabled={isSigningIn}
                    >
                        Sign In
                    </button>

                    <div className="signup-link">
                        Don't have an account? <Link to="/register" className="sign-up-link">Sign Up</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;