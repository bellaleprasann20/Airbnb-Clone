import React, { useState, useEffect } from 'react';
import { Map, List, SlidersHorizontal, X, MapPin, Star, Heart } from 'lucide-react';

const SearchResults = () => {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('list');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    priceMin: 0,
    priceMax: 50000,
    propertyType: 'all',
    category: 'all',
    minRating: 0
  });

  // Mock data - Replace with actual API call
  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      
      // TODO: Replace with actual API call
      // const response = await fetch(`${API_BASE_URL}/api/v1/properties?location=${location}`);
      // const data = await response.json();
      
      // Mock data
      setTimeout(() => {
        const mockData = [
          {
            _id: '1',
            title: 'Luxury Beachfront Villa',
            city: 'Goa',
            country: 'India',
            price: 8500,
            rating: 4.9,
            category: 'Beachfront',
            propertyType: 'Villa',
            images: ['https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800'],
            maxGuests: 6,
            bedrooms: 3,
            bathrooms: 2
          },
          {
            _id: '2',
            title: 'Cozy Mountain Cabin',
            city: 'Manali',
            country: 'India',
            price: 3500,
            rating: 4.7,
            category: 'Mountains',
            propertyType: 'Cottage',
            images: ['https://images.unsplash.com/photo-1499696010180-025ef6e1a8f9?w=800'],
            maxGuests: 4,
            bedrooms: 2,
            bathrooms: 1
          },
          {
            _id: '3',
            title: 'Modern City Apartment',
            city: 'Mumbai',
            country: 'India',
            price: 4500,
            rating: 4.8,
            category: 'Iconic Cities',
            propertyType: 'Apartment',
            images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
            maxGuests: 3,
            bedrooms: 2,
            bathrooms: 1
          },
          {
            _id: '4',
            title: 'Tropical Paradise Villa',
            city: 'Kerala',
            country: 'India',
            price: 7000,
            rating: 4.9,
            category: 'Tropical',
            propertyType: 'Villa',
            images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'],
            maxGuests: 5,
            bedrooms: 3,
            bathrooms: 2
          },
          {
            _id: '5',
            title: 'Historic Castle Suite',
            city: 'Rajasthan',
            country: 'India',
            price: 12000,
            rating: 5.0,
            category: 'Castles',
            propertyType: 'Hotel',
            images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'],
            maxGuests: 4,
            bedrooms: 2,
            bathrooms: 2
          },
          {
            _id: '6',
            title: 'Lakeside Cottage',
            city: 'Nainital',
            country: 'India',
            price: 3000,
            rating: 4.6,
            category: 'Mountains',
            propertyType: 'Cottage',
            images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'],
            maxGuests: 3,
            bedrooms: 1,
            bathrooms: 1
          }
        ];
        
        setProperties(mockData);
        setFilteredProperties(mockData);
        setLoading(false);
      }, 1000);
    };
    
    fetchProperties();
  }, []);

  // Apply filters
  useEffect(() => {
    let filtered = [...properties];
    
    // Price filter
    filtered = filtered.filter(p => 
      p.price >= filters.priceMin && p.price <= filters.priceMax
    );
    
    // Property type filter
    if (filters.propertyType !== 'all') {
      filtered = filtered.filter(p => p.propertyType === filters.propertyType);
    }
    
    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(p => p.category === filters.category);
    }
    
    // Rating filter
    if (filters.minRating > 0) {
      filtered = filtered.filter(p => p.rating >= filters.minRating);
    }
    
    setFilteredProperties(filtered);
  }, [filters, properties]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      priceMin: 0,
      priceMax: 50000,
      propertyType: 'all',
      category: 'all',
      minRating: 0
    });
  };

  const PropertyCard = ({ property }) => (
    <div className="group cursor-pointer">
      <div className="relative overflow-hidden rounded-2xl mb-3">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800";
          }}
        />
        <button className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors shadow-lg">
          <Heart size={18} className="text-gray-700" />
        </button>
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className="text-xs font-bold text-gray-900">{property.category}</span>
        </div>
      </div>
      
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 truncate">{property.title}</h3>
          <div className="flex items-center gap-1">
            <Star size={14} className="fill-black text-black" />
            <span className="text-sm font-semibold">{property.rating}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1 text-gray-600 text-sm">
          <MapPin size={14} />
          <span>{property.city}, {property.country}</span>
        </div>
        
        <p className="text-sm text-gray-600">
          {property.maxGuests} guests · {property.bedrooms} bedroom{property.bedrooms > 1 ? 's' : ''} · {property.bathrooms} bath{property.bathrooms > 1 ? 's' : ''}
        </p>
        
        <div className="pt-2">
          <span className="font-bold text-gray-900">₹{property.price.toLocaleString('en-IN')}</span>
          <span className="text-gray-600 text-sm"> / night</span>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Searching properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-6 md:px-12 py-6 border-b sticky top-20 z-40 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {filteredProperties.length} stay{filteredProperties.length !== 1 ? 's' : ''} found
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Prices include all fees, before taxes
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-5 py-2.5 border-2 border-gray-300 rounded-xl text-sm font-bold hover:border-black transition-colors"
            >
              <SlidersHorizontal size={16} /> 
              Filters
              {(filters.propertyType !== 'all' || filters.category !== 'all' || filters.minRating > 0) && (
                <span className="bg-black text-white w-5 h-5 rounded-full text-xs flex items-center justify-center">
                  {[filters.propertyType !== 'all', filters.category !== 'all', filters.minRating > 0].filter(Boolean).length}
                </span>
              )}
            </button>
            
            <button 
              onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors shadow-lg"
            >
              {viewMode === 'list' ? (
                <><Map size={16} /> Show Map</>
              ) : (
                <><List size={16} /> Show List</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border-b shadow-md">
          <div className="px-6 md:px-12 py-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold">Filters</h2>
              <button onClick={() => setShowFilters(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Price Range */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Price Range</label>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-600">Min: ₹{filters.priceMin.toLocaleString('en-IN')}</label>
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      step="500"
                      value={filters.priceMin}
                      onChange={(e) => handleFilterChange('priceMin', Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600">Max: ₹{filters.priceMax.toLocaleString('en-IN')}</label>
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      step="500"
                      value={filters.priceMax}
                      onChange={(e) => handleFilterChange('priceMax', Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
                    />
                  </div>
                </div>
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Property Type</label>
                <select
                  value={filters.propertyType}
                  onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-rose-500 outline-none"
                >
                  <option value="all">All Types</option>
                  <option value="House">House</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Cottage">Cottage</option>
                  <option value="Hotel">Hotel</option>
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-rose-500 outline-none"
                >
                  <option value="all">All Categories</option>
                  <option value="Beachfront">Beachfront</option>
                  <option value="Mountains">Mountains</option>
                  <option value="Tropical">Tropical</option>
                  <option value="Castles">Castles</option>
                  <option value="Iconic Cities">Iconic Cities</option>
                  <option value="Camping">Camping</option>
                </select>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-3">Minimum Rating</label>
                <div className="flex gap-2">
                  {[0, 4.0, 4.5, 4.8].map(rating => (
                    <button
                      key={rating}
                      onClick={() => handleFilterChange('minRating', rating)}
                      className={`flex-1 px-3 py-2 rounded-lg font-semibold text-sm transition-colors ${
                        filters.minRating === rating
                          ? 'bg-black text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {rating === 0 ? 'Any' : `${rating}+`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
              <button
                onClick={resetFilters}
                className="px-6 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Clear all
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="px-6 py-2 bg-black text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors"
              >
                Show {filteredProperties.length} results
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="px-6 md:px-12 py-8">
        {viewMode === 'list' ? (
          filteredProperties.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProperties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          ) : (
            <div className="max-w-md mx-auto text-center py-20">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <SlidersHorizontal size={32} className="text-gray-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No properties found</h2>
              <p className="text-gray-600 mb-6">Try adjusting your filters to see more results</p>
              <button
                onClick={resetFilters}
                className="px-6 py-3 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )
        ) : (
          <div className="h-[calc(100vh-300px)] bg-white rounded-2xl border-2 overflow-hidden shadow-lg">
            <iframe
              src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15282225.79979123!2d73.7250245393691!3d20.750301298393563!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30635ff06b92b791%3A0xd78c4fa1854213a6!2sIndia!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Property locations map"
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchResults; 