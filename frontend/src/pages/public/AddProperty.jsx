import React, { useState } from "react";

const AddProperty = () => {
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    city: "",
    country: "",
    category: "",
    price: "",
  });
  
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle text input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Handle file selection
  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
    if (errors.images) {
      setErrors(prev => ({ ...prev, images: "" }));
    }
  };

  // Remove image
  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 20) {
      newErrors.description = "Description must be at least 20 characters";
    }
    
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
    
    if (!formData.country.trim()) {
      newErrors.country = "Country is required";
    }
    
    if (!formData.category) {
      newErrors.category = "Category is required";
    }
    
    if (!formData.price) {
      newErrors.price = "Price is required";
    } else if (isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = "Price must be a valid number greater than 0";
    }
    
    if (images.length === 0) {
      newErrors.images = "At least one photo is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Get API URL and token
      const API_BASE_URL = "http://localhost:5000"; // Replace with your actual API URL
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert("Please login first");
        window.location.href = "/login";
        return;
      }
      
      // Create FormData for file upload
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("city", formData.city);
      formDataToSend.append("country", formData.country);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("price", formData.price);
      
      // Append all images
      images.forEach((image) => {
        formDataToSend.append("images", image);
      });
      
      // Make API call
      console.log("Sending request to:", `${API_BASE_URL}/api/v1/properties`);
      console.log("With token:", token ? "Token exists" : "No token");
      
      const response = await fetch(`${API_BASE_URL}/api/v1/properties`, {
        method: 'POST',
        body: formDataToSend,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log("Response status:", response.status);
      
      const data = await response.json();
      console.log("Response data:", data);
      
      if (!response.ok) {
        throw new Error(data.message || `Server error: ${response.status}`);
      }
      
      console.log("Property added successfully:", data);
      
      alert("Property added successfully! Redirecting to your listings...");
      
      // Redirect to host dashboard or my listings
      setTimeout(() => {
        window.location.href = "/my-listings";
      }, 1000);
      
    } catch (error) {
      console.error("Error adding property:", error);
      alert(error.message || "Failed to add property. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/host";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Add New Property</h1>
          <p className="text-gray-600 mt-2">Fill in the details to list your property</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8">
          
          {/* Title */}
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
              Property Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Cozy 2BR Apartment in Downtown"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              placeholder="Describe your property, amenities, nearby attractions..."
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none resize-none ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
            />
            <div className="flex justify-between items-center mt-1">
              {errors.description ? (
                <p className="text-red-500 text-sm">{errors.description}</p>
              ) : (
                <p className="text-gray-500 text-sm">Minimum 20 characters</p>
              )}
              <p className="text-gray-400 text-sm">{formData.description.length} characters</p>
            </div>
          </div>

          {/* City */}
          <div className="mb-6">
            <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2">
              City *
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="e.g., Mumbai, Goa, Bangalore"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none ${
                errors.city ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
          </div>

          {/* Country */}
          <div className="mb-6">
            <label htmlFor="country" className="block text-sm font-semibold text-gray-700 mb-2">
              Country *
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="e.g., India, USA, UK"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none ${
                errors.country ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
          </div>

          {/* Category */}
          <div className="mb-6">
            <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none ${
                errors.category ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select a category</option>
              <option value="Beachfront">Beachfront</option>
              <option value="Mountains">Mountains</option>
              <option value="Camping">Camping</option>
              <option value="Tropical">Tropical</option>
              <option value="Castles">Castles</option>
              <option value="Bed & Breakfasts">Bed & Breakfasts</option>
              <option value="Iconic Cities">Iconic Cities</option>
              <option value="Arctic">Arctic</option>
              <option value="Amazing pools">Amazing pools</option>
            </select>
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>

          {/* Price */}
          <div className="mb-6">
            <label htmlFor="price" className="block text-sm font-semibold text-gray-700 mb-2">
              Price per Night (INR) *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-gray-500 text-lg">₹</span>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="5000"
                min="0"
                step="1"
                className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none ${
                  errors.price ? "border-red-500" : "border-gray-300"
                }`}
              />
            </div>
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>

          {/* Photos */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Property Photos *
            </label>
            
            {/* Upload Area */}
            <label className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors block ${
              errors.images ? "border-red-500" : "border-gray-300"
            }`}>
              <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-base font-semibold text-gray-700 mb-1">
                Click to upload photos
              </p>
              <p className="text-sm text-gray-500">
                PNG, JPG or JPEG (Max 10MB each)
              </p>
              
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFiles}
                className="hidden"
              />
            </label>
            
            {errors.images && <p className="text-red-500 text-sm mt-2">{errors.images}</p>}

            {/* Image Preview Grid */}
            {images.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-3">
                  {images.length} photo{images.length !== 1 ? 's' : ''} selected
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {images.map((img, i) => (
                    <div key={i} className="relative group">
                      <img
                        src={URL.createObjectURL(img)}
                        alt={`preview ${i + 1}`}
                        className="h-32 w-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                      >
                        <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      {i === 0 && (
                        <div className="absolute bottom-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                          Cover Photo
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Adding Property..." : "Add Property"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;