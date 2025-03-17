import React from "react";
import { FaFacebookF, FaInstagram, FaEnvelope, FaYoutube } from "react-icons/fa";
import Logo from "/src/assets/logo2.png";

const Footer = () => {
  return (
    <footer className="bg-red-600 text-white fixed bottom-0 w-full h-[5vh] flex items-center justify-between px-4 text-sm">
      {/* Left - Logo */}
      <div className="flex items-center space-x-2">
        <img src={Logo} alt="Rapollo Logo" className="h-6 md:h-8" />
        <center>&copy; 2025 RAPOLLO. All rights reserved.</center>
      </div>

      {/* Right - Social Media Icons */}
      <div className="flex space-x-4">
        <a href="https://web.facebook.com/rapollocebu/" target="_blank" rel="noopener noreferrer">
          <FaFacebookF className="text-white hover:text-black transition text-lg" />
        </a>
        <a href="mailto:rapollo.ubec@gmail.com">
          <FaEnvelope className="text-white hover:text-black transition text-lg" />
        </a>
        <a href="https://www.instagram.com/rapollo.ubec/" target="_blank" rel="noopener noreferrer">
          <FaInstagram className="text-white hover:text-black transition text-lg" />
        </a>
        <a href="https://www.youtube.com/@RAPOLLO" target="_blank" rel="noopener noreferrer">
          <FaYoutube className="text-white hover:text-black transition text-lg" />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
