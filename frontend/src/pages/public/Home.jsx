import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { categories as dummyCategories } from '../../assets/data/dummyData';
import { 
  Waves, Mountain, Tent, Palmtree, Snowflake, 
  Castle, Coffee, Filter, Building2, Heart, House 
} from 'lucide-react';
import Loader from '../../components/common/Loader';

const iconMap = {
  'Beachfront': Waves,
  'Mountains': Mountain,
  'Camping': Tent,
  'Tropical': Palmtree,
  'Arctic': Snowflake,
  'Castles': Castle,
  'Bed & Breakfasts': Coffee,
  'Iconic Cities': Building2
};

const Home = () => {
  const [displayProperties, setDisplayProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(''); // Start empty to show ALL data initially

  const API_BASE_URL = "http://localhost:5000";

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        // If category is empty, we fetch all properties
        const url = activeCategory 
          ? `${API_BASE_URL}/api/v1/properties?category=${encodeURIComponent(activeCategory)}`
          : `${API_BASE_URL}/api/v1/properties`;
        
        const response = await axios.get(url);
        
        if (response.data.success) {
          setDisplayProperties(response.data.data);
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        setDisplayProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [activeCategory]);

  // FIXED IMAGE HELPER
  const getImageUrl = (imagePath) => {
    if (!imagePath) return "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800";
    if (imagePath.startsWith('http')) return imagePath;
    
    // Since http://localhost:5000/uploads/beachfront_1.png works for you:
    const fileName = imagePath.split('/').pop();
    return `${API_BASE_URL}/uploads/${fileName}`;
  };

  return (
    <div className="pt-24 pb-12">
      {/* CATEGORY BAR */}
      <div className="sticky top-20 bg-white z-40 border-b pb-4 shadow-sm">
        <div className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-8">
            {/* Show All Button */}
            <button 
                onClick={() => setActiveCategory('')}
                className={`flex flex-col items-center gap-2 pb-3 transition-all border-b-2 min-w-fit ${activeCategory === '' ? 'border-black text-black' : 'border-transparent text-gray-500'}`}
            >
                <House size={24} />
                <span className="text-xs font-medium">All</span>
            </button>

            {dummyCategories.map((cat) => {
              const Icon = iconMap[cat.name] || Waves;
              return (
                <button
                  key={cat.name}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`flex flex-col items-center gap-2 pb-3 transition-all border-b-2 min-w-fit cursor-pointer ${
                    activeCategory === cat.name ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-black hover:border-gray-300'
                  }`}
                >
                  <Icon size={24} strokeWidth={activeCategory === cat.name ? 2.5 : 2} />
                  <span className={`text-xs ${activeCategory === cat.name ? 'font-bold' : 'font-medium'}`}>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* PROPERTY GRID */}
      <main className="max-w-[2520px] mx-auto xl:px-20 md:px-10 sm:px-2 px-4 mt-8">
        {loading ? (
          <Loader type="grid" />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
            {displayProperties.map((item) => (
              <Link 
                to={`/property/${item._id}`} // CRITICAL: Use _id from MongoDB
                key={item._id} 
                className="group cursor-pointer"
              >
                <div className="aspect-square rounded-xl overflow-hidden shadow-sm bg-gray-200 relative">
                  <img 
                    src={getImageUrl(item.images?.[0])} 
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-500" 
                    alt={item.title}
                    onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800"; }}
                  />
                </div>

                <div className="mt-3">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-[15px] text-gray-900 truncate pr-2">
                      {item.city}, {item.country || 'India'}
                    </h3>
                  </div>
                  <p className="text-gray-500 text-sm truncate font-light leading-4">{item.title}</p>
                  <div className="mt-2">
                    <span className="font-bold text-gray-900">₹{item.price?.toLocaleString('en-IN')}</span>
                    <span className="text-gray-600 font-light"> night</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && displayProperties.length === 0 && (
          <div className="flex flex-col items-center justify-center py-40 text-center">
             <House size={48} className="text-gray-400 mb-4" />
             <h2 className="text-xl font-bold text-gray-800">No properties found</h2>
             <p className="text-gray-500 mt-2">Check if your database has properties with the category: "{activeCategory}"</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;