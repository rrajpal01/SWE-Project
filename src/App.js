import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  Link
} from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/authContext';
import Login from './components/auth/login';
import Register from './components/auth/register';
import Home from './Pages/Home';
import User from './Pages/User';
import Library from './Pages/Library';
import Profile from './Pages/Profile';
import Search from './Pages/Search';
import Chat from './Pages/Chat';
import Messaging from './Pages/Messaging';
import UserListings from './Pages/UserListings';
import Transactions from './Pages/Transactions';
import gator from './assets/gator.png';

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

function AppContent() {
  const navigate = useNavigate();
  const { userLoggedIn, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLogoClick = () => {
    if (userLoggedIn) {
      setShowMenu(v => !v);
    }
    navigate('/home');
  };

  return (
    <>
      <nav style={styles.swampNavbar}>
        <div style={styles.logoWrapper}>
          <div onClick={handleLogoClick} style={styles.logoContainer}>
            <img src={gator} alt="SwampStays" style={styles.logo} />
            <span style={styles.brandName}>SwampStays</span>
          </div>
          {userLoggedIn && showMenu && (
            <ul style={styles.dropdown}>
              <li>
                <Link
                  to="/profile"
                  style={styles.dropdownItem}
                  onClick={() => setShowMenu(false)}
                >
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/messaging"
                  style={styles.dropdownItem}
                  onClick={() => setShowMenu(false)}
                >
                  Messages
                </Link>
              </li>
              <li>
                <Link
                  to="/transactions"
                  style={styles.dropdownItem}
                  onClick={() => setShowMenu(false)}
                >
                  Transactions
                </Link>
              </li>
              <li>
                <Link
                  to="/userListings"
                  style={styles.dropdownItem}
                  onClick={() => setShowMenu(false)}
                >
                  Your Listings
                </Link>
              </li>
            </ul>
          )}
        </div>

        <div style={styles.navLinks}>
          <Link to="/search" style={styles.navLink}>
            Find a Sublease
          </Link>
          <Link to="/user" style={styles.navLink}>
            Add a Sublease
          </Link>
          <Link to="/library" style={styles.navLink}>
            Favorites
          </Link>
          {userLoggedIn ? (
            <button onClick={handleLogout} style={styles.loginBtn}>
              Logout
            </button>
          ) : (
            <Link to="/login" style={styles.loginBtn}>
              Login
            </Link>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/search" element={<Search />} />
        <Route path="/user" element={<User />} />
        <Route path="/library" element={<Library />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/chat/:userId" element={<Chat />} />
        <Route path="/messaging" element={<Messaging />} />
        <Route path="/userListings" element={<UserListings />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route
          path="/"
          element={
            userLoggedIn ? <Navigate to="/home" replace /> : <Login />
          }
        />
      </Routes>
    </>
  );
}

const styles = {
  swampNavbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px 30px',
    backgroundColor: 'white',
    borderBottom: '1px solid #f0f0f0',
    position: 'relative'
  },
  logoWrapper: {
    position: 'relative'
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    userSelect: 'none'
  },
  logo: {
    height: '40px',
    marginRight: '5px'
  },
  brandName: {
    fontSize: '18px',
    color: '#333'
  },
  dropdown: {
    listStyle: 'none',
    margin: 0,
    padding: '8px 0',
    position: 'absolute',
    top: '100%',
    left: 0,
    background: 'white',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
    borderRadius: '4px',
    minWidth: '140px'
  },
  dropdownItem: {
    display: 'block',
    padding: '8px 16px',
    textDecoration: 'none',
    color: '#333',
    fontSize: '14px'
  },
  navLinks: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center'
  },
  navLink: {
    textDecoration: 'none',
    color: '#333',
    fontSize: '16px'
  },
  loginBtn: {
    backgroundColor: '#c9cdb5',
    color: '#333',
    padding: '8px 20px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'none',
    fontSize: '16px'
  }
};

export default App;
