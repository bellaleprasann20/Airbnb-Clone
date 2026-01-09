const mongoose = require('mongoose');
require('dotenv').config();

// Ensure these paths match your folder structure exactly
const Property = require('./src/models/Property.model'); 
const User = require('./src/models/User.model');

const propertiesData = [
  // --- 1. BEACHFRONT (10) ---
  { id: "beach-1", title: "Azure Horizon Villa", category: "Beachfront", image: "beachfront_1.png", location: "Malibu, California", price: 45000, rating: 4.92, description: "Stunning glass villa on the sand.", amenities: ["Wifi", "Kitchen"] },
  { id: "beach-2", title: "Coral Reef Cottage", category: "Beachfront", image: "beachfront_2.png", location: "Havelock, India", price: 12500, rating: 4.85, description: "Turquoise waves and palm trees.", amenities: ["AC", "Snorkel"] },
  { id: "beach-3", title: "Sandy Shell Studio", category: "Beachfront", image: "beachfront_3.png", location: "Goa, India", price: 5000, rating: 4.70, description: "Cozy shack near the shore.", amenities: ["Wifi", "Hammock"] },
  { id: "beach-4", title: "The Blue Lagoon", category: "Beachfront", image: "beachfront_4.png", location: "Bora Bora", price: 85000, rating: 4.99, description: "Overwater luxury bungalow.", amenities: ["Pool", "Butler"] },
  { id: "beach-5", title: "Ocean Whisperer", category: "Beachfront", image: "beachfront_5.png", location: "Maui, Hawaii", price: 32000, rating: 4.88, description: "Modern beach house with sunset views.", amenities: ["Kitchen", "BBQ"] },
  { id: "beach-6", title: "White Sand Retreat", category: "Beachfront", image: "beachfront_6.png", location: "Phuket, Thailand", price: 15000, rating: 4.82, description: "Private infinity pool by the sea.", amenities: ["Pool", "Spa"] },
  { id: "beach-7", title: "Coastal Driftwood", category: "Beachfront", image: "beachfront_7.png", location: "Byron Bay, Australia", price: 22000, rating: 4.90, description: "Boho-chic villa for surfers.", amenities: ["Surfboard", "Wifi"] },
  { id: "beach-8", title: "The Glass Pier", category: "Beachfront", image: "beachfront_8.png", location: "Miami, Florida", price: 41000, rating: 4.75, description: "Penthouse overlooking the Atlantic.", amenities: ["Gym", "Balcony"] },
  { id: "beach-9", title: "Seaside Sanctuary", category: "Beachfront", image: "beachfront_9.png", location: "Nice, France", price: 28000, rating: 4.86, description: "Charming French Riviera home.", amenities: ["Kitchen", "Patio"] },
  { id: "beach-10", title: "Tidal Wave Loft", category: "Beachfront", image: "beachfront_10.png", location: "Cancun, Mexico", price: 19000, rating: 4.80, description: "Steps away from the Caribbean sea.", amenities: ["Wifi", "AC"] },

  // --- 2. MOUNTAINS (10) ---
  { id: "mount-1", title: "Pinecone A-Frame", category: "Mountains", image: "mountains_1.png", location: "Manali, India", price: 8500, rating: 4.98, description: "Cozy wooden cabin in the forest.", amenities: ["Fireplace", "Hiking"] },
  { id: "mount-2", title: "Summit Peak Lodge", category: "Mountains", image: "mountains_2.png", location: "Swiss Alps", price: 55000, rating: 4.95, description: "Luxury ski-in/ski-out chalet.", amenities: ["Sauna", "Hot tub"] },
  { id: "mount-3", title: "Eagle's Nest", category: "Mountains", image: "mountains_3.png", location: "Aspen, Colorado", price: 48000, rating: 4.91, description: "High altitude luxury living.", amenities: ["Gym", "Fireplace"] },
  { id: "mount-4", title: "The Cedar Cabin", category: "Mountains", image: "mountains_4.png", location: "Banff, Canada", price: 15000, rating: 4.87, description: "Rustic log cabin near the lake.", amenities: ["Wifi", "Kitchen"] },
  { id: "mount-5", title: "Mist Valley Home", category: "Mountains", image: "mountains_5.png", location: "Kashmir, India", price: 12000, rating: 4.89, description: "Views of the snow-capped peaks.", amenities: ["Heating", "Breakfast"] },
  { id: "mount-6", title: "Snowcap Retreat", category: "Mountains", image: "mountains_6.png", location: "Hokkaido, Japan", price: 25000, rating: 4.93, description: "Modern design in a winter wonderland.", amenities: ["Ski storage", "Kitchen"] },
  { id: "mount-7", title: "Rocky Ridge Chalet", category: "Mountains", image: "mountains_7.png", location: "Dolomites, Italy", price: 34000, rating: 4.96, description: "World-class mountain climbing access.", amenities: ["Gear room", "Balcony"] },
  { id: "mount-8", title: "Cloud Nine Villa", category: "Mountains", image: "mountains_8.png", location: "Blue Mountains, Australia", price: 18000, rating: 4.84, description: "Secluded home above the clouds.", amenities: ["Garden", "Wifi"] },
  { id: "mount-9", title: "Hidden Creek Hut", category: "Mountains", image: "mountains_9.png", location: "Oregon, USA", price: 7000, rating: 4.78, description: "Tiny home with big mountain views.", amenities: ["Fire pit", "Solar"] },
  { id: "mount-10", title: "The Granite Peak", category: "Mountains", image: "mountains_10.png", location: "Pyrenees, Spain", price: 21000, rating: 4.82, description: "Ancient stone house with modern interior.", amenities: ["Kitchen", "Wifi"] },

  // --- 3. CAMPING (10) ---
  { id: "camp-1", title: "Stargazer Glamping", category: "Camping", image: "camping_1.png", location: "Jaisalmer, India", price: 5000, rating: 4.75, description: "Luxury desert camping.", amenities: ["Fire pit", "Safari"] },
  { id: "camp-2", title: "Forest Bell Tent", category: "Camping", image: "camping_2.png", location: "Oregon, USA", price: 4500, rating: 4.68, description: "Canvas tent under the stars.", amenities: ["Hammock", "Grill"] },
  { id: "camp-3", title: "Wilderness Dome", category: "Camping", image: "camping_3.png", location: "Iceland", price: 22000, rating: 4.92, description: "See the Aurora from your bed.", amenities: ["Heating", "Wifi"] },
  { id: "camp-4", title: "Riverside Yurts", category: "Camping", image: "camping_4.png", location: "Rishikesh, India", price: 3500, rating: 4.60, description: "Peaceful camping by the Ganges.", amenities: ["Yoga mat", "Breakfast"] },
  { id: "camp-5", title: "Safari Sky Lodge", category: "Camping", image: "camping_5.png", location: "Serengeti, Tanzania", price: 40000, rating: 4.97, description: "High-end canvas lodge.", amenities: ["Pool", "Tours"] },
  { id: "camp-6", title: "Canyon Hideout", category: "Camping", image: "camping_6.png", location: "Zion, Utah", price: 12000, rating: 4.85, description: "Nestled between red rock walls.", amenities: ["Outdoor shower", "Wifi"] },
  { id: "camp-7", title: "Pine Shadows Camp", category: "Camping", image: "camping_7.png", location: "Black Forest, Germany", price: 6500, rating: 4.74, description: "Deep forest traditional camping.", amenities: ["Firewood", "Kitchen"] },
  { id: "camp-8", title: "Nomad Oasis", category: "Camping", image: "camping_8.png", location: "Sahara, Morocco", price: 18000, rating: 4.88, description: "Traditional Berber tent experience.", amenities: ["Camel ride", "Dinner"] },
  { id: "camp-9", title: "Meadow Tiny House", category: "Camping", image: "camping_9.png", location: "Tasmania, Australia", price: 9000, rating: 4.79, description: "Off-grid camping in a tiny home.", amenities: ["Solar", "Fire pit"] },
  { id: "camp-10", title: "The Bubble Suite", category: "Camping", image: "camping_10.png", location: "Bali, Indonesia", price: 15000, rating: 4.81, description: "Transparent bubble tent in the jungle.", amenities: ["AC", "Private deck"] },

  // --- 4. TROPICAL (10) ---
  { id: "trop-1", title: "Bali Bamboo Treehouse", category: "Tropical", image: "trop_1.png", location: "Ubud, Bali", price: 18000, rating: 4.90, description: "Eco-friendly jungle retreat.", amenities: ["Pool", "Hammock"] },
  { id: "trop-2", title: "Jungle Bungalow", category: "Tropical", image: "trop_2.png", location: "Costa Rica", price: 11000, rating: 4.76, description: "Surrounded by exotic birds.", amenities: ["Kitchen", "Wifi"] },
  { id: "trop-3", title: "Palm Paradise Villa", category: "Tropical", image: "trop_3.png", location: "Kerala, India", price: 9500, rating: 4.82, description: "Luxury stay in the backwaters.", amenities: ["Boat", "AC"] },
  { id: "trop-4", title: "Orchid Garden Home", category: "Tropical", image: "trop_4.png", location: "Seychelles", price: 55000, rating: 4.94, description: "Private island tropical vibes.", amenities: ["Pool", "Chef"] },
  { id: "trop-5", title: "Rainforest Edge", category: "Tropical", image: "trop_5.png", location: "Amazon, Brazil", price: 14000, rating: 4.70, description: "True wilderness tropical experience.", amenities: ["Guide", "Wifi"] },
  { id: "trop-6", title: "Hibiscus House", category: "Tropical", image: "trop_6.png", location: "Fiji", price: 21000, rating: 4.88, description: "Colorful villa near coral reefs.", amenities: ["Snorkel", "Breakfast"] },
  { id: "trop-7", title: "The Fern Gully", category: "Tropical", image: "trop_.png", location: "Jamaica", price: 13500, rating: 4.79, description: "Relaxing stay near waterfalls.", amenities: ["Kitchen", "Garden"] },
  { id: "trop-8", title: "Coco Retreat", category: "Tropical", image: "trop_8.png", location: "Maldives", price: 89000, rating: 4.98, description: "Tropical luxury at its finest.", amenities: ["Pool", "Spa"] },
  { id: "trop-9", title: "Tropicana Loft", category: "Tropical", image: "trop_9.png", location: "Tulum, Mexico", price: 25000, rating: 4.85, description: "Modern design meets jungle life.", amenities: ["Wifi", "Bikes"] },
  { id: "trop-10", title: "Mango Grove Cabin", category: "Tropical", image: "trop_10.png", location: "Goa, India", price: 6000, rating: 4.65, description: "Secluded cabin in a fruit orchard.", amenities: ["Kitchen", "Patio"] },

  // --- 5. CASTLES (10) ---
  { id: "castle-1", title: "King’s Guard Fortress", category: "Castles", image: "castle_1.png", location: "Edinburgh, Scotland", price: 95000, rating: 5.0, description: "Restored 12th-century stone castle.", amenities: ["Library", "Great Hall"] },
  { id: "castle-2", title: "Bavarian Palace", category: "Castles", image: "castle_2.png", location: "Germany", price: 120000, rating: 4.99, description: "Fairytale castle in the mountains.", amenities: ["Pool", "Chef"] },
  { id: "castle-3", title: "The Heritage Keep", category: "Castles", image: "castle_3.png", location: "Rajasthan, India", price: 45000, rating: 4.92, description: "Historic Rajputana fort stay.", amenities: ["Grand Piano", "Garden"] },
  { id: "castle-4", title: "Loire Valley Chateau", category: "Castles", image: "castle_4.png", location: "France", price: 75000, rating: 4.95, description: "Elegant estate with vineyards.", amenities: ["Wifi", "Wine cellar"] },
  { id: "castle-5", title: "Stone Watch Tower", category: "Castles", image: "castle_5.png", location: "Tuscany, Italy", price: 38000, rating: 4.88, description: "Medieval tower with valley views.", amenities: ["Kitchen", "Patio"] },
  { id: "castle-6", title: "Vanguard Palace", category: "Castles", image: "castle_6.png", location: "Vienna, Austria", price: 68000, rating: 4.90, description: "Imperial living in the city.", amenities: ["Library", "AC"] },
  { id: "castle-7", title: "The Baron's Bastion", category: "Castles", image: "castle_7.png", location: "Prague, Czechia", price: 32000, rating: 4.84, description: "Old world charm and stone walls.", amenities: ["Fireplace", "Breakfast"] },
  { id: "castle-8", title: "Knight’s Manor", category: "Castles", image: "castle_8.png", location: "Cotswolds, UK", price: 42000, rating: 4.87, description: "English heritage luxury estate.", amenities: ["Kitchen", "Garden"] },
  { id: "castle-9", title: "Imperial Citadel", category: "Castles", image: "castle_9.png", location: "Heidelberg, Germany", price: 54000, rating: 4.93, description: "Overlooking the river Neckar.", amenities: ["Balcony", "Wifi"] },
  { id: "castle-10", title: "Crown Estate", category: "Castles", image: "castle_10.png", location: "Lisbon, Portugal", price: 47000, rating: 4.81, description: "Royal summer residence.", amenities: ["Pool", "Kitchen"] },

  // --- 6. BED & BREAKFASTS (10) ---
  { id: "bnb-1", title: "Lavender Lane Manor", category: "Bed & Breakfasts", image: "bnb_1.png", location: "Provence, France", price: 14000, rating: 4.88, description: "Charming home with gardens.", amenities: ["Breakfast", "Bikes"] },
  { id: "bnb-2", title: "The Old Oak Inn", category: "Bed & Breakfasts", image: "bnb_2.png", location: "Oxford, UK", price: 11000, rating: 4.75, description: "Traditional British hospitality.", amenities: ["Tea", "Wifi"] },
  { id: "bnb-3", title: "Sunny Side Stay", category: "Bed & Breakfasts", image: "bnb_3.png", location: "Vermont, USA", price: 9000, rating: 4.80, description: "Fall foliage and cozy rooms.", amenities: ["Kitchen", "Fireplace"] },
  { id: "bnb-4", title: "Hearthstone House", category: "Bed & Breakfasts", image: "bnb_4.png", location: "Shimla, India", price: 6500, rating: 4.72, description: "Colonial style B&B.", amenities: ["Breakfast", "Heating"] },
  { id: "bnb-5", title: "Willow Creek", category: "Bed & Breakfasts", image: "bnb_5.png", location: "Cape Town, SA", price: 12500, rating: 4.85, description: "Mountain views and fresh coffee.", amenities: ["Pool", "Wifi"] },
  { id: "bnb-6", title: "Rose Petal Inn", category: "Bed & Breakfasts", image: "bnb_6.png", location: "Charleston, USA", price: 16000, rating: 4.89, description: "Historic Southern charm.", amenities: ["Kitchen", "Garden"] },
  { id: "bnb-7", title: "Morning Glory", category: "Bed & Breakfasts", image: "bnb_7.png", location: "Kyoto, Japan", price: 22000, rating: 4.96, description: "Zen gardens and traditional tea.", amenities: ["Tea", "Wifi"] },
  { id: "bnb-8", title: "Victorian Charm", category: "Bed & Breakfasts", image: "bnb_8.png", location: "Quebec City, Canada", price: 13000, rating: 4.81, description: "Walkable historic location.", amenities: ["Breakfast", "Kitchen"] },
  { id: "bnb-9", title: "The Cozy Corner", category: "Bed & Breakfasts", image: "bnb_9.png", location: "Tasmania, Australia", price: 8000, rating: 4.70, description: "Quiet retreat for couples.", amenities: ["Fire pit", "Wifi"] },
  { id: "bnb-10", title: "Maple Leaf Manor", category: "Bed & Breakfasts", image: "bnb_10.png", location: "Toronto, Canada", price: 10500, rating: 4.78, description: "City living with a homey feel.", amenities: ["Kitchen", "AC"] },

  // --- 7. ICONIC CITIES (10) ---
  { id: "city-1", title: "Skyline Loft", category: "Iconic Cities", image: "city_1.png", location: "New York, USA", price: 35000, rating: 4.85, description: "Modern loft in Manhattan.", amenities: ["Wifi", "Gym"] },
  { id: "city-2", title: "Parisian Elegance", category: "Iconic Cities", image: "city_2.png", location: "Paris, France", price: 42000, rating: 4.90, description: "View of the Eiffel Tower.", amenities: ["Balcony", "Kitchen"] },
  { id: "city-3", title: "Tokyo Neon Suite", category: "Iconic Cities", image: "city_3.png", location: "Tokyo, Japan", price: 28000, rating: 4.82, description: "In the heart of Shinjuku.", amenities: ["AC", "Wifi"] },
  { id: "city-4", title: "London Bridge Flat", category: "Iconic Cities", image: "city_4.png", location: "London, UK", price: 38000, rating: 4.78, description: "Classic London brick apartment.", amenities: ["Kitchen", "Wifi"] },
  { id: "city-5", title: "Dubai Marina View", category: "Iconic Cities", image: "city_5.png", location: "Dubai, UAE", price: 55000, rating: 4.94, description: "High-floor luxury studio.", amenities: ["Pool", "Gym"] },
  { id: "city-6", title: "Rome Plaza Room", category: "Iconic Cities", image: "city_6.png", location: "Rome, Italy", price: 24000, rating: 4.86, description: "Near the Pantheon.", amenities: ["Breakfast", "AC"] },
  { id: "city-7", title: "Berlin Art Loft", category: "Iconic Cities", image: "city_7.png", location: "Berlin, Germany", price: 19000, rating: 4.75, description: "Industrial style apartment.", amenities: ["Wifi", "Music system"] },
  { id: "city-8", title: "Sydney Harbour Stay", category: "Iconic Cities", image: "city_8.png", location: "Sydney, Australia", price: 46000, rating: 4.93, description: "Overlooking the Opera House.", amenities: ["Pool", "Balcony"] },
  { id: "city-9", title: "Mumbai Sea Face", category: "Iconic Cities", image: "city_9.png", location: "Mumbai, India", price: 22000, rating: 4.70, description: "Ocean breeze in the city.", amenities: ["Kitchen", "Wifi"] },
  { id: "city-10", title: "Singapore Sky Villa", category: "Iconic Cities", image: "city_10.png", location: "Singapore", price: 62000, rating: 4.97, description: "Tropical city luxury.", amenities: ["Pool", "Gardens"] }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    // 1. FIX USER ROLES: Find 'Prasann' and make him a host
    let host = await User.findOneAndUpdate(
      { name: /Prasann/i }, 
      { role: 'host' }, 
      { new: true }
    );

    // If Prasann doesn't exist, create the System Host
    if (!host) {
      console.log("User 'Prasann' not found. Creating a 'System Host'...");
      host = await User.findOneAndUpdate(
        { email: 'host@airbnb.com' },
        {
          name: 'System Host',
          email: 'host@airbnb.com',
          password: 'password123', 
          role: 'host'
        },
        { upsert: true, new: true }
      );
    } else {
      console.log(`✅ User ${host.name} is now a HOST.`);
    }

    // 2. FORMAT PROPERTIES
    const formattedProperties = propertiesData.map(p => {
      const locationParts = p.location.split(', ');
      return {
        host: host._id,
        title: p.title,
        description: p.description,
        price: p.price,
        category: p.category,
        city: locationParts[0],
        country: locationParts[1] || "Global",
        // FIX: Save ONLY the filename. 
        // Your MyTrips.jsx helper adds the "/uploads/" prefix automatically.
        images: [p.image], 
        amenities: p.amenities,
        rating: p.rating,
        location: { type: 'Point', coordinates: [0, 0] }, 
        maxGuests: 4,
        propertyType: 'House'
      };
    });

    // 3. WIPE AND RE-SEED
    await Property.deleteMany({});
    console.log("🗑️ Database cleared.");

    await Property.insertMany(formattedProperties);
    console.log(`✅ SUCCESS: ${formattedProperties.length} properties seeded!`);

    console.log("\n--- POST-SEED INSTRUCTIONS ---");
    console.log("1. Logout of the website.");
    console.log("2. Login again to refresh your role to 'host'.");
    console.log("3. Images should now load via http://localhost:5000/uploads/[filename]");

    process.exit();
  } catch (err) {
    console.error("❌ SEED FAILED:", err.message);
    process.exit(1);
  }
};

seedDB();