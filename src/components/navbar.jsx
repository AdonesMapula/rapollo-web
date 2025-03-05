import React from "react";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";

const Navbar = () => {
  return (
    <nav className="navbar">
      <ul className="navbar-links">
        <li><NavLink to="/" className="nav-item" style={{ fontWeight: "bold" }}>Home</NavLink>
        </li>
        <li><NavLink to="/about" className="nav-item" style={{ fontWeight: "bold" }}>About</NavLink></li>
        <li><NavLink to="/events" className="nav-item" style={{ fontWeight: "bold" }}>Events</NavLink></li>
        <li><NavLink to="/"><img src={logo} alt="Logo" className="nav-logo" /></NavLink></li>
        <li><NavLink to="/emcees" className="nav-item" style={{ fontWeight: "bold" }}>Emcees</NavLink></li>
        <li><NavLink to="/shop" className="nav-item" style={{ fontWeight: "bold" }}>Shop</NavLink></li>
        <li><NavLink to="/tickets" className="nav-item" style={{ fontWeight: "bold" }}>Tickets</NavLink></li>
      </ul>
    </nav>
  );
};

export default Navbar;
