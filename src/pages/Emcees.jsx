import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Emcees = () => {
  const [emcees, setEmcees] = useState([]);
  const [filteredEmcees, setFilteredEmcees] = useState([]);
  const [selectedEmcee, setSelectedEmcee] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const emceesPerPage = 6; 
  const totalPages = Math.ceil(filteredEmcees.length / emceesPerPage);


  useEffect(() => {
    const fetchEmcees = async () => {
      const emceesCollection = collection(db, "emcees");
      const emceesSnapshot = await getDocs(emceesCollection);
      const emceeList = emceesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEmcees(emceeList);
      setFilteredEmcees(emceeList);
    };

    fetchEmcees();
  }, []);

  useEffect(() => {
    let sortedEmcees = [...emcees];

    if (searchTerm) {
      sortedEmcees = sortedEmcees.filter((emcee) =>
        emcee.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    sortedEmcees.sort((a, b) => {
      if (sortOrder === "asc") return a.name.localeCompare(b.name);
      return b.name.localeCompare(a.name);
    });

    setFilteredEmcees(sortedEmcees);
    setCurrentPage(1);
  }, [searchTerm, sortOrder, emcees]);

  const indexOfLastEmcee = currentPage * emceesPerPage;
  const indexOfFirstEmcee = indexOfLastEmcee - emceesPerPage;
  const currentEmcees = filteredEmcees.slice(indexOfFirstEmcee, indexOfLastEmcee);

  return (
    <div className="w-full min-h-screen bg-black text-white font-hanuman pt-12"
      style={{ backgroundImage: "url('/src/assets/emceebg1.jpg')" }}>
      <div className="flex justify-center mb-6">
        <h1 className="text-5xl font-bold text-red-500">Featured Emcees</h1>
      </div>

      <div className="fixed top-24 left-8 flex items-center gap-4">
      <input
        type="text"
        placeholder="Search emcees..."
        className="p-2 w-72 bg-black text-white border border-red-700 rounded-lg focus:outline-none"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button
        className="p-2 bg-red-700 text-white rounded-lg hover:bg-red-600 transition"
        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
      >
        Sort {sortOrder === "asc" ? "Z-A" : "A-Z"}
      </button>
    </div>


      <div className="flex flex-wrap justify-center gap-6 mt-12">
        {currentEmcees.length > 0 ? (
          currentEmcees.map((emcee) => (
            <div
              key={emcee.id}
              className="flex w-[500px] bg-zinc-900 p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105 cursor-pointer"
              onClick={() => setSelectedEmcee(emcee)}
            >
              <img
                src={emcee.image}
                alt={emcee.name}
                className="w-28 h-28 rounded-lg object-cover mr-4"
              />
              <div className="text-left flex-1">
                <h2 className="text-2xl font-bold text-red-500 mb-1">{emcee.name}</h2>
                <p className="text-gray-300 text-sm">
                  <strong>Hometown:</strong> {emcee.hometown}
                </p>
                <p className="text-gray-300 text-sm">
                  <strong>Reppin':</strong> {emcee.reppin}
                </p>
                <p className="text-white text-xs mt-2 text-justify line-clamp-4">{emcee.background}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center w-full">No emcees found.</p>
        )}
      </div>

      <div className="fixed bottom-10 left-0 w-full flex justify-center gap-3 py-3 shadow-md z-50">
        <button
          className="p-2 bg-red-700 text-white rounded-lg disabled:opacity-50"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <FaChevronLeft />
        </button>

        <div className="flex gap-1">
          {Array.from({ length: totalPages }, (_, index) => (
            <span
              key={index}
              className={`text-xl ${currentPage === index + 1 ? "text-red-700" : "text-gray-400"}`}
            >
              ●
            </span>
          ))}
        </div>

        <button
          className="p-2 bg-red-700 text-white rounded-lg disabled:opacity-50"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={indexOfLastEmcee >= filteredEmcees.length}
        >
          <FaChevronRight />
        </button>
      </div>

      {selectedEmcee && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50">
          <div className="bg-black p-6 rounded-lg shadow-lg text-white w-4/5 h-2/5 max-w-3xl flex items-center relative">
            <button
              className="absolute top-2 right-2 text-white hover:text-3xl hover:text-red-600 text-2xl cursor-pointer"
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
              <h2 className="text-3xl text-white bg-red-700 font-bold mb-2">{selectedEmcee.name}</h2>
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
    </div>
  );
};

export default Emcees;
