import { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import { db, auth } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const ShopHistory = ({ onClose }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      if (!auth.currentUser) return;
      const userEmail = auth.currentUser.email;

      const q = query(collection(db, "solditems"), where("email", "==", userEmail));
      const querySnapshot = await getDocs(q);

      const transactions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setHistory(transactions);
    };

    fetchHistory();
  }, []);

  return (
    <div className="fixed bottom-[5%] right-17 z-50 w-[90%] h-[16%] max-w-md bg-white p-4 rounded-lg shadow-lg" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg w-full text-black relative" onClick={(e) => e.stopPropagation()}>
        <button className="absolute top-1 right-1 text-gray-600 hover:text-red-500 hover:scale-115" onClick={onClose}>
          <FaTimes size={20} />
        </button>
        <h2 className="text-xl font-semibold mb-4">Transaction History</h2>

        {history.length === 0 ? (
          <p className="text-center text-gray-500">No transaction history found.</p>
        ) : (
          <ul className="space-y-4 max-h-64 overflow-y-auto">
            {history.map((order) => (
              <li key={order.id} className="border-b pb-2">
                {order.cartItems.map((item, index) => (
                  <div key={index} className="text-sm">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-xs text-gray-600">Size: {item.size} | Qty: {item.quantity}</p>
                    <p className="text-xs font-bold">₱{item.price * item.quantity}</p>
                  </div>
                ))}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ShopHistory;
