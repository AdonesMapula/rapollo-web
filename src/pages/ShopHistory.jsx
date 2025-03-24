import { useEffect, useState } from "react";
import { FaTimes, FaRegClock, FaRegCalendarAlt, FaPen } from "react-icons/fa";
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
    <div className="fixed bottom-[5%] right-17 z-50 w-[90%] max-w-md bg-white p-4 rounded-lg shadow-lg" onClick={onClose}>
      <div className="bg-white p-6 rounded-lg w-full text-red-600 font-bold relative" onClick={(e) => e.stopPropagation()}>
        <button className="absolute top-1 right-1 text-gray-600 hover:text-red-500 hover:scale-115" onClick={onClose}>
          <FaTimes size={20} />
        </button>
        <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>

        {history.length === 0 ? (
        <p className="text-center text-gray-500">No order history found.</p>
        ) : (
        <div className="max-h-64 overflow-y-auto space-y-4">
            {history
            .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))
            .map((order) => {
                let statusLabel = "Completed";
                let statusColor = "bg-green-600";

                if (order.status === "Pending") {
                statusLabel = "Processing";
                statusColor = "bg-yellow-600";
                } else if (order.status === "Approved") {
                statusLabel = "En Route";
                statusColor = "bg-blue-600";
                } else if (order.status === "Declined") {
                statusLabel = "Cancelled";
                statusColor = "bg-red-600";
                }

                return (
                <div key={order.id} className="border border-s border-black/10 bg-white text-white p-4 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-2 ">
                    <h3 className="text-red-600 font-semibold text-lg">
                        Order Date: {order.orderDate ? order.orderDate.split("T")[0] : "N/A"}
                    </h3>
                    <span className={`px-3 py-1 text-xs font-semibold rounded ${statusColor}`}>
                        {statusLabel}
                    </span>
                    </div>

                    <div className="space-y-2">
                    {order.cartItems.map((item, index) => (
                        <div key={`${order.id}-${index}`} className="bg-white border border-s border-black/10 text-black p-3 rounded-md shadow">
                        <p className="font-bold text-red-600">{item.name}</p>
                        <p className="text-xs text-gray-700">Size: {item.size} | Qty: {item.quantity}</p>
                        <p className="text-sm font-semibold">₱{item.price * item.quantity}</p>
                        </div>
                    ))}
                    </div>
                </div>
                );
            })}
        </div>
        )}
      </div>
    </div>
  );
};

export default ShopHistory;
