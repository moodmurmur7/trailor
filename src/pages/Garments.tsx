import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Eye, ShoppingBag, AlertCircle, RefreshCw } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'
import { useGarments } from '../hooks/useRealTimeData'
import { Garment } from '../lib/supabase'

export function Garments() {
  const { garments, loading, error, refetch } = useGarments()
  const [filteredGarments, setFilteredGarments] = useState<Garment[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedGender, setSelectedGender] = useState('all')

  useEffect(() => {
    filterGarments()
  }, [garments, searchTerm, selectedCategory, selectedGender])

  const filterGarments = () => {
    let filtered = garments

    if (searchTerm) {
      filtered = filtered.filter(garment =>
        garment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        garment.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        garment.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(garment => garment.category === selectedCategory)
    }

    if (selectedGender !== 'all') {
      filtered = filtered.filter(garment => garment.gender === selectedGender || garment.gender === 'unisex')
    }

    setFilteredGarments(filtered)
  }

  const categories = [...new Set(garments.map(g => g.category))]
  const genders = [...new Set(garments.map(g => g.gender).filter(Boolean))]

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8F5F0] flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Garments</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={refetch}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F5F0] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-[#1A1D23] mb-4">Garment Collection</h1>
          <p className="text-gray-600 text-lg">Choose from our wide range of expertly crafted garment styles</p>
        </motion.div>

        {/* Filters */}
        <Card className="p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search garments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C8A951]"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C8A951]"
            >
              <option value="all">All Genders</option>
              {genders.map(gender => (
                <option key={gender} value={gender}>{gender?.charAt(0).toUpperCase() + gender?.slice(1)}</option>
              ))}
            </select>
          </div>
        </Card>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#C8A951] mx-auto mb-4"></div>
            <p className="text-gray-600">Loading garments...</p>
          </div>
        )}

        {/* Garment Grid */}
        {!loading && filteredGarments.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGarments.map((garment, index) => (
              <motion.div
                key={garment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card hover className="overflow-hidden group">
                  <div className="relative">
                    <img
                      src={garment.image_url || 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg'}
                      alt={garment.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg'
                      }}
                    />
                    <div className="absolute top-4 right-4 bg-[#C8A951] text-white px-3 py-1 rounded-full text-sm font-medium">
                      {garment.category}
                    </div>
                    {garment.difficulty_level && (
                      <div className={`absolute top-4 left-4 px-2 py-1 rounded-full text-xs font-medium ${
                        garment.difficulty_level === 'easy' ? 'bg-green-100 text-green-800' :
                        garment.difficulty_level === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {garment.difficulty_level.toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-[#1A1D23]">{garment.name}</h3>
                      <span className="text-[#C8A951] font-bold">₹{garment.base_price.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-4 mb-3">
                      <span className="text-sm text-gray-600">{garment.category}</span>
                      {garment.gender && (
                        <>
                          <span className="text-sm text-gray-600">•</span>
                          <span className="text-sm text-gray-600">{garment.gender}</span>
                        </>
                      )}
                      <span className="text-sm text-gray-600">•</span>
                      <span className="text-sm text-gray-600">{garment.stitching_time_days} days</span>
                    </div>
                    {garment.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{garment.description}</p>
                    )}
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-1">Fabric Required: {garment.fabric_requirement}m</p>
                      {garment.customization_options && Object.keys(garment.customization_options).length > 0 && (
                        <p className="text-xs text-gray-500">
                          {Object.keys(garment.customization_options).length} customization options
                        </p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <Link to={`/garment/${garment.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                      <Link to={`/customize?garment=${garment.id}`}>
                        <Button>
                          <ShoppingBag className="w-4 h-4 mr-2" />
                          Customize
                        </Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredGarments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">
              {garments.length === 0 ? 'No garments available at the moment.' : 'No garments found matching your criteria.'}
            </p>
            {garments.length > 0 && (
              <Button
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                  setSelectedGender('all')
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}