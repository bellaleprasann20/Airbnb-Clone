import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const PropertyCard = ({ property }) => {
  const [isLiked, setIsLiked] = useState(false);
  const { currency, user, t, language } = useApp(); // Get translation function and language

  // --- LOGIC: CHECK IF ALREADY BOOKED ---
  const isAlreadyBooked = user?.bookings?.some(
    (booking) => String(booking.property) === String(property.id) || String(booking._id) === String(property.id)
  );

  const getImageUrl = (imageName) => {
    try {
      return new URL(`/src/assets/images/${imageName}`, import.meta.url).href;
    } catch (error) {
      return 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070';
    }
  };

  const handleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked(!isLiked);
  };

  // --- DYNAMIC PRICE CALCULATION WITH CURRENCY CONVERSION ---
  const convertedPrice = Math.round((property?.price || 0) * currency.rate);
  const formattedPrice = convertedPrice.toLocaleString(currency.code === 'INR' ? 'en-IN' : 'en-US');

  return (
    <Link to={`/property/${property?.id}`} className="flex flex-col gap-2 group cursor-pointer mb-4">
      <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-200">
        <img 
          src={getImageUrl(property?.image)} 
          alt={property?.title} 
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110" 
        />
        
        {/* "Your Booking" Badge - NOW TRANSLATED */}
        {isAlreadyBooked && (
          <div className="absolute left-3 top-3 z-10 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-md shadow-md border border-green-200 flex items-center gap-1.5">
            <CheckCircle size={14} className="text-green-600 fill-green-50" />
            <span className="text-[11px] font-bold text-green-700 uppercase tracking-tight">
              {t('yourBooking')}
            </span>
          </div>
        )}

        <button onClick={handleLike} className="absolute right-3 top-3 z-10 transition hover:scale-125">
          <Heart size={24} className={isLiked ? "fill-[#FF385C] stroke-[#FF385C]" : "fill-black/30 stroke-white"} />
        </button>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-[15px] truncate w-[85%]">{property?.location}</h3>
          <div className="flex items-center gap-1">
            <Star size={14} className="fill-black" />
            <span className="text-sm font-light">{property?.rating}</span>
          </div>
        </div>
        <p className="text-gray-500 text-[14px] font-light line-clamp-1">{property?.title}</p>
        
        {/* PRICE WITH CURRENCY CONVERSION AND TRANSLATION */}
        <div className="mt-1 flex items-baseline gap-1">
          <span className="font-bold text-gray-900 text-[15px]">
            {currency.symbol}{formattedPrice}
          </span>
          <span className="text-gray-900 text-[15px] font-light">{t('night')}</span>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;