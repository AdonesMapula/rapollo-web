import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from "firebase/auth";
import loginBackground from "../assets/aboutus.jpg";
import rapolloLogo from "../assets/logo.png";

export default function Login({ loginHandler, showAsModal = false, onClose }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && !showAsModal) {
        console.log("User is already logged in:", user);
        navigate("/home");
      }
    });
    return () => unsubscribe();
  }, [navigate, showAsModal]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
      
        if (!user.emailVerified) {
          setError("Thank You! Please continue your shopping!");
          setLoading(false);
          
          // Close the modal after 2 seconds
          setTimeout(() => {
            if (showAsModal) {
              onClose();
            }
          }, 1500);
      
          return;
        }
      
        console.log("User logged in:", user);
        loginHandler && loginHandler(user);
      
        if (showAsModal) {
          onClose();
        } else {
          navigate("/pages/home");
        }
      } catch (error) {
        setError("Invalid email or password");
        console.error("Login error:", error);
      }
      
      setLoading(false);
    
    };

  const handleForgotPassword = async () => {
    if (!email) {
      setError("Please enter your email first!");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setResetMessage("Password reset email sent! Check your inbox.");
      setError("");
    } catch (error) {
      setError("Failed to send reset email. Check your email address.");
      console.error("Forgot Password error:", error);
    }
  };

  return (
    <div
      className={`flex h-screen  ${
        showAsModal ? "fixed inset-0 bg-black/90 flex justify-center items-center" : ""
      }`}
    >
      <div className={`w-3/4 bg-cover bg-center relative ${showAsModal ? "hidden" : ""}`} style={{ backgroundImage: `url(${loginBackground})` }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <img src={rapolloLogo} alt="Rapollo Logo" className="w-3/4" />
        </div>
      </div>

      <div className={`w-1/2 flex items-center justify-center bg-gray-900 border-4 border-white/10 text-white ${showAsModal ? "w-150 p-6 rounded-lg shadow-lg bg-gray-800" : ""}`}>
        <form className="w-2/3 p-8 rounded-lg shadow-lg" onSubmit={handleLogin}>
          <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          {resetMessage && <p className="text-green-500 text-sm mb-4 text-center">{resetMessage}</p>}

          <div className="mb-4 text-left">
            <label htmlFor="email" className="block text-gray-400 mb-2">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Enter your Email"
              required
            />
          </div>

          <div className="mb-4 text-left">
            <label htmlFor="password" className="block text-gray-400 mb-2">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Enter your Password"
              required
            />
          </div>

          <div className="flex justify-between mb-6">
            <button type="button" onClick={handleForgotPassword} className="text-gray-400 text-sm hover:text-white">
              Forgot password?
            </button>
            <button type="button" onClick={() => navigate("/signup")} className="text-gray-400 text-sm hover:text-white">
              Sign Up
            </button>
          </div>

          <button type="submit" className="w-full bg-gray-700 text-white py-2 rounded-md hover:bg-gray-600 transition" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          {showAsModal && (
            <button onClick={onClose} className="mt-4 w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition">
              Close
            </button>
          )}
          <button 
            onClick={() => navigate("/home")} 
            className="mt-4 px-4 py-2 bg-black/1 text-white/50 rounded hover:text-red-600"
          >
            Continue as Guest
          </button>
        </form>
      </div>
    </div>
  );
}
