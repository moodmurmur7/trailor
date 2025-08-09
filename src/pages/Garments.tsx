import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Eye, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'
import { Garment } from '../types'

export function Garments() {
  const [garments, setGarments] = useState<Garment[]>([])
  const [filteredGarments, setFilteredGarments] = useState<Garment[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  useEffect(() => {
    fetchGarments()
  }, [])

  useEffect(() => {
    filterGarments()
  }, [garments, searchTerm, selectedCategory])

  const fetchGarments = async () => {
    try {
      // Sample garment data
      const sampleGarments = [
        {
          id: '1',
          name: 'Classic Shirt',
          category: 'Shirts',
          base_price: 1500,
          description: 'Timeless classic shirt perfect for office and casual wear',
          image_url: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg',
          customization_options: {
            collar: ['Regular', 'Button Down', 'Spread', 'Cutaway'],
            sleeves: ['Full Sleeve', 'Half Sleeve', 'Quarter Sleeve'],
            fit: ['Regular', 'Slim', 'Relaxed'],
            cuffs: ['Regular', 'French', 'Convertible'],
            pockets: ['None', 'Single', 'Double']
          },
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          name: 'Business Suit',
          category: 'Suits',
          base_price: 8500,
          description: 'Professional business suit for formal occasions',
          image_url: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg',
          customization_options: {
            jacket: ['Single Breasted', 'Double Breasted'],
            lapels: ['Notch', 'Peak', 'Shawl'],
            buttons: ['2 Button', '3 Button'],
            vents: ['No Vent', 'Single Vent', 'Double Vent'],
            trouser: ['Flat Front', 'Pleated']
          },
          created_at: new Date().toISOString()
        },
        {
          id: '3',
          name: 'Wedding Sherwani',
          category: 'Sherwanis',
          base_price: 12000,
          description: 'Elegant sherwani for weddings and special occasions',
          image_url: 'https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg',
          customization_options: {
            collar: ['Band', 'High Neck', 'Nehru'],
            length: ['Knee Length', 'Mid Thigh', 'Full Length'],
            buttons: ['Traditional', 'Modern', 'Decorative'],
            embroidery: ['None', 'Light', 'Heavy', 'Custom Design']
          },
          created_at: new Date().toISOString()
        },
        {
          id: '4',
          name: 'Saree Blouse',
          category: 'Saree Blouses',
          base_price: 2500,
          description: 'Custom fitted saree blouse with various neckline options',
          image_url: 'https://images.pexels.com/photos/8849295/pexels-photo-8849295.jpeg',
          customization_options: {
            neckline: ['Round', 'V-Neck', 'Square', 'Boat', 'Halter'],
            sleeves: ['Sleeveless', 'Cap Sleeve', 'Half Sleeve', 'Full Sleeve'],
            back: ['Regular', 'Deep Back', 'Keyhole', 'Tie-up'],
            embellishment: ['None', 'Beadwork', 'Embroidery', 'Sequins']
          },
          created_at: new Date().toISOString()
        },
        {
          id: '5',
          name: 'Casual Kurta',
          category: 'Kurtas',
          base_price: 1800,
          description: 'Comfortable kurta for daily wear and casual occasions',
          image_url: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg',
          customization_options: {
            collar: ['Band', 'Nehru', 'Chinese'],
            length: ['Short', 'Medium', 'Long'],
            sleeves: ['Full Sleeve', 'Half Sleeve', 'Quarter Sleeve'],
            bottom: ['Straight', 'A-Line', 'Asymmetric']
          },
          created_at: new Date().toISOString()
        },
        {
          id: '6',
          name: 'Evening Dress',
          category: 'Dresses',
          base_price: 6500,
          description: 'Elegant evening dress for special occasions',
          image_url: 'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg',
          customization_options: {
            neckline: ['Strapless', 'Halter', 'V-Neck', 'Off-Shoulder'],
            length: ['Knee Length', 'Midi', 'Floor Length'],
            fit: ['A-Line', 'Mermaid', 'Straight', 'Ball Gown'],
            back: ['Zipper', 'Lace-up', 'Open Back']
          },
          created_at: new Date().toISOString()
        }
      ]
      
      setGarments(sampleGarments)
    } catch (error) {
      console.error('Error fetching garments:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterGarments = () => {
    let filtered = garments

    if (searchTerm) {
      filtered = filtered.filter(garment =>
        garment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        garment.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        garment.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(garment => garment.category === selectedCategory)
    }

    setFilteredGarments(filtered)
  }

  const categories = [...new Set(garments.map(g => g.category))]

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F5F0] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#C8A951]"></div>
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
          <p className="text-gray-600 text-lg">Choose from our wide range of garment styles</p>
        </motion.div>

        {/* Filters */}
        <Card className="p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          </div>
        </Card>

        {/* Garment Grid */}
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
                    src={garment.image_url}
                    alt={garment.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-[#C8A951] text-white px-3 py-1 rounded-full text-sm font-medium">
                    {garment.category}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-[#1A1D23]">{garment.name}</h3>
                    <span className="text-[#C8A951] font-bold">₹{garment.base_price}</span>
                  </div>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{garment.description}</p>
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

        {filteredGarments.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No garments found matching your criteria.</p>
            <Button
              onClick={() => {
                setSearchTerm('')
                setSelectedCategory('all')
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}