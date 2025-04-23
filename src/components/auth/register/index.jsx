import React, { useState } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/authContext'
import { doCreateUserWithEmailAndPassword } from '../../../firebase/auth'
import alligator from '../../../assets/gator.png';
import './SignUp.css';

const Register = () => {
    const navigate = useNavigate()

    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setconfirmPassword] = useState('')
    const [isRegistering, setIsRegistering] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const { userLoggedIn } = useAuth()

    const onSubmit = async (e) => {
        e.preventDefault()
        if (!isRegistering) {
            setIsRegistering(true)
            // Validate email domain
            if (!email.endsWith('@ufl.edu')) {
                setErrorMessage('Only @ufl.edu email addresses are allowed')
                setIsRegistering(false)
                return
            }
            if (password !== confirmPassword) {
                setErrorMessage('Passwords do not match')
                setIsRegistering(false)
                return
            }
            try {
                await doCreateUserWithEmailAndPassword(email, password)
                navigate('/login')
            } catch (error) {
                setErrorMessage(error.message)
            }
            setIsRegistering(false)
        }
    }

    return (
        <div className="signup-container">
            {userLoggedIn && (<Navigate to={'/home'} replace={true} />)}

            <div className="signup-left-panel">
                <div className="welcome-message">
                    <h1>Welcome to Swamp Stays</h1>
                    <h2>Find your perfect stay today!</h2>
                </div>
                <img src={alligator} alt="Alligator" className="gator-logo" />
            </div>

            <div className="signup-right-panel">
                <div className="signup-form-container">
                    <h2>Create Account</h2>
                    <form onSubmit={onSubmit}>
                        <div className="name-inputs">
                            <input
                                type="text"
                                placeholder="First Name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setconfirmPassword(e.target.value)}
                            required
                        />
                        {errorMessage && (
                            <div className="error-message">{errorMessage}</div>
                        )}
                        <button 
                            type="submit" 
                            disabled={isRegistering}
                            className="create-account-btn"
                        >
                            {isRegistering ? 'Signing Up...' : 'Create Account'}
                        </button>
                    </form>
                    <div className="login-link">
                        Already have an account?{' '}
                        <Link to={'/login'}>Login</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register