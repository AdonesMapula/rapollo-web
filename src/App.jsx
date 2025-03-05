import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Events from "./pages/Events";
import Emcees from "./pages/Emcees";
import Shop from "./pages/Shop";
import Tickets from "./pages/Tickets";
import "./App.css";

const App = () => {
  return (
    <Router>
      <Navbar />
      <div className="content min-h-[95vh]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/events" element={<Events />} />
          <Route path="/emcees" element={<Emcees />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/tickets" element={<Tickets />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
};

export default App;
