import "./App.css";
import logo from "./assets/logo.gif";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./components/home";
import Post from "./components/Post";
import Registration from "./components/registration";
import Login from "./components/Login";
import Profile from "./components/profile";
import Create from "./components/PostCreate";

function App() {
  const [user, setUser] = useState(null);
  const User = JSON.parse(localStorage.getItem("user"));

  // Check for a logged-in user in localStorage on component mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // Save user data to localStorage for session persistence
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    window.location.href = "/";
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    window.location.href = "/login";
  };
  return (
    <div className="container">
      <BrowserRouter>
        <header className="sticky-top d-flex flex-wrap align-items-center justify-content-center justify-content-md-between p-3 mb-4 border-bottom border-dark border-3 bg-light">
          <a
            href="/"
            className="d-flex align-items-center col-md-5 col-sm-8 mb-2 mb-md-0 text-dark text-decoration-none"
          >
            <img src={logo} className="logo me-2" alt="React logo" width="50" />
            {User && (
              <span className="fs-4 fw-bold">{User.name}&#39;s Blog</span>
            )}
          </a>

          <div className="col-md-4 col-sm-5 text-end">
            {/* If user is logged in, show the user's name and a logout button every time and every page */}
            {/* route with dinamic url, profile has its id */}

            {user && (
              <div key={user.id}>
                <a
                  href={"/profile/" + user.id}
                  className="btn btn-secondary me-2"
                >
                  Profile
                </a>
                <button className="btn btn-secondary" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}

            {/* If user is not logged in, show a signup link and login link */}
            {!user && (
              <div>
                <a href="/registration" className="btn me-2">
                  Sign-up
                </a>
                <a href="/login" className="btn btn-secondary">
                  Login
                </a>
              </div>
            )}
          </div>
        </header>
        {
          // if user is not logged in, redirect to login page

          !user && window.location.pathname !== "/login" ? (
            <Routes>
              <Route path="/" element={<Login onLogin={handleLogin} />} />
              <Route path="/registration" element={<Registration />} />
            </Routes>
          ) : (
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/registration" element={<Registration />} />
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              <Route path="/profile/:userId" element={<Profile />} />
              <Route path="/post/:postId" element={<Post />} />
              <Route path="/createPost" element={<Create />} />
            </Routes>
          )
        }
      </BrowserRouter>

    </div>
  );
}

export default App;
