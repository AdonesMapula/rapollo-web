import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { auth } from "./firebase";
import ScrollToTop from "./components/scrolltotop"; // Import ScrollToTop component
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Events from "./pages/Events";
import Emcees from "./pages/Emcees";
import Shop from "./pages/Shop";
import Tickets from "./pages/Tickets";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import "./App.css";

const AppLayout = ({ user }) => {
  const location = useLocation();

  // Hide Navbar and Footer on login and signup pages
  const hideNavAndFooter = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
      {!hideNavAndFooter && <Navbar />}
      <ScrollToTop /> {/* Ensures scroll resets on navigation */}
      <div className="content min-h-[100vh]">
        <Routes>
          {/* Home is accessible to all users */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />

          {/* Auth routes */}
          <Route path="/login" element={user ? <Navigate to="/home" /> : <Login />} />
          <Route path="/signup" element={user ? <Navigate to="/home" /> : <Signup />} />

          {/* Publicly accessible pages */}
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/emcees" element={<Emcees />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/tickets" element={<Tickets />} />

          {/* Protected route example */}
          <Route path="/home" element={user ? <Home /> : <Navigate to="/login" />} />

          {/* Catch all other routes */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      {!hideNavAndFooter && <Footer />}
    </>
  );
};

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-lg font-semibold">Loading...</p>
      </div>
    );

  return (
    <Router>
      <AppLayout user={user} />
    </Router>
  );
};

export default App;
