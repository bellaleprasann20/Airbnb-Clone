import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, X, Share2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const Wishlist = () => {
  const { user, currency, t, formatPrice } = useApp();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock wishlist data - replace with your API call
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockWishlist = [
        {
          id: 1,
          title: "Luxury Beach Villa",
          location: "Goa, India",
          pricePerNight: 5000,
          rating: 4.9,
          reviews: 120,
          image: "villa1.jpg",
          guests: 6,
          bedrooms: 3,
          beds: 4,
          bathrooms: 2
        },
        {
          id: 2,
          title: "Mountain Cottage",
          location: "Manali, India",
          pricePerNight: 3500,
          rating: 4.7,
          reviews: 85,
          image: "cottage1.jpg",
          guests: 4,
          bedrooms: 2,
          beds: 2,
          bathrooms: 1
        },
        {
          id: 3,
          title: "City Apartment",
          location: "Mumbai, India",
          pricePerNight: 4000,
          rating: 4.8,
          reviews: 200,
          image: "apartment1.jpg",
          guests: 4,
          bedrooms: 2,
          beds: 3,
          bathrooms: 2
        }
      ];
      setWishlistItems(mockWishlist);
      setLoading(false);
    }, 500);
  }, []);

  const getImageUrl = (imageName) => {
    try {
      return new URL(`/src/assets/images/${imageName}`, import.meta.url).href;
    } catch (error) {
      return 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070';
    }
  };

  const removeFromWishlist = (itemId) => {
    setWishlistItems(wishlistItems.filter(item => item.id !== itemId));
    // TODO: Add your API call here to remove from backend
    // fetch(`/api/wishlist/${itemId}`, { method: 'DELETE' })
  };

  const handleShare = (property) => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out this amazing property: ${property.title}`,
        url: window.location.origin + `/property/${property.id}`
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.origin + `/property/${property.id}`);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Header */}
      <div className="sticky top-20 z-40 bg-white border-b border-gray-200">
        <div className="max-w-[2520px] mx-auto px-4 sm:px-6 lg:px-20 py-6">
          <h1 className="text-3xl font-bold text-gray-900">{t('wishlist')}</h1>
          <p className="text-gray-600 mt-2">
            {wishlistItems.length} {wishlistItems.length === 1 ? t('property') : t('properties')}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-[2520px] mx-auto px-4 sm:px-6 lg:px-20 py-8">
        {wishlistItems.length === 0 ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Heart size={64} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {t('emptyWishlist')}
            </h2>
            <p className="text-gray-600 mb-8 text-center max-w-md">
              {t('startSaving')}
            </p>
            <Link 
              to="/" 
              className="bg-rose-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-rose-600 transition-colors"
            >
              {t('exploreProperties')}
            </Link>
          </div>
        ) : (
          // Wishlist Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((property) => (
              <div key={property.id} className="group">
                <Link to={`/property/${property.id}`} className="block">
                  <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-200 mb-3">
                    <img 
                      src={getImageUrl(property.image)} 
                      alt={property.title}
                      className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                    />
                    
                    {/* Action Buttons */}
                    <div className="absolute top-3 right-3 flex gap-2 z-10">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleShare(property);
                        }}
                        className="p-2 bg-white/90 hover:bg-white rounded-full transition-colors shadow-md"
                        title={t('share')}
                      >
                        <Share2 size={18} className="text-gray-700" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          removeFromWishlist(property.id);
                        }}
                        className="p-2 bg-white/90 hover:bg-white rounded-full transition-colors shadow-md"
                        title={t('remove')}
                      >
                        <X size={18} className="text-gray-700" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-gray-900 truncate flex-1">
                        {property.location}
                      </h3>
                      <div className="flex items-center gap-1 ml-2">
                        <Star size={14} className="fill-black" />
                        <span className="text-sm font-semibold">{property.rating}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm truncate">{property.title}</p>
                    
                    <p className="text-gray-600 text-sm">
                      {property.guests} {t('guests')} · {property.bedrooms} {t('bedrooms')}
                    </p>

                    <div className="pt-1">
                      <span className="font-semibold text-gray-900">
                        {formatPrice(property.pricePerNight)}
                      </span>
                      <span className="text-gray-600 text-sm"> {t('night')}</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;