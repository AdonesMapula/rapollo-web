import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../firebase";
import axios from "axios";
import { collection, getDocs, addDoc, doc, updateDoc } from "firebase/firestore";

const Tickets = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    quantity: "",
    paymentMethod: "",
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imageFile, setImageFile] = useState(null);

  // Fetch event details from Firestore
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "tickets"));
        if (!querySnapshot.empty) {
          const event = querySnapshot.docs[0].data(); // Assuming only one event
          setEventData(event);
        }
      } catch (error) {
        console.error("Error fetching event data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "quantity" && /^\d{0,4}$/.test(value)) {
      setFormData({ ...formData, [name]: value });
    } else if (name === "phone" && /^[\d+\-\s]{0,15}$/.test(value)) {
      setFormData({ ...formData, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirm(true);
  };

  const handleImageUpload = async () => {
    if (!imageFile) return null;
  
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", "bshhhijy");
    formData.append("folder", "gcash_receipt");
  
    try {
      console.log("Uploading image...");
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dznhei4mc/image/upload",
        formData
      );
      console.log("Upload successful:", response.data.secure_url);
      return response.data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error.response?.data || error);
      alert("Image upload failed. Check console for details.");
      return null;
    }
  };

  const handleConfirm = async () => {
    setShowConfirm(false);
    let uploadedImageUrl = null;

    if (imageFile) {
        uploadedImageUrl = await handleImageUpload();
        if (!uploadedImageUrl) {
            toast.error("❌ Failed to upload receipt.");
            return;
        }
    }

  
    try {
      await addDoc(collection(db, "soldtickets"), {
        fullName: String(formData.fullName),
        email: String(formData.email),
        phone: String(formData.phone),
        quantity: Number(formData.quantity),
        paymentMethod: String(formData.paymentMethod),
        eventName: eventData ? String(eventData.eventName) : "Unknown",
        eventDate: eventData ? String(eventData.eventDate) : "Unknown",
        venue: eventData ? String(eventData.venue) : "Unknown",
        ticketPrice: eventData ? Number(eventData.ticketPrice) : 0,
        purchaseDate: new Date().toISOString(), // Store current date as string
        status: "Pending", // Default status for every new purchase
        receiptURL: uploadedImageUrl || "",
      });
  
      toast.success("🎟️ Ticket order confirmed!", { position: "top-center" });
  
      // Reset Form
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        quantity: "",
        paymentMethod: "",
      });
  
    } catch (error) {
      console.error("Error saving ticket order:", error);
      toast.error(`❌ Failed to place order: ${error.message}`);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading event details...</div>;
  }

  if (!eventData) {
    return <div className="min-h-screen flex items-center justify-center text-white">No event data found.</div>;
  }

  return (
    <div className="min-h-screen bg-black text-white flex justify-center items-center p-6 relative">
      <ToastContainer />
      <div className={`max-w-6xl p-10 w-full flex flex-col md:flex-row gap-8 transition-all duration-300 ${showConfirm ? "blur-sm" : ""}`}>
        
        {/* Left Side: Event Details */}
        <div className="md:w-1/2 text-left border-gray-700">
          <h2 className="text-2xl font-bold uppercase mb-4">Event Details</h2>
          <p className="text-lg"><span className="font-bold">Event Name:</span> {eventData.eventName}</p>
          <p className="text-lg"><span className="font-bold">Date & Time:</span> {new Date(eventData.eventDate).toLocaleString()}</p>
          <p className="text-lg"><span className="font-bold">Location:</span> {eventData.venue}</p>
          <p className="text-lg"><span className="font-bold">Price:</span> ₱{eventData.ticketPrice}</p>
          <img src={eventData.imageURL} alt="Event" className="mt-4 w-full rounded-lg" />
        </div>

        {/* Right Side: Ticket Purchase Form */}
        <div className="md:w-1/2 p-10 border-gray-700">
          <h2 className="text-2xl font-bold uppercase text-center mb-4">Wish to buy a ticket?</h2>
          <p className="text-sm text-gray-400 text-center mb-4">Fill out this form now!</p>
          <p className="text-lg"><span className="font-bold text-red-600">Pagdali 'nimal! {eventData.totalTickets} tickets left!</span></p>
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
              type="number"
              name="phone"
              placeholder="Phone Number"
              className="p-3 bg-gray-800 border border-gray-700 rounded-md focus:outline-none text-white"
              value={formData.phone}
              onChange={handleChange}
            />
            <input
              type="number"
              name="quantity"
              placeholder="Quantity of Tickets"
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
              <option value="Cash on Delivery">Cash on Delivery</option>
              <option value="GCash">GCash</option>
            </select>

            {formData.paymentMethod === "GCash" && (
              <div>
                <label className="block text-sm font-medium">Upload GCash Receipt</label>
                <input
                  type="file"
                  name="receipt"
                  accept="image/*"
                  className="p-2 bg-blue-500 border border-blue-900 rounded-md focus:outline-none"
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
              </div>
            )}

            <button type="submit" className="bg-red-600 text-white p-3 rounded-md font-bold hover:bg-red-700">
              Proceed to Payment
            </button>
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
          <div className="bg-gray-900 p-6 rounded-lg text-white w-96 text-center shadow-lg">
            <h3 className="text-xl font-bold">Confirm Order</h3>
            <p className="text-gray-400 mt-2">Is your information correct?</p>
            <div className="flex justify-around mt-4">
              <button onClick={() => setShowConfirm(false)} className="px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-500">
                Go Back
              </button>
              <button onClick={handleConfirm} className="px-4 py-2 bg-green-600 rounded-md hover:bg-green-500">
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
