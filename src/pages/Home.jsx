import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "../firebase"; 
import { motion } from "framer-motion";
import AboutImage from "/src/assets/aboutus1.jpg";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [emcees, setEmcees] = useState([]);
  const [selectedEmcee, setSelectedEmcee] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchBestSellers = async () => {
      const productsCollection = collection(db, "products");
      const snapshot = await getDocs(productsCollection);
      const loadedProducts = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const bestSellingProducts = loadedProducts
        .sort((a, b) => b.sales - a.sales)
        .slice(0, 4);

      setProducts(bestSellingProducts);
    };

    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "events"));
        const eventsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
  
        const sortedEvents = eventsList.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
  
        setEvents(sortedEvents.slice(0, 3));
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
  
    const fetchEmcees = async () => {
      try {
        const q = query(collection(db, "emcees"), limit(6));
        const querySnapshot = await getDocs(q);
        const emceeList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEmcees(emceeList);
      } catch (error) {
        console.error("Error fetching emcees:", error);
      }
    };
    
    fetchBestSellers();
    fetchEvents();
    fetchEmcees();
  }, []);

  return (
    <div className="home-container w-full min-h-screen bg-black text-white font-hanuman">
      
      <section
        className="relative w-full h-[100vh] flex flex-col justify-center items-center bg-cover bg-center"
        style={{backgroundImage: "url('/src/assets/HomeBG1.jpg')" }}
      >
      </section>

      <section className="relative w-full h-[100vh] flex flex-col justify-center items-center bg-cover bg-center">
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center opacity-30" 
          style={{ backgroundImage: `url(${AboutImage})` }}
        ></div>

        <div className="relative z-10 px-6 text-center">
          <h2 className="text-4xl font-bold uppercase text-red-500">About Us</h2>
          <p className="max-w-3xl mx-auto mt-4 text-3xl text-gray-300">
            Rapollo is Cebu's pioneering hip-hop battle league, creating a platform for MCs to showcase
            their skills and push the VisMin rap scene forward. More than just rap battles, we celebrate
            all elements of hip-hop—MCing, DJing, breaking, and graffiti.
          </p>
        </div>
      </section>

      <section className="w-full h-[100vh] py-16 bg-black text-center"
      style={{backgroundImage: "url('/src/assets/eventsbg.jpg')" }}>
        <h2 className="text-4xl font-bold uppercase text-red-500">Rapollo Exclusive Events</h2>
        <p className="max-w-3xl mx-auto mt-4 text-gray-300">
          Stay updated with our latest events. Don't miss out on the excitement!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full px-6 mt-6">
          {events.length > 0 ? (
            events.map((event) => (
              <motion.div
                key={event.id}
                className="bg-zinc-900 border border-white/20 rounded-lg p-4 hover:scale-105 transition-transform"
                whileHover={{ scale: 1.05 }}
              >
                <Link to="/events"><img
                  src={event.photo}
                  alt={event.name}
                  className="w-full h-48 object-cover rounded-lg border-4 border-white/5"
                /></Link>
                <h4 className="text-lg font-bold mt-3">{event.name}</h4>
                <p className="text-gray-300 text-sm">{event.description}</p>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-400">No events found for 2025.</p>
          )}
        </div>
      </section>

      <section className="w-full h-[100vh] py-16 bg-black text-center relative">
        <h2 className="text-4xl font-bold uppercase text-red-500">Featured Emcees</h2>
        <div className="flex flex-wrap justify-center gap-6 mt-6 px-6">
          {emcees.length > 0 ? (
            emcees.slice(0, 6).map((emcee) => ( 
              <div
                key={emcee.id}
                className="flex w-[500px] bg-white/10 p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 cursor-pointer"
                onClick={() => setSelectedEmcee(emcee)}
              >
                <img
                  src={emcee.image}
                  alt={emcee.name}
                  className="w-28 h-28 rounded-lg object-cover mr-4"
                />
                <div className="text-left flex-1">
                  <h2 className="text-2xl font-bold text-white mb-1">{emcee.name}</h2>
                  <p className="text-gray-300 text-sm"><strong>Hometown:</strong> {emcee.hometown}</p>
                  <p className="text-gray-300 text-sm"><strong>Reppin':</strong> {emcee.reppin}</p>
                  <p className="text-white text-xs mt-2 text-justify">{emcee.background.slice(0, 80)}...</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No emcees found.</p>
          )}
        </div>

  <Link
    to="/emcees"
    className="inline-block mt-6 px-6 py-3 bg-white text-black font-bold rounded-lg border-2 border-black hover:bg-gray-200 transition"
  >
    See All Emcees
  </Link>

        {selectedEmcee && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
            <div className="bg-black p-6 rounded-lg shadow-lg text-white w-4/5 h-2/5 max-w-3xl flex items-center relative">
              <button
                className="absolute top-2 right-2 text-white text-2xl"
                onClick={() => setSelectedEmcee(null)}
              >
                &times;
              </button>

              <div className="w-1/3 flex justify-center">
                <img
                  src={selectedEmcee.image}
                  alt={selectedEmcee.name}
                  className="w-48 h-48 rounded-lg object-cover"
                />
              </div>
              
              <div className="w-2/3 pl-6">
                <h2 className="text-3xl font-bold mb-2">{selectedEmcee.name}</h2>
                <p className="text-gray-300 text-sm mb-2">
                  <strong>Hometown:</strong> {selectedEmcee.hometown}
                </p>
                <p className="text-gray-300 text-sm mb-2">
                  <strong>Reppin':</strong> {selectedEmcee.reppin}
                </p>
                <p className="text-gray-400 text-sm mt-2 text-justify overflow-y-auto h-[200px]">
                  {selectedEmcee.background}
                </p>
              </div>
            </div>
          </div>
        )}

        <section className="w-full py-16 bg-black text-center">
        <h2 className="text-4xl font-bold uppercase text-red-500">Best Sellers</h2>
        <p className="max-w-3xl mx-auto mt-4 text-gray-300">
          Check out our hottest selling merch! Get yours before they're gone.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full px-6 mt-6">
          {products.map((product) => (
            <Link to="/shop" key={product.id}>
              <motion.div
                className="bg-white/10 p-4 rounded-lg border border-white/25 shadow-lg cursor-pointer hover:scale-105 transition-transform"
                whileHover={{ scale: 1.05 }}
              >
                <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-lg" />
                <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
                <p className="text-gray-400 text-sm">{product.category}</p>
              </motion.div>
            </Link>
          ))}
        </div>

        <Link
          to="/shop"
          className="inline-block mt-6 px-6 py-3 bg-white text-black font-bold font-hanuman rounded-lg border-2 border-black hover:bg-gray-200 transition"
        >
          Shop Now
        </Link>
      </section>
      </section>
      
    </div>
  );
};

export default Home;
