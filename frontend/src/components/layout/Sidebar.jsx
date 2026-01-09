import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Home, 
  CalendarCheck, 
  Wallet, 
  MessageSquare, 
  Settings,
  Star
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const Sidebar = () => {
  // Navigation items specific to a Host
  const menuItems = [
    { name: 'Dashboard', path: '/host/dashboard', icon: <LayoutDashboard size={22} /> },
    { name: 'My Listings', path: '/host/properties', icon: <Home size={22} /> },
    { name: 'Bookings', path: '/host/bookings', icon: <CalendarCheck size={22} /> },
    { name: 'Earnings', path: '/host/earnings', icon: <Wallet size={22} /> },
    { name: 'Reviews', path: '/host/reviews', icon: <Star size={22} /> },
    { name: 'Messages', path: '/host/messages', icon: <MessageSquare size={22} /> },
    { name: 'Settings', path: '/host/settings', icon: <Settings size={22} /> },
  ];

  return (
    <aside className="w-full md:w-64 bg-white border-r border-gray-200 h-screen sticky top-20 flex flex-col">
      <div className="p-6">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Hosting Menu
        </h2>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => twMerge(
              "flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all group",
              isActive 
                ? "bg-[#FF385C]/10 text-[#FF385C]" 
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            )}
          >
            {/* Icon logic: Active state colors the icon */}
            <span className="group-hover:scale-110 transition-transform duration-200">
              {item.icon}
            </span>
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Profile Quick-view */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-2xl">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#FF385C] to-[#E31C5F] flex items-center justify-center text-white font-bold">
            JD
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold truncate">John Doe</p>
            <p className="text-xs text-gray-500 truncate">Superhost</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;