import React, { useState, useEffect } from 'react';
import { X, Heart, Search, Moon, Sun, Menu, Layout, Grid, Columns } from 'lucide-react';

const ImageCard = ({ image, onFavorite, isFavorite, onClick }) => (
  <div className="flex-grow basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 p-2">
    <div className="relative group h-full rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-800">
      <div className="aspect-w-4 aspect-h-3">
        <img
        src={`https://picsum.photos/id/${image.id}/400/300`}
        alt={`Photo by ${image.author}`}
        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 z-50"
        onClick={() => onClick(image)} 
        loading="lazy"
      />
      </div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-white text-sm font-medium truncate">{image.author}</p>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onFavorite(image);
        }}
        className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white"
      >
        <Heart 
          className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
        />
      </button>
    </div>
  </div>
);

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
            {image.author} - ID: {image.id}  {/* ✅ Displays author & photo ID */}
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
          <div className="flex justify-between items-center space-y-3 dark:text-gray-300 flex">
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


const ImageGallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchId, setSearchId] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [page, setPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [layoutType, setLayoutType] = useState('comfortable');

  useEffect(() => {
    fetchImages();
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    document.documentElement.classList.toggle('dark', savedDarkMode);
  }, [page]);

  const fetchImages = async () => {
    try {
      const response = await fetch(`https://picsum.photos/v2/list?page=${page}&limit=30`);
      if (!response.ok) throw new Error('Failed to fetch images');
      const data = await response.json();
      setImages(prev => page === 1 ? data : [...prev, ...data]);
      setLoading(false);
    } catch (err) {
      setError('Failed to load images. Please try again later.');
      setLoading(false);
    }
  };

  const toggleFavorite = (image) => {
    const newFavorites = favorites.some(fav => fav.id === image.id)
      ? favorites.filter(fav => fav.id !== image.id)
      : [...favorites, image];
    
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.documentElement.classList.toggle('dark', newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  const filteredImages = searchId
    ? images.filter(img => img.id.toString().includes(searchId))
    : images;

  const displayedImages = showFavorites ? favorites : filteredImages;

  const handleImageClick = (image) => {  
    setSelectedImage(image);
    console.log("Image clicked:", image);
  };

  return (
    <div className='w-full'>
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`sticky top-0 z-40 shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
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
            <div className={`${menuOpen ? 'block' : 'hidden'} lg:flex lg:items-center lg:justify-between space-y-4 lg:space-y-0`}>
              <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
                <button
                  onClick={() => setShowFavorites(!showFavorites)}
                  className={`px-4 py-2 rounded-lg w-full lg:w-auto ${
                    darkMode ? 'text-gray-700' : 'bg-gray-100 '
                  }`}
                >
                  {showFavorites ? 'Show All' : 'Show Favorites'}
                </button>
                
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
              >
                {darkMode ? <Sun className="w-5 h-5 text-gray-700" /> : <Moon className="w-5 h-5" />}
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
              {showFavorites ? 'No favorite images yet.' : 'No images found matching your search.'}
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap -mx-2">
              {displayedImages.map(image => (
                <ImageCard
                key={image.id}
                image={image}
                onFavorite={toggleFavorite}
                isFavorite={favorites.some(fav => fav.id === image.id)}
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
                    'Load More'
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