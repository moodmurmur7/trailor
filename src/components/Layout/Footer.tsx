import React from 'react'
import { Scissors, Phone, Mail, MapPin, Instagram, Facebook } from 'lucide-react'
import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="bg-[#1A1D23] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-[#C8A951] p-2 rounded-lg">
                <Scissors className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Royal Tailors</h3>
                <p className="text-sm text-gray-400">Since 1950</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Crafting bespoke garments with uncompromising quality and 
              attention to detail for over seven decades.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4 text-[#C8A951]">Quick Links</h4>
            <div className="space-y-2">
              <Link to="/fabrics" className="block text-gray-300 hover:text-white transition-colors">
                Premium Fabrics
              </Link>
              <Link to="/garments" className="block text-gray-300 hover:text-white transition-colors">
                Garment Types
              </Link>
              <Link to="/collections" className="block text-gray-300 hover:text-white transition-colors">
                Special Collections
              </Link>
              <Link to="/track" className="block text-gray-300 hover:text-white transition-colors">
                Track Your Order
              </Link>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold mb-4 text-[#C8A951]">Services</h4>
            <div className="space-y-2">
              <p className="text-gray-300">Custom Tailoring</p>
              <p className="text-gray-300">Home Measurements</p>
              <p className="text-gray-300">Alterations</p>
              <p className="text-gray-300">Express Orders</p>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4 text-[#C8A951]">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-[#C8A951]" />
                <span className="text-gray-300">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-[#C8A951]" />
                <span className="text-gray-300">orders@royaltailors.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-[#C8A951]" />
                <span className="text-gray-300">123 Fashion Street, Mumbai</span>
              </div>
              <div className="flex space-x-3 mt-4">
                <Instagram className="w-5 h-5 text-[#C8A951] hover:text-white cursor-pointer transition-colors" />
                <Facebook className="w-5 h-5 text-[#C8A951] hover:text-white cursor-pointer transition-colors" />
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Royal Tailors. All rights reserved. | Crafted with precision and care.
          </p>
        </div>
      </div>
    </footer>
  )
}