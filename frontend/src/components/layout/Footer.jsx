import React from 'react';
import { Globe, Facebook, Twitter, Instagram, IndianRupee } from 'lucide-react';

const Footer = () => {
  const footerSections = [
    {
      title: "Support",
      links: ["Help Centre", "AirCover", "Anti-discrimination", "Disability support", "Cancellation options"]
    },
    {
      title: "Hosting",
      links: ["Airbnb your home", "AirCover for Hosts", "Hosting resources", "Community forum", "Hosting responsibly"]
    },
    {
      title: "Airbnb",
      links: ["Newsroom", "New features", "Careers", "Investors", "Gift cards"]
    }
  ];

  return (
    <footer className="bg-[#F7F7F7] border-t border-gray-300 pt-12 pb-8 px-6 md:px-20">
      {/* Top Section: Categorized Links */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-gray-300">
        {footerSections.map((section) => (
          <div key={section.title}>
            <h4 className="font-bold text-gray-900 mb-4">{section.title}</h4>
            <ul className="space-y-3">
              {section.links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-600 hover:underline text-sm transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Bottom Section: Legal & Socials */}
      <div className="max-w-7xl mx-auto pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-wrap justify-center md:justify-start items-center gap-2 text-sm text-gray-900">
          <span>© 2025 Airbnb Clone, Inc.</span>
          <span className="hidden md:inline">·</span>
          <a href="#" className="hover:underline">Privacy</a>
          <span>·</span>
          <a href="#" className="hover:underline">Terms</a>
          <span>·</span>
          <a href="#" className="hover:underline">Sitemap</a>
          <span>·</span>
          <a href="#" className="hover:underline">Company details</a>
        </div>

        <div className="flex items-center gap-6">
          {/* Language and Currency */}
          <div className="flex items-center gap-4 font-semibold text-sm">
            <button className="flex items-center gap-2 hover:underline">
              <Globe size={18} />
              English (IN)
            </button>
            <button className="flex items-center gap-2 hover:underline">
              <IndianRupee size={16} />
              INR
            </button>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <Facebook size={20} className="cursor-pointer hover:text-gray-600" />
            <Twitter size={20} className="cursor-pointer hover:text-gray-600" />
            <Instagram size={20} className="cursor-pointer hover:text-gray-600" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;