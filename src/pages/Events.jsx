import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase"; 
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { FaChevronLeft, FaChevronRight, FaPlayCircle } from "react-icons/fa";

const Events = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const indexOfLastEvent = currentPage * itemsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - itemsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / itemsPerPage);
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
    let updatedEvents = events;
  
    if (selectedYear !== "All") {
      updatedEvents = updatedEvents.filter((event) => 
        new Date(event.year).getFullYear().toString() === selectedYear
      );
    }
  
    if (searchQuery) {
      updatedEvents = updatedEvents.filter((event) =>
        event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
  
    setFilteredEvents(updatedEvents);
  }, [selectedYear, searchQuery, events]);
  

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
        <p className="text-white/50 mt-2 text-stroke">Stay updated with our latest upcoming events. Don't miss out on the excitement!</p>
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

      <div className="flex gap-10 bg-black/70 shadow-lg shadow-black rounded-3xl p-6">
        <div className="w-full">
        <div className="mb-4">
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="p-2 w-full border border-gray-500 rounded-lg text-white"
            />
          </div>
          <h3 className="text-4xl font-bold text-stroke1 text-white mb-4">EVENTS GALLERY</h3>
          {filteredEvents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-black/70 text-left">
                    <th className="p-4 text-white text-center text-xl font-bold border-b border-white/5">Photo</th>
                    <th className="p-4 text-white text-center text-l font-bold border-b border-white/5">Event Name</th>
                    <th className="p-4 text-white text-center text-xl font-bold border-b border-white/5">Description</th>
                    <th className="p-4 text-white text-center text-xl font-bold border-b border-white/5">Playlist</th>
                  </tr>
                </thead>
                <tbody>
                  {currentEvents.map((event, index) => (
                    <tr key={index} className="hover:bg-black transition">
                      <td className="p-4 border-b border-gray-700">
                        <img
                          src={event.photo}
                          alt={event.name}
                          className="w-[400px] h-[100px] object-cover rounded-lg border-2 border-white/5"
                        />
                      </td>
                      <td className="p-4 text-xl font-bold border-b text-white">{event.name}</td>
                      <td className="p-4 text-lg border-b text-gray-300">{event.description}</td>
                      <td className="p-4 border-b text-center">
                      <button
                        className="text-red-600 hover:text-red-400 cursor-pointer transition text-4xl"
                        onClick={() => setYoutubeEvent(event)}
                      >
                        <FaPlayCircle />
                      </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

            </div>
          ) : (
            <p className="text-gray-400">No events found for {selectedYear}.</p>
          )}
        </div>

        <div className="w-1/15 flex flex-col text-lg font-semibold space-y-2 sticky top-0 p-4">
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

      <div className="flex justify-center gap-3 py-3 shadow-md mt-5">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="p-2 bg-red-700 text-white rounded-lg disabled:opacity-50"
        >
          <FaChevronLeft />
        </button>

        <div className="flex gap-1">
          {Array.from({ length: totalPages }, (_, i) => (
            <span
              key={i}
              className={`text-xl ${currentPage === i + 1 ? "text-red-700" : "text-gray-400"}`}
            >
              ●
            </span>
          ))}
        </div>

        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="p-2 bg-red-700 text-white rounded-lg disabled:opacity-50"
        >
          <FaChevronRight />
        </button>
      </div>


      {youtubeEvent && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/75 bg-opacity-80 z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) setYoutubeEvent(null);
          }}
        >
          <div className="bg-black border-red-500 border-3 p-6 rounded-lg w-[90%] md:w-[60%] lg:w-[50%] relative">
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
