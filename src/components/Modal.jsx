import { X } from "lucide-react";
import React from "react";

const Modal = ({ image, onClose }) => {
  if (!image) return null; // Prevents rendering if no image is selected

  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-800 p-4 border-b dark:border-gray-700 flex justify-between items-center">
          <h2 className="text-xl font-semibold dark:text-white truncate">
            {image.author} - ID: {image.id}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-6 h-6 dark:text-gray-400 text-gray-700" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4">
          <img
            src={`https://picsum.photos/id/${image.id}/800/600`}
            alt={`Photo by ${image.author}`}
            className="w-full h-auto rounded-lg mb-4"
          />
          <div className="flex justify-between items-center space-y-3 dark:text-gray-300">
            <a
              href={image.download_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              View Original
            </a>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Photo (ID: {image.id}) by <strong>{image.author}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
