import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Tickets = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    quantity: "",
    paymentMethod: "",
  });

  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "quantity") {
      if (/^\d{0,4}$/.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
    } else if (name === "phone") {
      if (/^[\d+\-\s]{0,15}$/.test(value)) {
        setFormData({ ...formData, [name]: value });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    toast.success("🔥 Bet! Ticket order locked in!", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: false,
      theme: "dark",
    });
  };

  return (
    <div className="min-h-screen bg-black text-white flex justify-center items-center p-6 relative">
      <ToastContainer />
      <div className={`max-w-6xl p-10 w-full flex flex-col md:flex-row gap-8 transition-all duration-300 ${showConfirm ? "blur-sm" : ""}`}>
        {/* Left Side: Event Details */}
        <div className="md:w-1/2 text-left border-gray-700">
          <h2 className="text-2xl font-bold uppercase mb-4">Event Details</h2>
          <p className="text-lg"><span className="font-bold">Event Name:</span> Subangan 3</p>
          <p className="text-lg"><span className="font-bold">Date & Time:</span> 12/07/2024 at 6:00 PM</p>
          <p className="text-lg"><span className="font-bold">Location:</span> Azul Tuslob Buwa, Gorordo Ave., Cebu City</p>
          <p className="text-lg"><span className="font-bold">Pricing:</span> ₱200.00 w/ 1 beer</p>
          <img src="/src/assets/subangan3.jpg" alt="Event" className="mt-4 w-full rounded-lg" />
        </div>

        {/* Right Side: Ticket Purchase Form */}
        <div className="md:w-1/2 p-10 border-gray-700">
          <h2 className="text-2xl font-bold uppercase text-center mb-4">Wish to buy a ticket?</h2>
          <p className="text-sm text-gray-400 text-center mb-4">Fill out this form now!</p>
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name (First Name, Last Name)"
              className="p-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none text-white"
              value={formData.fullName}
              onChange={handleChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              className="p-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none text-white"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              className="p-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none text-white"
              value={formData.phone}
              onChange={handleChange}
            />
            <input
              type="number"
              name="quantity"
              placeholder="Quantity of Tickets (Max 9999)"
              className="p-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none text-white"
              value={formData.quantity}
              onChange={handleChange}
            />
            <select
              name="paymentMethod"
              className="p-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none text-white"
              value={formData.paymentMethod}
              onChange={handleChange}
            >
              <option value="">Select Payment Method</option>
              <option value="">Cash on Delivery</option>
              <option value="GCash">GCash</option>
            </select>
            <button type="submit" className="bg-red-600 text-white p-3 rounded-md font-bold hover:bg-red-700">
              Proceed to Payment
            </button>
          </form>
        </div>
      </div>

      {/* Confirmation Modal with Darkened Background */}
      {showConfirm && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-gray-900 p-6 rounded-lg text-white w-96 text-center shadow-lg">
            <h3 className="text-xl font-bold">Confirm Order</h3>
            <p className="text-gray-400 mt-2">Is your information correct?</p>
            <div className="flex justify-around mt-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-500"
              >
                Go Back
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-green-600 rounded-md hover:bg-green-500"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tickets;
