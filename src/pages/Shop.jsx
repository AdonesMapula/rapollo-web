import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaShoppingCart, FaRuler, FaTimes, FaPlus, FaMinus, FaChevronLeft, FaChevronRight, FaHistory } from "react-icons/fa";
import { db, auth } from "../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import Login from "./Login";
import axios from "axios";
import ShopHistory from "./ShopHistory"; 

const Shop = () => {
  const categories = ["All","T-Shirts", "Jackets", "Hoodies", "Cap", "Accessories", "Others"];
  const brands = [
    "All",
    "Atraxia",
    "BLVCK MNL",
    "FlipTop",
    "Rapollo",
    "RealJokes",
    "Uprising",
    "City Boy Outfitters",
    "Ninetynine Clothing",
    "Got Bars",
    "Hypebeat",
    "Turbohectic",
    "Rx Panda",
    "Low Qual",
    "Payaso",
    "Greedy Bastard",
    "Rebel Doggs Merch",
    "Krwn Manila"];
    const sizes = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];
    
  const [searchTerm, setSearchTerm] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const auth = getAuth();
  const [showAuthAlert, setShowAuthAlert] = useState(false);
  const navigate = useNavigate();
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  
  const closeAllModals = () => {
    setShowSizeChart(false);
    setShowHistory(false);
    setShowCart(false);
  };
  
  const openImageModal = (image) => {
    setSelectedImage(image);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
  };

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    shippingAddress: "",
    paymentMethod: "",
    itemsPurchased: [], 
  });  

  useEffect(() => {
    const fetchProducts = async () => {
      const productsCollection = collection(db, "products");
      const snapshot = await getDocs(productsCollection);
      const loadedProducts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(loadedProducts);
    };

    fetchProducts();
  }, []);

  const selectSize = (productId, size) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: size,
    }));
  };

  const addToCart = (product) => {
    const selectedSize = selectedSizes[product.id] || "M";
    const existingItemIndex = cart.findIndex(
      (item) => item.id === product.id && item.size === selectedSize
    );

    if (existingItemIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      setCart((prev) => [...prev, { ...product, size: selectedSize, quantity: 1 }]);
    }
  };

  const increaseQuantity = (index) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity += 1;
    setCart(updatedCart);
  };

  const decreaseQuantity = (index) => {
    const updatedCart = [...cart];
    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;
    } else {
      updatedCart.splice(index, 1);
    }
    setCart(updatedCart);
  };

  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const filteredProducts = products.filter((product) => {
    return (
      (selectedCategory === "All" || product.category === selectedCategory) &&
      (selectedBrand === "All" || product.brand === selectedBrand) &&
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.customerName || !formData.email || !formData.phone || !formData.paymentMethod || !formData.shippingAddress) {
      alert("Please complete all fields.");
      return;
    }
  
    const transactionId = `TXN-${Date.now()}`; 
  
    const itemNames = cart.map(item => item.name);
  
    const orderData = {
      transactionId,
      customerName: formData.customerName,
      email: formData.email,
      phone: formData.phone,
      shippingAddress: formData.shippingAddress,
      paymentMethod: formData.paymentMethod,
      itemsPurchased: itemNames, 
      cartItems: cart.map(item => ({
        productId: item.id,
        name: item.name,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount,
      orderDate: new Date().toISOString(),
      orderType: "shop", // ✅ This ensures the backend processes it as a shop order
    };
    
    try {
      await addDoc(collection(db, "solditems"), orderData);
      console.log("Order successfully added to Firestore!");
    
      sendEmailConfirmation(orderData);
    
      setCart([]);
      setFormData({
        customerName: "",
        email: "",
        phone: "",
        shippingAddress: "",
        paymentMethod: "",
        itemsPurchased: [],
      });
    
      setShowPaymentModal(false);
      setShowConfirmation(true);
    } catch (error) {
      console.error("Error adding order: ", error);
    }    
  };

  return (
    <div className="bg-black text-white min-h-screen w-full p-15"
    style={{ backgroundImage: "url('/src/assets/shopbg1.jpg')" }}>
      <h1 className="text-4xl font-bold text-center -mb-10 uppercase">da Konsept Store</h1>
      <div className="flex justify-between items-center w-full">

      <div className="flex justify-start items-center mb-4 gap-5 flex-wrap">
      <div className="relative">
          <input
            type="text"
            placeholder="Search Items"
            className="px-2 py-1.5 w-75 bg-black text-white border border-red-700 rounded-md focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        </div>
      <div className="flex justify-end items-center mb-4 gap-5 flex-wrap">
        <select
          className="px-2 py-1.5 bg-black text-white/80 border border-red-600 rounded-md w-32"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
        </select>

        <select
          className="px-2 py-1.5 bg-black text-white/80 border border-red-600 rounded-md w-32"
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
        >
          {brands.map((brand, index) => (
            <option key={index} value={brand}>{brand}</option>
          ))}
        </select>
        </div>
        </div>

        <div className="fixed bottom-13 right-1 flex flex-col space-y-1 z-50">
      <div className="relative group">
        <button
          className="p-3 bg-red-600 border-2 border-red-600 rounded-lg hover:bg-red-800 shadow-lg transform transition-all duration-300 hover:translate-x-[-10px]"
          onClick={() => {
            closeAllModals();
            setShowSizeChart(true);
          }}
        >
          <FaRuler className="text-white text-xl" />
        </button>
        <span className="absolute right-full top-1/2 -translate-y-1/2 mr-3 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Size Chart
        </span>
      </div>

      {showSizeChart && (
        <div
          className="fixed bottom-[6%] right-15 inset-0 flex items-center justify-center z-50"
          onClick={closeAllModals}
        >
        </div>
      )}

      <div className="relative group">
          <button
            className="p-3 bg-red-600 border-2 border-red-600 rounded-lg hover:bg-red-800 shadow-lg transform transition-all duration-300 hover:translate-x-[-10px]"
            onClick={() => {
              closeAllModals();
              setShowHistory(true);
            }}
          >
            <FaHistory className="text-white text-xl" />
          </button>
          <span className="absolute right-full top-1/2 -translate-y-1/2 mr-3 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            View History
          </span>
        </div>

        {showHistory && <ShopHistory onClose={closeAllModals} />}

        <div className="relative group">
          <button
            className="p-3 bg-red-600 border-2 border-red-600 rounded-lg hover:bg-red-800 shadow-xl relative transform transition-all duration-300 hover:translate-x-[-10px]"
            onClick={() => {
              closeAllModals();
              setShowCart(true);
            }}
          >
            <FaShoppingCart className="text-white text-xl" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-black text-xs rounded-full px-2">
                {cart.length}
              </span>
            )}
          </button>
          <span className="absolute right-full top-1/2 -translate-y-1/2 mr-3 bg-black/80 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Open Cart
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <motion.div 
            key={product.id} 
            className="bg-zinc-950 border border-red-900 p-4 rounded-lg flex gap-4 items-center"
            whileHover={{ scale: 1.05 }}
          >
            <img 
              src={Array.isArray(product.image) && product.image.length > 1 ? product.image[0] : product.image} 
              alt={product.name} 
              className="w-1/2 h-40 object-cover rounded-lg cursor-pointer"
              onClick={() => openImageModal(product.image)} 
            />

            <div className="w-1/2">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p className="text-lg font-extralight">{product.brand}</p>
              <p className="text-lg font-bold">₱{product.price}</p>

              <div className="grid grid-cols-5 gap-2 mt-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    className={`px-2 py-1 border rounded-md text-xs text-center ${
                      selectedSizes[product.id] === size ? "bg-red-500 text-white" : "bg-gray-700 text-gray-200"
                    }`}
                    onClick={() => selectSize(product.id, size)}
                  >
                    {size}
                  </button>
                ))}
              </div>

              <button 
                className="mt-3 w-full bg-red-600 hover:bg-red-700 text-white p-2 rounded-md"
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {showSizeChart && (
        <div
          className="fixed bottom-[5.5%] right-17 bg-white p-4 rounded-lg w-116 shadow-lg z-50"
          onClick={() => setShowSizeChart(false)}
        >
          <div className="relative" onClick={(e) => e.closeAllModals()}>
            <button
              className="absolute top-2 right-2 text-black hover:text-red-500 hover:scale-115 shadow-lg"
              onClick={() => closeAllModals()}
            >
              <FaTimes size={20} />
            </button>
            <img src="src/assets/tshirtsizechart.jpg" alt="Size Chart" className="w-full rounded-md" />
          </div>
        </div>
      )}

      {showCart && (
        <div className="fixed bg-opacity-50 z-50">
          <div
            className="fixed bottom-[5.5%] right-17 bg-white p-6 rounded-lg max-w-md w-full text-black shadow-lg"
          >
            <button
              className="absolute top-2 right-2 text-black hover:text-red-500 hover:scale-115"
              onClick={() => closeAllModals()}
            >
              <FaTimes size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4">Shopping Cart</h2>

            {cart.length === 0 ? (
              <p className="text-center">Your cart is empty. Fill'em up with the latest trend now!</p>
            ) : (
              <div>
                <ul>
                  {cart.map((item, index) => (
                    <li key={index} className="flex justify-between items-left border-b py-2">
                      <div>
                        <p className="font-semibold">{item.name}</p>
                        <p className="text-sm text-gray-600">Size: {item.size}</p>
                        <p className="text-sm font-bold">₱{item.price * item.quantity}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-1 bg-gray-300 rounded-full" onClick={() => decreaseQuantity(index)}>
                          <FaMinus />
                        </button>
                        <span className="font-semibold">{item.quantity}</span>
                        <button className="p-1 bg-gray-300 rounded-full" onClick={() => increaseQuantity(index)}>
                          <FaPlus />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <h3 className="text-lg font-bold mt-4 bg-white">Total: ₱{totalAmount}</h3>
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

                  {showPaymentModal && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black/90 z-50">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: -50 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: -50 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className="bg-white p-6 rounded-lg max-w-3xl w-full text-black relative flex flex-col md:flex-row gap-6 border-4 border-red-600 shadow-lg"
                    >
                      <button
                        className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                        onClick={() => setShowPaymentModal(false)}
                      >
                        <FaTimes size={20} />
                      </button>

                      <div className="flex-1">
                        <h2 className="text-xl font-semibold mb-4 text-red-600">Payment Details</h2>
                        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>

                          {["customerName", "shippingAddress", "email", "phone"].map((field) => (
                            <div key={field} className="flex flex-col">
                              <label className="text-sm font-medium text-left text-black/70">
                                {field === "customerName" ? "Full Name (First Name, Last Name)" :
                                field === "shippingAddress" ? "Shipping Address" :
                                field === "email" ? "Email Address" :
                                "Phone Number"}
                              </label>
                              <input
                                type={field === "email" ? "email" : "text"} 
                                name={field}
                                className="p-2 w-full bg-gray-200 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                value={formData[field]}
                                onChange={handleChange}
                              />
                            </div>
                          ))}

                          <div className="flex flex-col">
                            <label className="text-sm font-medium text-left text-black/70">Payment Method</label>
                            <select
                              name="paymentMethod"
                              className="p-3 w-full bg-gray-200 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                              value={formData.paymentMethod}
                              onChange={handleChange}
                            >
                              <option>Select Payment Method</option>
                              <option value="Cash on Delivery">Via LBC - PICK-UP</option>
                              <option value="GCash">GCash</option>
                            </select>
                          </div>

                          {formData.paymentMethod === "GCash" && (
                            <div className="flex flex-col">
                              <label className="text-sm font-medium text-left text-black/70">Upload GCash Receipt</label>
                              <input
                                type="file"
                                name="receipt"
                                accept="image/*"
                                className="p-3 w-full bg-gray-200 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                                onChange={handleChange}
                              />
                            </div>
                          )}
                          <button
                            type="submit"
                            className="bg-red-600 text-white p-3 rounded-md font-bold hover:bg-red-700"
                            onClick={async (e) => {
                              e.preventDefault();
                              setShowPaymentModal(false);
                              setShowConfirmation(true);

                              try {
                                let receiptURL = null;

                                if (formData.paymentMethod === "GCash" && formData.receipt) {
                                  const receiptRef = ref(storage, `receipts/${Date.now()}-${formData.receipt.name}`);
                                  await uploadBytes(receiptRef, formData.receipt);
                                  receiptURL = await getDownloadURL(receiptRef);
                                }

                                const transactionId = `TXN-${Date.now()}`;

                                const orderData = {
                                  transactionId,
                                  orderDate: new Date().toISOString(),
                                  customerName: formData.customerName,
                                  email: formData.email,
                                  phone: formData.phone,
                                  shippingAddress: formData.shippingAddress,
                                  paymentMethod: formData.paymentMethod,
                                  totalAmount: cart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0),
                                  gcashReceipt: receiptURL || null,
                                  status: "Pending",
                                  cartItems: cart.map((item) => ({
                                    name: item.name,
                                    price: item.price,
                                    productId: item.productId || "",
                                    quantity: item.quantity,
                                    size: item.size,
                                  })),
                                  itemsPurchased: cart.map((item) => item.name),
                                  orderType: "shop",
                                };

                                await addDoc(collection(db, "solditems"), orderData);
                                console.log("Order successfully added to Firestore!", orderData);

                                try {
                                  const response = await axios.post("http://localhost:5000/send-email", orderData);
                                  console.log("Email sent successfully:", response.data);
                                } catch (emailError) {
                                  console.error("Error sending confirmation email:", emailError);
                                }

                                setCart([]);
                                setFormData({
                                  customerName: "",
                                  email: "",
                                  phone: "",
                                  shippingAddress: "",
                                  paymentMethod: "",
                                  itemsPurchased: [],
                                });

                              } catch (error) {
                                console.error("Error processing order:", error);
                              }
                            }}
                          >
                            Confirm Payment
                          </button>
                        </form>
                      </div>

                      <div className="bg-gray-100 p-4 rounded-lg flex-1">
                        <h2 className="text-lg font-semibold mb-4 text-red-600">Your Cart 🛒</h2>
                        <div className="max-h-80 overflow-y-auto">
                          {cart.length === 0 ? (
                            <p className="text-center">Your cart is empty.</p>
                          ) : (
                            cart.map((item, index) => (
                              <div key={index} className="flex items-center border-b pb-3 mb-3">
                                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg mr-3" />
                                <div className="flex-1">
                                  <p className="font-semibold">{item.name}</p>
                                  <p className="text-sm text-gray-600">{item.brand}</p>
                                  <p className="text-sm font-bold">₱{item.price} x {item.quantity}</p>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                        <h3 className="text-lg font-bold mt-4 border-t pt-2">Total: ₱{totalAmount}</h3>
                        <p className="text-left text-black/50">
                          Note: we only use LBC as our main courier for orders outside Cebu City and other neighboring Cities and Towns.
                        </p>

                        {formData.paymentMethod === "GCash" && (
                          <div className="mt-4 text-center">
                            <h3 className="text-lg font-semibold text-red-600">Scan to Pay via GCash</h3>
                            <img src="src\assets\rapolloqr.png" alt="GCash QR Code" className="w-40 h-40 mx-auto mt-2 border-2  rounded-2xl" />
                          </div>
                        )}
                      </div>

                    </motion.div>
                  </div>
                )}

                  {showAuthAlert && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/90 bg-opacity-80 z-50">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: -50 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: -50 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="bg-white text-black p-6 rounded-lg shadow-lg max-w-sm w-full text-center border-4 border-red-600"
                      >
                        <h2 className="text-2xl font-extrabold uppercase text-red-600 animate-pulse">
                          Yo! Hold Up! 🚨
                        </h2>
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
                  {showConfirmation && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black/90 bg-opacity-50">
                      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <h2 className="text-lg font-bold text-red-600">Order Confirmed! 🎉</h2>
                        <p className="mt-2">Thank you!</p>
                        <button
                          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                          onClick={() => setShowConfirmation(false)}
                        >
                          Got it! 👍
                        </button>
                      </div>
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>
      )}
      {showImageModal && (
        <div 
          className="fixed inset-0 flex items-center justify-center bg-black/80"
          onClick={closeImageModal}
        >
          <div 
            className="relative bg-black p-6 rounded-lg max-w-lg w-full"
            onClick={(e) => e.stopPropagation()} 
          >
            <button 
              className="absolute top-2 right-2 text-white hover:text-red-500 hover:scale-150"
              onClick={closeImageModal}
            >
              <FaTimes size={20} />
            </button>
            <img src={selectedImage} alt="Product Preview" className="w-full rounded-lg" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
