import { useState } from "react";
import { FaArrowLeft, FaCheckCircle, FaTimes } from "react-icons/fa";

export default function TermsAndConditionsModal({ isOpen, onClose, onAccept }) {
  const [accepted, setAccepted] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div className="bg-gray-900 w-[30rem] p-6 rounded-lg shadow-lg border border-gray-700">
      <div className="flex justify-between items-center border-b border-gray-700 pb-3">
        <h2 className="text-lg font-semibold text-white">Terms and Conditions</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-red-500">
          <FaTimes size={18} />
        </button>
      </div>

      <div className="max-h-80 overflow-y-auto p-3 text-sm border rounded-md bg-white/10 mt-4 text-gray-300">
        <h3 className="text-lg font-semibold text-white">Clothing & Merchandise</h3>
        <p className="mt-2">
          - All purchases are final. No refunds or exchanges will be provided unless the item is defective upon arrival.<br />
          - Customers are advised to carefully review size charts before placing an order, as incorrect size selection is not eligible for return.<br />
          - We are not responsible for any delays, lost shipments, or damages occurring during transit. Any claims should be directed to the shipping carrier.
        </p>

        <h3 className="mt-5 text-lg font-semibold text-white">Event Tickets</h3>
        <p className="mt-2">
          - All event ticket sales are non-refundable and non-transferable under any circumstances.<br />
          - A valid government-issued ID must be presented at the event entry for ticket verification.<br />
          - The resale of tickets for profit is strictly prohibited. Any violation may result in ticket cancellation without refund.
        </p>

        <h3 className="mt-5 text-lg font-semibold text-white">General Terms</h3>
        <p className="mt-2">
          - By making a purchase or registering for an event, you agree to comply with all stated terms and policies.<br />
          - We reserve the right to update or modify these terms at any time without prior notice.<br />
          - Any disputes arising from these terms shall be resolved under the applicable laws and regulations of our jurisdiction.
        </p>
      </div>

      <div className="flex items-center mt-5">
        <input 
          type="checkbox" 
          id="acceptTerms" 
          checked={accepted} 
          onChange={(e) => setAccepted(e.target.checked)} 
          className="w-4 h-4 text-red-600 border-gray-600 focus:ring-0 cursor-pointer"
        />
        <label htmlFor="acceptTerms" className="ml-2 text-sm text-gray-400 cursor-pointer">
          I have read and agree to the Terms and Conditions
        </label>
      </div>

      <div className="flex justify-between mt-6">
        <button 
          onClick={onClose} 
          className="flex items-center gap-2 px-4 py-2 border rounded-md text-gray-400 hover:text-white"
        >
          <FaArrowLeft /> Back
        </button>
        
        <button 
          onClick={onAccept} 
          disabled={!accepted} 
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-white transition ${{
            true: "bg-red-600 hover:bg-red-700", 
            false: "bg-gray-500 cursor-not-allowed"
          }[accepted]}`}
        >
          <FaCheckCircle /> Continue
        </button>
      </div>
    </div>
  </div>
  );
}
