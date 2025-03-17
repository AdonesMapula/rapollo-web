import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Modal from "react-modal";

export default function ProductList({ filteredProducts, selectSize, selectedSizes, addToCart }) {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const openModal = (product) => {
    setSelectedProduct(product);
    setCurrentImageIndex(0);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedProduct(null);
  };

  useEffect(() => {
    let interval;
    if (isHovered && selectedProduct?.image?.length > 1) {
      interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) =>
          prevIndex === selectedProduct.image.length - 1 ? 0 : prevIndex + 1
        );
      }, 2000); // Change image every 2 seconds
    }
    return () => clearInterval(interval);
  }, [isHovered, selectedProduct]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProducts.map((product) => (
        <motion.div
          key={product.name}
          className="bg-gray-900 p-4 rounded-lg flex flex-col items-center"
          whileHover={{ scale: 1.05 }}
        >
          {/* Product Image Slideshow on Hover */}
          <div
            className="w-full h-40 relative overflow-hidden"
            onMouseEnter={() => setCurrentImageIndex(0)}
          >
            {product.image && product.image.length > 1 ? (
              <img
                src={product.image[currentImageIndex]}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg transition-opacity duration-500"
                onClick={() => openModal(product)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              />
            ) : (
              <img
                src={product.image[0]}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
                onClick={() => openModal(product)}
              />
            )}
          </div>

          <div className="w-full mt-2 text-center">
            <h3 className="text-lg font-semibold">{product.name}</h3>
            <p className="text-lg font-extralight">{product.brand}</p>
            <p className="text-lg font-bold">₱{product.price}</p>

            {/* Size Selection */}
            <div className="grid grid-cols-5 gap-2 mt-2">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className={`px-2 py-1 border rounded-md text-xs text-center ${
                    selectedSizes[product.name] === size ? "bg-red-500 text-white" : "bg-gray-700 text-gray-200"
                  }`}
                  onClick={() => selectSize(product.name, size)}
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

      {/* Image Modal */}
      {modalIsOpen && selectedProduct && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="bg-gray-900 p-4 rounded-lg relative"
          >
            <button onClick={closeModal} className="absolute top-2 right-2 text-white text-xl">
              ✖
            </button>

            {/* Image Slideshow in Modal */}
            <div
              className="w-96 h-96 flex justify-center items-center"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <img
                src={selectedProduct.image[currentImageIndex]}
                alt={selectedProduct.name}
                className="w-full h-full object-cover rounded-lg transition-opacity duration-500"
              />
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center mt-4">
              {selectedProduct.image.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 mx-1 rounded-full ${
                    index === currentImageIndex ? "bg-red-500" : "bg-gray-400"
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                ></button>
              ))}
            </div>
          </motion.div>
        </Modal>
      )}
    </div>
  );
}
