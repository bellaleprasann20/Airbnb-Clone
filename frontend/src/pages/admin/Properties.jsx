import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Search, 
  ExternalLink, 
  Ban, 
  CheckCircle,
  Filter
} from 'lucide-react';
import api from '../../services/api';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';

const AdminProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all | pending | active | suspended

  useEffect(() => {
    const fetchAllProperties = async () => {
      try {
        const { data } = await api.get(`/admin/properties?status=${filter}`);
        setProperties(data);
      } catch (err) {
        console.error("Failed to fetch admin property list", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProperties();
  }, [filter]);

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await api.patch(`/admin/properties/${id}/status`, { status: newStatus });
      // Refresh list or update local state
      setProperties(prev => prev.map(p => p._id === id ? { ...p, status: newStatus } : p));
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (loading) return <Loader type="full" />;

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Property Moderation</h1>
          <p className="text-sm text-gray-500">Review, approve, or suspend listings globally.</p>
        </div>
        
        <div className="flex gap-2">
          {['all', 'pending', 'active'].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${
                filter === s ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr className="text-xs uppercase text-gray-500 font-bold">
              <th className="px-6 py-4">Property & Host</th>
              <th className="px-6 py-4">Current Status</th>
              <th className="px-6 py-4">Pricing</th>
              <th className="px-6 py-4">Verification</th>
              <th className="px-6 py-4 text-right">Moderation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {properties.map((property) => (
              <tr key={property._id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={property.images[0]} className="w-12 h-12 rounded object-cover" />
                    <div>
                      <p className="font-bold text-sm line-clamp-1">{property.title}</p>
                      <p className="text-xs text-blue-600 cursor-pointer hover:underline flex items-center gap-1">
                        Host: {property.hostName} <ExternalLink size={10} />
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${
                    property.status === 'active' ? 'bg-green-50 text-green-700 border-green-200' :
                    property.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                    'bg-red-50 text-red-700 border-red-200'
                  }`}>
                    {property.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  ₹{property.pricePerNight.toLocaleString('en-IN')}
                </td>
                <td className="px-6 py-4">
                  {property.isVerified ? (
                    <div className="flex items-center gap-1 text-green-600 text-xs font-bold">
                      <ShieldCheck size={14} /> Verified
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-gray-400 text-xs font-bold">
                      <ShieldAlert size={14} /> Unverified
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    {property.status === 'pending' && (
                      <Button 
                        variant="dark" 
                        size="sm" 
                        className="bg-green-600 hover:bg-green-700 border-none h-8 text-xs"
                        onClick={() => handleStatusUpdate(property._id, 'active')}
                      >
                        Approve
                      </Button>
                    )}
                    <button 
                      onClick={() => handleStatusUpdate(property._id, 'suspended')}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Suspend Listing"
                    >
                      <Ban size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProperties;