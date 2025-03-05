import React, { useEffect, useState } from "react";
import { db } from "../firebase"; // Firestore instead of database
import { collection, getDocs } from "firebase/firestore";

const Emcees = () => {
  const [emcees, setEmcees] = useState([]);

  useEffect(() => {
    const fetchEmcees = async () => {
      const emceesCollection = collection(db, "emcees"); // Reference Firestore collection
      const emceesSnapshot = await getDocs(emceesCollection);
      const emceeList = emceesSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setEmcees(emceeList);
    };

    fetchEmcees();
  }, []);

  return (
    <div className="w-full min-h-screen bg-black text-white font-sans py-12 text-center">
      <div className="flex justify-center">
        <h1 className="text-4xl font-bold text-white text-center mb-8">Featured Emcees</h1>
      </div>
      <div className="flex flex-wrap justify-center gap-6">
        {emcees.map((emcee) => (
          <div
            key={emcee.id}
            className="flex w-[500px] bg-white/10 p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105"
          >
            <img
              src={emcee.image}
              alt={emcee.name}
              className="w-28 h-28 rounded-lg object-cover mr-4"
            />
            <div className="text-left flex-1">
              <h2 className="text-2xl font-bold text-white mb-1">{emcee.name}</h2>
              <p className="text-gray-300 text-sm">
                <strong>Hometown:</strong> {emcee.hometown}
              </p>
              <p className="text-gray-300 text-sm">
                <strong>Reppin':</strong> {emcee.reppin}
              </p>
              <p className="text-white text-xs mt-2 text-justify">{emcee.background}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Emcees;
