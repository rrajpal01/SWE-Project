import React, { useState } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { doSignInWithEmailAndPassword } from '../../../firebase/auth'
import { useAuth } from '../../../contexts/authContext'
import swampBackground from '../../../assets/swamp-bg.jpg';
import gator from '../../../assets/gator.png';
import "./LoginPage.css";

const Login = () => {
    const { userLoggedIn } = useAuth()
    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [isSigningIn, setIsSigningIn] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const onSubmit = async (e) => {
        e.preventDefault();
        try {
            await doSignInWithEmailAndPassword(username, password);
            navigate('/home', { replace: true })
        } catch (error) {
            console.error("Error logging in:", error);
            setErrorMessage("Invalid login credentials");
        }
    }

    if (userLoggedIn) {
        return <Navigate to="/home" replace={true} />
    }

    return (
        <div className="login-container">
            <div className="left-side" style={{ backgroundImage: `url(${swampBackground})` }}>
                <div className="welcome-content">
                    <h1>Welcome to Swamp Stays</h1>
                    <p>Find your perfect stay today!</p>
                </div>
                <img src={gator} alt="Gator" className="gator-image" />
            </div>

            <div className="right-side">
                <div className="login-form">
                    <h2>Log In</h2>
                    <form onSubmit={onSubmit}>
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="Username"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <input
                                type="password"
                                placeholder="Password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button type="button" className="forgot-password">
                                Forgot Password?
                            </button>
                        </div>

                        {errorMessage && (
                            <div className="error-message">{errorMessage}</div>
                        )}

                        <button
                            type="submit"
                            disabled={isSigningIn}
                            className="create-account-btn"
                        >
                            Login
                        </button>

                        <div className="signup-link">
                            Don't have an account? <Link to="/register">Sign Up</Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
};

export default Login;