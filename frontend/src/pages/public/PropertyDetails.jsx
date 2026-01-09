import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, X, ChevronDown, CheckCircle, Loader2, Minus, Plus, MapPin } from 'lucide-react';
import axios from 'axios';
import PaymentSuccess from "../../components/common/PaymentSuccess";
import Button from "../../components/common/Button";
import { useApp } from '../../context/AppContext';
import { toast } from 'react-hot-toast';

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, API_BASE_URL } = useApp();
  
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [showGuestMenu, setShowGuestMenu] = useState(false);

  // --- Helper: Clean Image URL ---
  const getImageUrl = useCallback((img) => {
    if (!img) return "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200";
    if (img.startsWith('http')) return img;
    const baseUrl = (API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");
    const filename = img.split(/[\\/]/).pop();
    return `${baseUrl}/uploads/${filename}`;
  }, [API_BASE_URL]);

  // 1. FETCH PROPERTY DATA
  useEffect(() => {
    const fetchProperty = async () => {
      if (!id || id === 'undefined') return;
      try {
        setLoading(true);
        const baseUrl = (API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");
        const response = await axios.get(`${baseUrl}/api/v1/properties/${id}`);
        if (response.data.success) {
          setProperty(response.data.data);
        }
      } catch (error) {
        console.error("Property Fetch Error:", error);
        toast.error("Failed to load property details");
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id, API_BASE_URL]);

  // 2. CHECK IF ALREADY BOOKED
  const isAlreadyBooked = user?.bookings?.some((booking) => {
    const bPropId = booking.property?._id || booking.property || booking;
    return String(bPropId) === String(id);
  });

  // 3. CALCULATION LOGIC
  const calculateNights = () => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = end - start;
    return diff > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0;
  };

  const nights = calculateNights();
  const baseRate = property?.price || 0;
  const totalBasePrice = nights > 0 ? baseRate * nights : 0;
  const serviceFee = Math.round(totalBasePrice * 0.05);
  const finalTotal = totalBasePrice + serviceFee;

  // 4. RAZORPAY PAYMENT SUBMIT
  const handlePaymentSubmit = async () => {
    if (!user) return navigate('/login');
    setIsProcessing(true);

    try {
      const token = localStorage.getItem('token');
      const bookingData = {
        propertyId: id,
        checkIn,
        checkOut,
        guests,
        totalPrice: finalTotal
      };

      const { data } = await axios.post(`${API_BASE_URL}/api/v1/bookings`, bookingData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
        amount: data.order.amount,
        currency: "INR",
        name: "Airbnb Clone",
        description: `Booking for ${property.title}`,
        order_id: data.order.id,
        handler: async function (response) {
          try {
            const verifyRes = await axios.post(
              `${API_BASE_URL}/api/v1/bookings/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verifyRes.data.success) {
              setShowPayment(false);
              setShowSuccess(true);
              toast.success("Payment Successful!");
            }
          } catch (err) {
            toast.error("Payment verification failed.");
          }
        },
        prefill: { name: user.name, email: user.email },
        theme: { color: "#FF385C" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-rose-500" size={40} />
    </div>
  );

  if (!property) return (
    <div className="pt-40 text-center flex flex-col items-center gap-4">
      <h2 className="text-2xl font-bold text-gray-800">Property not found!</h2>
      <Button onClick={() => navigate('/')}>Back to Home</Button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 pt-28 font-sans animate-in fade-in duration-700">
      <div className="flex justify-between items-start mb-6">
        <div>
           <h1 className="text-3xl font-semibold text-gray-900">{property.title}</h1>
           <div className="flex items-center gap-4 my-2 text-sm font-medium">
             <span className="flex items-center gap-1"><Star size={16} className="fill-black text-black"/> {property.rating || '4.8'}</span>
             <span className="underline flex items-center gap-1"><MapPin size={14}/> {property.city}, {property.country}</span>
           </div>
        </div>
        
        {isAlreadyBooked && (
          <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full border border-green-200">
            <CheckCircle size={18} />
            <span className="font-bold text-sm">Booking Confirmed</span>
          </div>
        )}
      </div>

      {/* Main Image */}
      <div className="rounded-2xl overflow-hidden h-[500px] mb-8 shadow-md">
        <img 
          src={getImageUrl(property.images?.[0])} 
          className="w-full h-full object-cover" 
          alt={property.title} 
          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200"; }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2">
          <div className="border-b pb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Hosted by {property.host?.name || 'Professional Host'}</h2>
            <p className="text-gray-500 mt-1">{property.maxGuests || 4} guests · {property.bedrooms || 2} bedrooms · {property.category}</p>
          </div>
          <p className="py-8 text-gray-700 leading-relaxed font-light text-lg">{property.description}</p>
        </div>

        {/* Reservation Card */}
        <div className="border rounded-2xl p-6 shadow-xl h-fit sticky top-28 bg-white z-10">
          <div className="flex justify-between items-center mb-6">
            <span className="text-2xl font-bold">₹{property.price?.toLocaleString('en-IN')} <span className="text-base font-light">night</span></span>
          </div>
          
          {!isAlreadyBooked ? (
            <>
              <div className="border rounded-xl mb-4 overflow-visible shadow-sm">
                <div className="flex border-b">
                  <div className="flex-1 p-3 border-r">
                    <label className="block text-[10px] font-bold uppercase text-gray-500">Check-in</label>
                    <input type="date" min={new Date().toISOString().split('T')[0]} className="w-full text-sm outline-none bg-transparent" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
                  </div>
                  <div className="flex-1 p-3">
                    <label className="block text-[10px] font-bold uppercase text-gray-500">Check-out</label>
                    <input type="date" min={checkIn || new Date().toISOString().split('T')[0]} className="w-full text-sm outline-none bg-transparent" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
                  </div>
                </div>
                
                {/* Guest Menu Section */}
                <div className="relative">
                  <div 
                    className="p-3 cursor-pointer flex justify-between items-center hover:bg-gray-50 transition" 
                    onClick={() => setShowGuestMenu(!showGuestMenu)}
                  >
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500">Guests</label>
                      <span className="text-sm font-medium">{guests} guest{guests > 1 ? 's' : ''}</span>
                    </div>
                    <ChevronDown size={18} className={`text-gray-400 transition-transform ${showGuestMenu ? 'rotate-180' : ''}`} />
                  </div>
                  
                  {showGuestMenu && (
                    <div 
                      className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-xl mt-2 p-4 shadow-2xl z-[100]"
                      onClick={(e) => e.stopPropagation()} 
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-800 text-sm">Guests</span>
                          <span className="text-[10px] text-gray-400">Max {property.maxGuests || 10}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <button 
                            type="button"
                            onClick={() => setGuests(prev => Math.max(1, prev - 1))}
                            className={`w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:border-black hover:text-black transition-colors ${guests <= 1 ? 'opacity-30 cursor-not-allowed' : 'opacity-100'}`}
                            disabled={guests <= 1}
                          >
                            <Minus size={16} strokeWidth={3} />
                          </button>
                          
                          <span className="font-bold text-gray-900 w-4 text-center">{guests}</span>
                          
                          <button 
                            type="button"
                            onClick={() => setGuests(prev => Math.min(property.maxGuests || 10, prev + 1))}
                            className={`w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:border-black hover:text-black transition-colors ${guests >= (property.maxGuests || 10) ? 'opacity-30 cursor-not-allowed' : 'opacity-100'}`}
                            disabled={guests >= (property.maxGuests || 10)}
                          >
                            <Plus size={16} strokeWidth={3} />
                          </button>
                        </div>
                      </div>
                      <button 
                        onClick={() => setShowGuestMenu(false)}
                        className="w-full mt-4 py-2 bg-gray-900 text-white rounded-lg text-[10px] font-bold uppercase tracking-wider hover:bg-black transition-colors"
                      >
                        Apply Selection
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <Button 
                fullWidth 
                disabled={!checkIn || !checkOut || nights <= 0}
                onClick={() => setShowPayment(true)}
              >
                {nights > 0 ? 'Reserve' : 'Select Dates'}
              </Button>
            </>
          ) : (
            <div className="space-y-4">
               <div className="p-4 bg-gray-50 rounded-xl border border-dashed text-center">
                 <p className="text-sm text-gray-600">You have already booked this property.</p>
               </div>
               <Button fullWidth onClick={() => navigate('/trips')} className="bg-black text-white">Go to My Trips</Button>
            </div>
          )}

          {nights > 0 && !isAlreadyBooked && (
            <div className="mt-4 space-y-3">
              <div className="flex justify-between text-gray-600">
                <span className="underline">₹{property.price.toLocaleString('en-IN')} x {nights} nights</span>
                <span>₹{totalBasePrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span className="underline">Service fee (5%)</span>
                <span>₹{serviceFee.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-gray-900 border-t pt-3 mt-3">
                <span className="font-bold text-lg">Total</span>
                <span className="font-bold text-lg">₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* PAYMENT CONFIRMATION MODAL */}
      {showPayment && (
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-3xl p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-2xl font-bold">Confirm Booking</h2>
                <button onClick={() => setShowPayment(false)} className="hover:bg-gray-100 p-2 rounded-full transition"><X size={20}/></button>
              </div>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3 bg-gray-50 p-3 rounded-xl">
                  <img src={getImageUrl(property.images?.[0])} className="w-16 h-16 rounded-lg object-cover" alt="" />
                  <div>
                    <p className="font-bold text-sm leading-tight">{property.title}</p>
                    <p className="text-xs text-gray-500 mt-1">{property.city}</p>
                  </div>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Dates:</span>
                  <span className="font-bold">{checkIn} to {checkOut}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Guests:</span>
                  <span className="font-bold">{guests} guest{guests > 1 ? 's' : ''}</span>
                </div>
              </div>
              <Button fullWidth isLoading={isProcessing} onClick={handlePaymentSubmit} className="bg-rose-600">
                Proceed to Pay ₹{finalTotal.toLocaleString('en-IN')}
              </Button>
            </div>
        </div>
      )}

      {showSuccess && (
        <PaymentSuccess nights={nights} onClose={() => { setShowSuccess(false); navigate('/trips'); }} />
      )}
    </div>
  );
};

export default PropertyDetails;