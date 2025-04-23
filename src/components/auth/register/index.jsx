import React, { useState } from 'react'
import { Navigate, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../contexts/authContext'
import { doCreateUserWithEmailAndPassword } from '../../../firebase/auth'
import swampBg from '../../../assets/swamp-bg.jpg'
import alligator from '../../../assets/gator.png'
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
      await doCreateUserWithEmailAndPassword(email, password)
      navigate('/login')
    } catch (err) {
      setError(err.message)
    }
    setRegistering(false)
  }

  if (userLoggedIn) return <Navigate to="/home" replace />

  return (
    <div className="signup-container">
      <aside
        className="signup-left-panel"
        style={{ backgroundImage: `url(${swampBg})` }}
      >
        <h1 className="logo">SwampStays</h1>
        <nav className="side-nav">
          <Link to="/profile">Profile</Link>
          <Link to="/home">Home</Link>
          <Link to="/find">Find Sublease</Link>
          <Link to="/add">Add Sublease</Link>
          <Link to="/messages">Messages</Link>
        </nav>
        <img src={alligator} alt="Alligator" className="gator-logo" />
      </aside>

      <section className="signup-right-panel">
        <div className="signup-form-container">
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
      </section>
    </div>
  )
}

export default Register
