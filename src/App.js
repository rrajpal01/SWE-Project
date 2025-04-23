import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useRoutes } from "react-router-dom";

import Login from "./components/auth/login";
import Register from "./components/auth/register";
import Header from "./components/header";
import Home from "./components/home";
import User from "./Pages/User";
import Library from "./Pages/Library";
import Search from "./Pages/Search";

import { AuthProvider } from "./contexts/authContext";

/*
function AppRoutes() {
  const routesArray = [
    {
      path: "*",
      element: <Login />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/home",
      element: <Home />,
    },
  ];

  return useRoutes(routesArray);
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header />
        <div className="w-full h-screen flex flex-col">
          <AppRoutes />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;*/

const App = () => {
  return (
    <Router>
      <div>
        {/* 🌐 Navbar */}
        <nav style={styles.navbar}>
          <Link to="/search" style={styles.link}>Search</Link>
          <Link to="/user" style={styles.link}>Add Apartment</Link>
          <Link to="/library" style={styles.link}>Saved</Link>
        </nav>

        {/* 🔀 Routes */}
        <Routes>
          <Route path="/search" element={<Search />} />
          <Route path="/user" element={<User />} />
          <Route path="/library" element={<Library />} />
          <Route path="/" element={<Search />} />
        </Routes>
      </div>
    </Router>
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