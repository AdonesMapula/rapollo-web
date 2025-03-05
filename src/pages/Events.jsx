import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase"; 
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedYear, setSelectedYear] = useState("All");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [youtubeEvent, setYoutubeEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "events"));
        const eventList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setEvents(eventList);
        setFilteredEvents(eventList);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const years = [...new Set(events.map((event) => new Date(event.year).getFullYear()))].sort((a, b) => b - a);

  useEffect(() => {
    if (selectedYear === "All") {
      setFilteredEvents(events);
    } else {
      setFilteredEvents(events.filter((event) => new Date(event.year).getFullYear().toString() === selectedYear));
    }
  }, [selectedYear, events]);

  const events2024 = events.filter((event) => new Date(event.year).getFullYear() === 2024);

  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % events2024.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + events2024.length) % events2024.length);

  return (
    <div
      className="bg-black text-white min-h-screen w-full bg-cover bg-center bg-fixed font-hanuman p-10"
      style={{ backgroundImage: "url('/src/assets/rapollogif.gif')" }}
    >
      <div className="text-center mb-10">
        <h2 className="text-red-600 text-3xl font-bold text-stroke">RECENT EVENTS</h2>
        <p className="text-gray-400 mt-2 text-stroke">Stay updated with our latest upcoming events. Don't miss out on the excitement!</p>
      </div>

      {events2024.length > 0 && (
        <div className="relative w-full max-w-2xl mx-auto mb-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="relative p-6 text-center"
            >
              <img
                src={events2024[currentIndex].photo}
                alt={events2024[currentIndex].name}
                className="w-full max-h-50 object-cover rounded-lg border-4 border-white"
              />
            </motion.div>
          </AnimatePresence>

          {events2024.length > 1 && (
            <div className="absolute top-1/2 left-0 right-0 flex justify-between px-4">
              <button onClick={prevSlide} className="text-white text-stroke bg-gray-700 p-2 rounded-full hover:bg-gray-600">
                ❮
              </button>
              <button onClick={nextSlide} className="text-white text-stroke bg-gray-700 p-2 rounded-full hover:bg-gray-600">
                ❯
              </button>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-10">
        <div className="w-70%">
          <h3 className="text-4xl font-bold text-stroke1 text-white mb-4">EVENTS GALLERY</h3>

          <div className="space-y-6 text-stroke1">
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event, index) => (
                <div key={index} className="flex items-center p-5 space-x-5">
                  <img
                    src={event.photo}
                    alt={event.name}
                    className="w-75 h-75 object-cover rounded-lg border-4 border-white cursor-pointer hover:opacity-80"
                    onClick={() => setYoutubeEvent(event)}
                  />
                  <div className="text-left">
                    <h4 className="text-3xl font-bold">{event.name}</h4>
                    <p className="text-gray-300 text-2xl">{event.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No events found for {selectedYear}.</p>
            )}
          </div>
        </div>

        {/* Year Filter Buttons */}
        <div className="w-1/4 flex flex-col text-lg font-semibold space-y-2">
          <button
            onClick={() => setSelectedYear("All")}
            className={`transition-all duration-300 ${
              selectedYear === "All" ? "text-red-500 border-b-2 border-red-500" : "text-gray-400 hover:text-white"
            }`}
          >
            All
          </button>

          {years.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year.toString())}
              className={`transition-all duration-300 ${
                selectedYear === year.toString() ? "text-red-500 border-b-2 border-red-500" : "text-gray-400 hover:text-white"
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      {/* YouTube Video Popup */}
      {youtubeEvent && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
          <div className="bg-gray-900 p-6 rounded-lg w-[90%] md:w-[60%] lg:w-[50%] relative">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
              onClick={() => setYoutubeEvent(null)}
            >
              <IoClose size={24} />
            </button>

            <h3 className="text-xl font-bold text-center text-red-500 mb-4">{youtubeEvent.name}</h3>

            <div className="relative w-full pt-[56.25%]">
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                src={`https://www.youtube.com/embed?listType=playlist&list=${youtubeEvent.youtubePlaylistId}`}
                name={youtubeEvent.name}
                allowFullScreen
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
