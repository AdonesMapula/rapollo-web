import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, sendEmailVerification, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import loginBackground from "../assets/aboutus.jpg";
import rapolloLogo from "../assets/logo.png";
import TermsAndConditionsModal from "./TermsAndConditionsModal";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);
      setSuccessMessage("Verification email sent! Please check your inbox.");

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: "user",
        createdAt: new Date(),
      });

      await signOut(auth);

      setTimeout(() => {
        navigate("/login");
      }, 5000);
    } catch (error) {
      setError(error.message);
      console.error("Sign Up error:", error);
    }

    setLoading(false);
  };

  return (
    <div className="flex h-screen">
      {/* Left side (Image) */}
      <div className="w-3/4 bg-cover bg-center relative" style={{ backgroundImage: `url(${loginBackground})` }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <img src={rapolloLogo} alt="Rapollo Logo" className="w-3/4" />
        </div>
      </div>

      {/* Right side (Sign-up Form) */}
      <div className="w-1/2 flex items-center justify-center bg-gray-900 text-white">
        <form className="w-2/3 p-8 rounded-lg shadow-lg" onSubmit={handleSignUp}>
          <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>

          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          {successMessage && <p className="text-green-500 text-sm mb-4 text-center">{successMessage}</p>}

          {/* Email Input */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-400 text-left mb-2">Email</label>
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

          {/* Password Input */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-400 text-left mb-2">Password</label>
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

          {/* Confirm Password Input */}
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block text-gray-400 text-left mb-2">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
              placeholder="Confirm your Password"
              required
            />
          </div>

          {/* Terms and Conditions Checkbox */}
          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              id="terms"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-5 h-5 text-gray-400 cursor-pointer"
            />
            <label htmlFor="terms" className="ml-2 text-sm cursor-pointer text-gray-400">
              I agree to the{" "}
              <span className="underline cursor-pointer" onClick={() => setShowTerms(true)}>
                Terms & Conditions
              </span>
            </label>
          </div>

          {/* Sign-Up Button */}
          <button
            type="submit"
            className={`w-full py-2 rounded-md transition ${agreed ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-400 cursor-not-allowed"}`}
            disabled={!agreed || loading}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
      </div>

      {/* Terms & Conditions Modal */}
      {showTerms && (
        <TermsAndConditionsModal 
          isOpen={showTerms} 
          onClose={() => setShowTerms(false)} 
          onAccept={() => {
            setAgreed(true);
            setShowTerms(false);
          }}
        />
      )}
    </div>
  );
}
