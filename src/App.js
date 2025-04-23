import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from "./components/auth/login";
import Register from "./components/auth/register";
import Header from "./components/header";
import Home from "./Pages/Home";
import User from "./Pages/User";
import Library from "./Pages/Library";
import Search from "./Pages/Search";
import { AuthProvider, useAuth } from "./contexts/authContext";

function AppContent() {
  const { userLoggedIn, logout } = useAuth();

  return (
    <Router>
      <div>
        {/* 🌐 Navbar */}
        <nav style={styles.navbar}>
          <Link to="/search" style={styles.link}>Search</Link>
          <Link to="/user" style={styles.link}>Add Apartment</Link>
          <Link to="/library" style={styles.link}>Saved</Link>
          {userLoggedIn ? (
            <button
              onClick={logout}
              style={{ ...styles.link, cursor: "pointer" }}
            >
              Logout
            </button>
          ) : (
            <Link to="/login" style={styles.link}>Login</Link>
          )}
        </nav>

        {/* 🔀 Routes */}
        <Routes>
          <Route path="/search" element={<Search />} />
          <Route path="/user" element={<User />} />
          <Route path="/library" element={<Library />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/" element={userLoggedIn ? <Navigate to="/home" replace /> : <Login />} />
        </Routes>
      </div>
    </Router>
  );
}

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

// 🎨 Simple styling
const styles = {
  navbar: {
    display: 'flex',
    gap: '20px',
    padding: '10px 20px',
    backgroundColor: '#f2f2f2',
    borderBottom: '1px solid #ccc',
  },
  link: {
    textDecoration: 'none',
    color: '#333',
    fontWeight: 'bold'
  }
};

export default App;