import React, { useEffect, useState } from "react";
import Modal from "../components/Modal";
import { Menu, Moon, Search, Sun } from "lucide-react";
import ImageCard from "../components/ImageCard";

const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [page, setPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  // const [layoutType, setLayoutType] = useState("comfortable");

  useEffect(() => {
    fetchImages();
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    document.documentElement.classList.toggle("dark", savedDarkMode);
  }, [page]);

  const fetchImages = async () => {
    try {
      const response = await fetch(
        `https://picsum.photos/v2/list?page=${page}&limit=30`
      );
      if (!response.ok) throw new Error("Failed to fetch images");
      const data = await response.json();
      setImages((prev) => (page === 1 ? data : [...prev, ...data]));
      setLoading(false);
    } catch (err) {
      setError("Failed to load images. Please try again later.");
      setLoading(false);
    }
  };

  const toggleFavorite = (image) => {
    const newFavorites = favorites.some((fav) => fav.id === image.id)
      ? favorites.filter((fav) => fav.id !== image.id)
      : [...favorites, image];

    setFavorites(newFavorites);
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle("dark", newDarkMode);
    localStorage.setItem("darkMode", newDarkMode);
  };

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  const filteredImages = searchId
    ? images.filter((img) => img.id.toString().includes(searchId))
    : images;

  const displayedImages = showFavorites ? favorites : filteredImages;

  const handleImageClick = (image) => {
    setSelectedImage(image);
    console.log("Image clicked:", image);
  };

  return (
    <div className="w-full">
      <div
        className={`min-h-screen ${
          darkMode ? "dark bg-gray-900 text-white" : "bg-gray-50"
        }`}
      >
        {/* Header */}
        <header
          className={`sticky top-0 z-40 shadow-md ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="container mx-auto px-4">
            <div className="py-4">
              {/* Mobile Menu */}
              <div className="flex lg:hidden justify-between items-center mb-4">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
                >
                  <Menu className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation */}
              <div
                className={`${
                  menuOpen ? "block" : "hidden"
                } lg:flex lg:items-center lg:justify-between space-y-4 lg:space-y-0`}
              >
                <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
                  <button
                    onClick={() => setShowFavorites(!showFavorites)}
                    className={`px-4 py-2 rounded-lg w-full lg:w-auto ${
                      darkMode ? "text-gray-700" : "bg-gray-100 "
                    }`}
                  >
                    {showFavorites ? "Show All" : "Show Favorites"}
                  </button>

                  <button
                    onClick={toggleDarkMode}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
                  >
                    {darkMode ? (
                      <Sun className="w-5 h-5 text-gray-700" />
                    ) : (
                      <Moon className="w-5 h-5" />
                    )}
                  </button>
                </div>

                <div className="relative w-full lg:w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    placeholder="Search by ID..."
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:placeholder-gray-100"
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {loading && page === 1 ? (
            <div className="flex justify-center items-center min-h-[50vh]">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 p-4">{error}</div>
          ) : displayedImages.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                {showFavorites
                  ? "No favorite images yet."
                  : "No images found matching your search."}
              </p>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap -mx-2">
                {displayedImages.map((image) => (
                  <ImageCard
                    key={image.id}
                    image={image}
                    onFavorite={toggleFavorite}
                    isFavorite={favorites.some((fav) => fav.id === image.id)}
                    onClick={handleImageClick}
                  />
                ))}
              </div>

              {!showFavorites && !searchId && (
                <div className="text-center mt-8">
                  <button
                    onClick={loadMore}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Loading...</span>
                      </div>
                    ) : (
                      "Load More"
                    )}
                  </button>
                </div>
              )}
            </>
          )}

          {selectedImage && (
            <Modal
              image={selectedImage}
              onClose={() => setSelectedImage(null)}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default ImageGallery;
