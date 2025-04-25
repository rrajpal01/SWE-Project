import React, { useState } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/authContext'
import { doCreateUserWithEmailAndPassword } from '../../../firebase/auth'
import { getDatabase, ref, set } from 'firebase/database'
import { getAuth } from 'firebase/auth'
// import alligator from '../../../assets/gator.png'
import './SignUp.css'

const Register = () => {
  const navigate = useNavigate()
  const { userLoggedIn } = useAuth()

  const [firstName, setFirstName]     = useState('')
  const [lastName, setLastName]       = useState('')
  const [email, setEmail]             = useState('')
  const [password, setPassword]       = useState('')
  const [confirmPassword, setConfirm] = useState('')
  const [isRegistering, setRegistering] = useState(false)
  const [errorMessage, setError]        = useState('')

  const onSubmit = async e => {
    e.preventDefault()
    if (isRegistering) return

    setRegistering(true)
    setError('')

    if (!email.endsWith('@ufl.edu')) {
      setError('Only @ufl.edu email addresses are allowed')
      setRegistering(false)
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setRegistering(false)
      return
    }

    try {
      // Create user in Firebase Auth
      const userCredential = await doCreateUserWithEmailAndPassword(email, password)
      const { user } = userCredential

      // Write user profile to Realtime Database
      const db = getDatabase()
      await set(ref(db, `users/${user.uid}`), {
        firstName,
        lastName,
        email
      })

      // Redirect to login
      navigate('/login')
    } catch (err) {
      setError(err.message)
    }

    setRegistering(false)
  }

  if (userLoggedIn) return <Navigate to="/home" replace />

  return (
    <div className="signup-page">
      <main className="signup-main">
        <div className="form-column">
          <h2>Create Account</h2>
          <form onSubmit={onSubmit}>
            <div className="name-inputs">
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                required
              />
            </div>
            <input
              type="email"
              placeholder="Email (@ufl.edu)"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={e => setConfirm(e.target.value)}
              required
            />

            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}

            <button
              type="submit"
              className="create-account-btn"
              disabled={isRegistering}
            >
              {isRegistering ? 'Signing Up…' : 'Create Account'}
            </button>
          </form>
          <div className="login-link">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </div>

        <div className="image-column">
          {/* <img src={alligator} alt="Alligator" /> */}
        </div>
      </main>
    </div>
  )
}

export default Register
