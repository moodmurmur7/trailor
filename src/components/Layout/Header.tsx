import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Scissors, ShoppingBag, Search, User } from 'lucide-react'
import { Button } from '../ui/Button'
import { motion } from 'framer-motion'

export function Header() {
  const location = useLocation()
  const isActive = (path: string) => location.pathname === path

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-[#C8A951] p-2 rounded-lg">
              <Scissors className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#1A1D23]">Royal Tailors</h1>
              <p className="text-xs text-gray-600">Crafting Excellence Since 1950</p>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/fabrics" 
              className={`text-sm font-medium transition-colors ${
                isActive('/fabrics') ? 'text-[#C8A951]' : 'text-gray-700 hover:text-[#C8A951]'
              }`}
            >
              Fabrics
            </Link>
            <Link 
              to="/garments" 
              className={`text-sm font-medium transition-colors ${
                isActive('/garments') ? 'text-[#C8A951]' : 'text-gray-700 hover:text-[#C8A951]'
              }`}
            >
              Garments
            </Link>
            <Link 
              to="/collections" 
              className={`text-sm font-medium transition-colors ${
                isActive('/collections') ? 'text-[#C8A951]' : 'text-gray-700 hover:text-[#C8A951]'
              }`}
            >
              Collections
            </Link>
            <Link 
              to="/track" 
              className={`text-sm font-medium transition-colors ${
                isActive('/track') ? 'text-[#C8A951]' : 'text-gray-700 hover:text-[#C8A951]'
              }`}
            >
              Track Order
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-700 hover:text-[#C8A951] transition-colors"
            >
              <Search className="w-5 h-5" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 text-gray-700 hover:text-[#C8A951] transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
            </motion.button>
            <Link to="/customize">
              <Button>Start Custom Order</Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}