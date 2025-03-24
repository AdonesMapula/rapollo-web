import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { db } from "../firebase";
import axios from "axios";
import { collection, getDocs, addDoc, doc, updateDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { getAuth } from "firebase/auth";
import Login from "./Login";

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
  const auth = getAuth();
  const [showAuthAlert, setShowAuthAlert] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "tickets"));
        if (!querySnapshot.empty) {
          const event = querySnapshot.docs[0].data(); 
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
    
    if (!auth.currentUser) {
      setShowAuthAlert(true); 
      return;
    }
  
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
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        quantity: Number(formData.quantity),
        paymentMethod: formData.paymentMethod,
        eventName: eventData?.eventName || "Unknown",
        eventDate: eventData?.eventDate || "Unknown",
        venue: eventData?.venue || "Unknown",
        ticketPrice: eventData?.ticketPrice || 0,
        purchaseDate: new Date().toISOString(),
        status: "Pending",
        receiptURL: uploadedImageUrl || "",
      });
  
      await axios.post("http://localhost:5000/send-email", {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        quantity: formData.quantity,
        paymentMethod: formData.paymentMethod,
        eventName: eventData?.eventName || "Unknown",
        eventDate: eventData?.eventDate || "Unknown",
        venue: eventData?.venue || "Unknown",
        ticketPrice: eventData?.ticketPrice || 0,
        receiptURL: uploadedImageUrl || "",
        orderType: "ticket",
      });
  
      toast.success("🎟️ Ticket order confirmed and email sent!", { position: "top-center" });
  
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
    <div className="min-h-screen text-white flex justify-center items-center p-6 relative"
    style={{ backgroundImage: "url('/src/assets/emceebg1.jpg')" }}S>
      <ToastContainer />
      <div className={`max-w-6xl p-10 w-full flex flex-col md:flex-row gap-8 transition-all duration-300 ${showConfirm ? "blur-sm" : ""}`}>
        
        <div className="md:w-1/2 text-left border-gray-700">
          <h2 className="text-2xl font-bold uppercase mb-4">Event Details</h2>
          <p className="text-lg"><span className="font-bold">Event Name:</span> {eventData.eventName}</p>
          <p className="text-lg"><span className="font-bold">Date & Time:</span> {new Date(eventData.eventDate).toLocaleString()}</p>
          <p className="text-lg"><span className="font-bold">Location:</span> {eventData.venue}</p>
          <p className="text-lg"><span className="font-bold">Price:</span> ₱{eventData.ticketPrice}</p>
          <img src={eventData.imageURL} alt="Event" className="mt-4 w-full rounded-lg" />
        </div>

        <div className="md:w-1/2 p-10 border-gray-700">
          <h2 className="text-2xl font-bold uppercase text-center mb-4">Wish to buy a ticket?</h2>
          <p className="text-sm text-gray-400 text-center mb-4">Fill out this form now!</p>
          <p className="text-lg">
          <span className="font-bold text-red-600 pb-5 block">  Hurry! only {eventData.totalTickets} tickets Available!</span>
          </p>
          
          <form className="flex flex-col gap-7" onSubmit={handleSubmit}>
            {["fullName", "email", "phone", "quantity"].map((field, index) => (
              <div key={index} className="relative">
                <input
                  type={field === "email" ? "email" : field === "phone" || field === "quantity" ? "number" : "text"}
                  name={field}
                  placeholder=" "
                  className="p-3 bg-zinc-900 border border-white/50 rounded-md focus:outline-none text-white w-full peer"
                  value={formData[field]}
                  onChange={handleChange}
                />
                <label
                  className="absolute left-3 -top-4 text-xs text-gray-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:-top-4 peer-focus:text-xs peer-focus:text-white"
                >
                  {field === "fullName" ? "Full Name (First Name, Last Name)" :
                  field === "email" ? "Email Address" :
                  field === "phone" ? "Phone Number" :
                  "Quantity of Tickets"}
                </label>

              </div>
            ))}

            <label className="block text-xs left-3 text-left font-medium text-gray-400 -mb-7 -mt-5">
              <span className="text-black">--</span> Payment Method</label>

            <select
              name="paymentMethod"
              className="p-3 bg-zinc-900 border border-white/50 rounded-md focus:outline-none text-white w-full"
              value={formData.paymentMethod}
              onChange={handleChange}
            >
              <option value="">Select Payment Method</option>
              <option value="Cash on Delivery">Cash on Delivery</option>
              <option value="GCash">GCash</option>
            </select>


            {formData.paymentMethod === "GCash" && (
              <div>
                <img src="src\assets\rapolloqr.png" alt="GCash QR Code" className="w-32 mx-auto mb-2" />
                <label className="block text-sm font-medium text-white">Scan QR above and Upload GCash Receipt</label>
                <input
                  type="file"
                  name="receipt"
                  accept="image/*"
                  className="p-2 bg-red-600 border hover:bg-red-700 border-red-500 rounded-md focus:outline-none w-full"
                  onChange={(e) => setImageFile(e.target.files[0])}
                />
              </div>
            )}

            <div>
              <button
                className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white p-3 rounded-md font-bold"
                onClick={() => {
                  if (!auth.currentUser) {
                    setShowLoginModal(true);
                    return;
                  }
                  setShowPaymentModal(true);
                }}
              >
                Proceed to Payment
              </button>

              {showLoginModal && <Login showAsModal={true} onClose={() => setShowLoginModal(false)} />}
            </div>
          </form>
        </div>

      </div>
      {showAuthAlert && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/90 bg-opacity-80 z-50">
          <motion.div className="bg-white text-black p-6 rounded-lg shadow-lg max-w-sm w-full text-center border-4 border-red-600">
            <h2 className="text-2xl font-extrabold uppercase text-red-600 animate-pulse">Yo! Hold Up! 🚨</h2>
            <p className="mt-3 text-lg font-medium">You gotta sign in before checking out, fam! 🛒</p>
            <button 
              className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white p-3 rounded-md font-bold uppercase" 
              onClick={() => setShowAuthAlert(false)}
            >
              Aight, Got It! ✌️
            </button>
          </motion.div>
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/90 bg-opacity-50">
          <div className="bg-gray-900 p-6 rounded-lg text-white w-96 text-center shadow-lg">
            <h3 className="text-xl font-bold">Confirm Order</h3>
            <p className="text-gray-400 mt-2">Is your information correct?</p>

            <div className="mt-4 text-left text-sm bg-gray-800 p-4 rounded-lg">
              <p><span className="font-bold">Full Name:</span> {formData.fullName}</p>
              <p><span className="font-bold">Email:</span> {formData.email}</p>
              <p><span className="font-bold">Phone:</span> {formData.phone}</p>
              <p><span className="font-bold">Quantity:</span> {formData.quantity}</p>
              <p><span className="font-bold">Payment Method:</span> {formData.paymentMethod}</p>
              {formData.paymentMethod === "GCash" && imageFile && (
                <p className="text-green-400">✔ Receipt Uploaded</p>
              )}
            </div>

            <div className="flex justify-around mt-4">
              <button onClick={() => setShowConfirm(false)} className="px-4 py-2 bg-gray-600 rounded-md hover:bg-gray-500">
                Go Back
              </button>
              <button onClick={handleConfirm} className="px-4 py-2 bg-red-600 rounded-md hover:bg-red-500">
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
