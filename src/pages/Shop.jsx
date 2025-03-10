import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaSearch, FaShoppingCart, FaRuler, FaTimes, FaPlus, FaMinus } from "react-icons/fa";
import { db } from "../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";

const Shop = () => {
  const categories = ["All", "T-Shirts", "Hoodies", "Caps", "Accessories"];
  const brands = ["All", "Atraxia", "BLVCK MNL", "FlipTop", "Rapollo", "RealJokes"];
  const sizes = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState({});
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);


  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    shippingAddress: "",
    paymentMethod: "",
    itemsPurchased: [], // New field to store item names
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
  
    if (!formData.fullName || !formData.email || !formData.phone || !formData.paymentMethod || !formData.shippingAddress) {
      alert("Please complete all fields.");
      return;
    }
  
    const transactionId = `TXN-${Date.now()}`; // Generate a unique transaction ID
  
    // Extract item names from cart
    const itemNames = cart.map(item => item.name);
  
    const orderData = {
      transactionId,
      customerName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      shippingAddress: formData.shippingAddress,
      paymentMethod: formData.paymentMethod,
      itemsPurchased: itemNames, // Store item names
      cartItems: cart.map(item => ({
        productId: item.id,
        name: item.name,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
      })),
      totalAmount,
      orderDate: new Date().toISOString(),
    };
  
    try {
      await addDoc(collection(db, "solditems"), orderData);
      console.log("Order successfully added to Firestore!");
  
      sendEmailConfirmation(orderData); // Send email after order
  
      setCart([]);
      setFormData({
        fullName: "",
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
    <div className="bg-black text-white min-h-screen w-full p-10">
      <h1 className="text-4xl font-bold text-center mb-10 uppercase">d'Konsept Store</h1>

      <div className="flex justify-between items-center mb-6 gap-4">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full p-2 pl-10 bg-gray-800 text-white border border-gray-600 rounded-lg focus:outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>

        <select
          className="p-2 bg-gray-800 text-white border border-gray-600 rounded-lg"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((category, index) => (
            <option key={index} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          className="p-2 bg-gray-800 text-white border border-gray-600 rounded-lg"
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
        >
          {brands.map((brand, index) => (
            <option key={index} value={brand}>
              {brand}
            </option>
          ))}
        </select>

        <button
          className="relative p-3 bg-blue-600 rounded-full hover:bg-blue-800"
          onClick={() => setShowSizeChart((prev) => !prev)}><FaRuler />
        </button>

        <button
          className="relative p-3 bg-red-600 rounded-full hover:bg-red-800"
          onClick={() => setShowCart((prev) => !prev)}
        >
          <FaShoppingCart />
          {cart.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-white text-black text-xs rounded-full px-2">
              {cart.length}
            </span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <motion.div key={product.id} className="bg-gray-900 p-4 rounded-lg" whileHover={{ scale: 1.05 }}>
            <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-lg" />
            <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
            <p className="text-lg font-extralight mt-2">{product.brand}</p>
            <p className="text-lg font-bold mt-2">₱{product.price}</p>

            <div className="flex gap-2 mt-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  className={`px-2 py-1 border rounded-md text-sm ${
                    selectedSizes[product.id] === size ? "bg-green-500 text-white" : "bg-gray-700 text-gray-200"
                  }`}
                  onClick={() => selectSize(product.id, size)}
                >
                  {size}
                </button>
              ))}
            </div>

            <button className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded-md" onClick={() => addToCart(product)}>
              Add to Cart
            </button>
          </motion.div>
        ))}
      </div>

      {showSizeChart && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-opacity-80"
          onClick={() => setShowSizeChart(false)} 
        >
          <div
            className="bg-white p-6 rounded-lg max-w-lg w-full text-black relative"
            onClick={(e) => e.stopPropagation()} 
          >
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={() => setShowSizeChart(false)}
            >
              <FaTimes size={20} />
            </button>
            <img src="src/assets/tshirtsizechart.jpg" alt="Size Chart" className="w-full" />
          </div>
        </div>
      )}

      {showCart && (
        <div className="fixed bg-opacity-50">
          <div
            className="fixed bottom-[10%] right-5 bg-white p-6 rounded-lg max-w-md w-full text-black shadow-lg"
          >
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={() => setShowCart(false)}
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
                    <li key={index} className="flex justify-between items-center border-b py-2">
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
                <h3 className="text-lg font-bold mt-4">Total: ₱{totalAmount}</h3>
                <button
                  className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white p-3 rounded-md font-bold"
                  onClick={() => setShowPaymentModal(true)}>
                  Proceed to Payment
                </button>
                {showPaymentModal && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80">
                    <div className="bg-white p-6 rounded-lg max-w-3xl w-full text-black relative flex flex-col md:flex-row gap-6">
                      {/* Close Button */}
                      <button
                        className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                        onClick={() => setShowPaymentModal(false)}
                      >
                        <FaTimes size={20} />
                      </button>

                      {/* Payment Form (Left Side) */}
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
                        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                          <input
                            type="text"
                            name="fullName"
                            placeholder="Full Name (First Name, Last Name)"
                            className="p-3 bg-gray-200 border border-gray-400 rounded-md focus:outline-none"
                            value={formData.fullName}
                            onChange={handleChange}
                          />
                          <input
                            type="text"
                            name="shippingAddress"
                            placeholder="Shipping Address"
                            className="p-3 bg-gray-200 border border-gray-400 rounded-md focus:outline-none"
                            value={formData.shippingAddress}
                            onChange={handleChange}
                          />
                          <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            className="p-3 bg-gray-200 border border-gray-400 rounded-md focus:outline-none"
                            value={formData.email}
                            onChange={handleChange}
                          />
                          <input
                            type="text"
                            name="phone"
                            placeholder="Phone Number"
                            className="p-3 bg-gray-200 border border-gray-400 rounded-md focus:outline-none"
                            value={formData.phone}
                            onChange={handleChange}
                          />
                          <select
                            name="paymentMethod"
                            className="p-3 bg-gray-200 border border-gray-400 rounded-md focus:outline-none"
                            value={formData.paymentMethod}
                            onChange={handleChange}
                          >
                            <option value="">Select Payment Method</option>
                            <option value="GCash">GCash</option>
                            <option value="Cash on Delivery">Cash on Delivery</option>
                          </select>

                          {/* Show receipt upload input if GCash is selected */}
                          {formData.paymentMethod === "GCash" && (
                            <div>
                              <label className="block text-sm font-medium">Upload GCash Receipt</label>
                              <input
                                type="file"
                                name="receipt"
                                accept="image/*"
                                className="p-2 bg-gray-200 border border-gray-400 rounded-md focus:outline-none"
                                onChange={handleChange}
                              />
                            </div>
                          )}

                          <button
                            type="submit"
                            className="bg-green-600 text-white p-3 rounded-md font-bold hover:bg-green-700"
                          >
                            Confirm Payment
                          </button>
                        </form>
                      </div>

                      {/* Cart Items (Right Side) */}
                        <div className="bg-gray-100 p-4 rounded-lg flex-1">
                          <h2 className="text-lg font-semibold mb-4">Your Cart</h2>
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
                          {/* Total Price */}
                          <h3 className="text-lg font-bold mt-4 border-t pt-2">Total: ₱{totalAmount}</h3>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Confirmation Pop-up */}
                  {showConfirmation && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
                        <h2 className="text-lg font-bold text-green-600">Order Confirmed! 🎉</h2>
                        <p className="mt-2">Yo! Check your email for the details, aight? 📩</p>
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
    </div>
  );
};

export default Shop;
