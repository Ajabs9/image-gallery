import { Heart } from 'lucide-react';
import React from 'react'

const ImageCard = ({ image, onFavorite, isFavorite, onClick }) => {
  return (
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
  )
}

export default ImageCard;