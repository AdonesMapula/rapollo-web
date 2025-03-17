import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { FaSignOutAlt, FaSignInAlt } from "react-icons/fa"; // Import icons
import logo from "../assets/logo.png";
import logoHover from "../assets/logo3.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [logoSrc, setLogoSrc] = useState(logo);
  const [user, setUser] = useState(null);

  // Check Authentication State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login"); // Redirect to login after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="navbar">
      <ul className="navbar-links">
        <li>
          <NavLink to="/home" className="nav-item">
            <span>Home</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/about" className="nav-item">
            <span>About</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/events" className="nav-item">
            <span>Events</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/home">
            <img
              src={logoSrc}
              alt="Logo"
              className="nav-logo"
              onMouseEnter={() => setLogoSrc(logoHover)}
              onMouseLeave={() => setLogoSrc(logo)}
            />
          </NavLink>
        </li>
        <li>
          <NavLink to="/emcees" className="nav-item">
            <span>Emcees</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/shop" className="nav-item">
            <span>Shop</span>
          </NavLink>
        </li>
        <li>
          <NavLink to="/tickets" className="nav-item">
            <span>Tickets</span>
          </NavLink>
        </li>
      </ul>

      {/* Login/Logout Button - Positioned to the Far Right */}
      {user ? (
        <button onClick={handleLogout}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 border-2 border-red-500/30 text-white/30 flex items-center justify-center text-base cursor-pointer px-4 py-2 transition-colors duration-300 rounded-full w-[70px] hover:bg-red-500 hover:text-white"
      >
        <FaSignOutAlt className="text-red-500 text-xl transition-colors duration-300 hover:text-black" />
      </button>
      
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/60 border-2 border-red-500/30 text-white/30 flex items-center justify-center text-base cursor-pointer px-4 py-2 transition-colors duration-300 rounded-full w-[70px] hover:bg-red-500 hover:text-white"
        >
          <FaSignInAlt className="text-red-500 text-xl transition-colors duration-300 hover:text-white" />
        </button>

      )}
    </nav>
  );
};

export default Navbar;
