import React, { useState } from 'react';
import { 
  Home, 
  MapPin, 
  Image as ImageIcon, 
  IndianRupee, 
  ChevronRight, 
  ChevronLeft,
  Upload,
  CheckCircle2
} from 'lucide-react';
import Button from '../../components/common/Button';

const AddProperty = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'House',
    location: '',
    price: '',
    images: [],
    amenities: []
  });

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const StepIndicator = () => (
    <div className="flex items-center justify-center gap-4 mb-12">
      {[1, 2, 3, 4].map((num) => (
        <div key={num} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
            step >= num ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            {step > num ? <CheckCircle2 size={16} /> : num}
          </div>
          {num < 4 && <div className={`w-12 h-[2px] mx-2 ${step > num ? 'bg-black' : 'bg-gray-200'}`} />}
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <header className="text-center mb-10">
        <h1 className="text-3xl font-bold">List your home</h1>
        <p className="text-gray-500 mt-2">Step {step} of 4</p>
      </header>

      <StepIndicator />

      <div className="bg-white border rounded-3xl p-8 shadow-sm min-h-[400px]">
        {/* Step 1: Basics */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="flex items-center gap-3 text-rose-500 mb-2">
              <Home size={24} />
              <h2 className="text-xl font-bold text-gray-900">The Basics</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">Property Title</label>
                <input 
                  type="text" 
                  placeholder="e.g., Cozy Beachfront Villa"
                  className="w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-black"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Description</label>
                <textarea 
                  rows="4"
                  placeholder="Tell guests what makes your place special..."
                  className="w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-black"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Location */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="flex items-center gap-3 text-blue-500 mb-2">
              <MapPin size={24} />
              <h2 className="text-xl font-bold text-gray-900">Location</h2>
            </div>
            <p className="text-gray-500 text-sm">Guests will only get your exact address after they book.</p>
            <input 
              type="text" 
              placeholder="Enter city, state, or area"
              className="w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-black"
              value={formData.location}
              onChange={(e) => setFormData({...formData, location: e.target.value})}
            />
            <div className="h-64 bg-gray-100 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-300">
               <p className="text-gray-400 text-sm italic">Interactive Map Picker Coming Soon...</p>
            </div>
          </div>
        )}

        {/* Step 3: Photos */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="flex items-center gap-3 text-purple-500 mb-2">
              <ImageIcon size={24} />
              <h2 className="text-xl font-bold text-gray-900">Photos</h2>
            </div>
            <div className="border-2 border-dashed border-gray-300 rounded-3xl p-12 text-center hover:bg-gray-50 transition-colors cursor-pointer group">
              <Upload className="mx-auto text-gray-400 group-hover:text-black mb-4" size={48} />
              <p className="font-bold">Click to upload photos</p>
              <p className="text-sm text-gray-500 mt-1">Add at least 5 photos for best results</p>
            </div>
          </div>
        )}

        {/* Step 4: Pricing */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
            <div className="flex items-center gap-3 text-green-600 mb-2">
              <IndianRupee size={24} />
              <h2 className="text-xl font-bold text-gray-900">Pricing</h2>
            </div>
            <div className="p-8 bg-gray-50 rounded-3xl text-center">
              <span className="text-gray-500 text-lg mr-2">₹</span>
              <input 
                type="number" 
                placeholder="0"
                className="text-6xl font-bold bg-transparent border-none outline-none w-48 text-center"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})}
              />
              <p className="text-gray-500 mt-4 text-sm font-medium">per night</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="mt-8 flex justify-between items-center bg-white p-4 sticky bottom-0 border-t md:border-none">
        <button 
          onClick={prevStep}
          disabled={step === 1}
          className={`flex items-center gap-1 font-bold underline ${step === 1 ? 'invisible' : ''}`}
        >
          <ChevronLeft size={20} /> Back
        </button>
        
        {step < 4 ? (
          <Button variant="dark" onClick={nextStep} className="flex items-center gap-2 px-8">
            Next <ChevronRight size={20} />
          </Button>
        ) : (
          <Button variant="primary" onClick={() => alert('Listing Published!')} className="px-10">
            Publish Listing
          </Button>
        )}
      </div>
    </div>
  );
};

export default AddProperty;