import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Crown, Heart, Briefcase, Sparkles, Calendar, Star } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

export function Collections() {
  const collections = [
    {
      id: 'wedding',
      name: 'Wedding Collection',
      description: 'Exquisite garments for your special day',
      icon: Crown,
      image: 'https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg',
      items: ['Sherwanis', 'Lehengas', 'Wedding Suits', 'Saree Blouses'],
      priceRange: '₹8,000 - ₹25,000',
      featured: true
    },
    {
      id: 'festive',
      name: 'Festive Collection',
      description: 'Celebrate in style with our festive wear',
      icon: Sparkles,
      image: 'https://images.pexels.com/photos/8849295/pexels-photo-8849295.jpeg',
      items: ['Kurtas', 'Anarkalis', 'Festive Shirts', 'Traditional Wear'],
      priceRange: '₹2,500 - ₹12,000',
      featured: true
    },
    {
      id: 'office',
      name: 'Office Wear',
      description: 'Professional attire for the modern workplace',
      icon: Briefcase,
      image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg',
      items: ['Business Suits', 'Formal Shirts', 'Blazers', 'Trousers'],
      priceRange: '₹1,500 - ₹15,000',
      featured: false
    },
    {
      id: 'casual',
      name: 'Casual Collection',
      description: 'Comfortable everyday wear',
      icon: Heart,
      image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg',
      items: ['Casual Shirts', 'Kurtas', 'Dresses', 'Casual Wear'],
      priceRange: '₹1,200 - ₹5,000',
      featured: false
    },
    {
      id: 'evening',
      name: 'Evening Wear',
      description: 'Elegant attire for special occasions',
      icon: Star,
      image: 'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg',
      items: ['Evening Gowns', 'Cocktail Dresses', 'Formal Wear', 'Party Wear'],
      priceRange: '₹4,000 - ₹18,000',
      featured: true
    },
    {
      id: 'seasonal',
      name: 'Seasonal Specials',
      description: 'Limited time seasonal collections',
      icon: Calendar,
      image: 'https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg',
      items: ['Summer Linens', 'Winter Wools', 'Monsoon Wear', 'Holiday Specials'],
      priceRange: '₹1,800 - ₹8,000',
      featured: false
    }
  ]

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
          <h1 className="text-4xl font-bold text-[#1A1D23] mb-4">Special Collections</h1>
          <p className="text-gray-600 text-lg">Curated collections for every occasion and season</p>
        </motion.div>

        {/* Featured Collections */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-[#1A1D23] mb-6">Featured Collections</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {collections.filter(c => c.featured).map((collection, index) => (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card hover className="overflow-hidden group">
                  <div className="relative">
                    <img
                      src={collection.image}
                      alt={collection.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 text-white">
                      <div className="flex items-center space-x-2 mb-2">
                        <collection.icon className="w-6 h-6 text-[#C8A951]" />
                        <span className="bg-[#C8A951] text-white px-2 py-1 rounded-full text-xs font-medium">
                          Featured
                        </span>
                      </div>
                      <h3 className="text-2xl font-bold mb-2">{collection.name}</h3>
                      <p className="text-gray-200 mb-2">{collection.description}</p>
                      <p className="text-[#C8A951] font-semibold">{collection.priceRange}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-4">
                      {collection.items.map((item, idx) => (
                        <span
                          key={idx}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                    <Link to={`/collection/${collection.id}`}>
                      <Button className="w-full">
                        Explore Collection
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* All Collections */}
        <div>
          <h2 className="text-2xl font-semibold text-[#1A1D23] mb-6">All Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {collections.map((collection, index) => (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card hover className="overflow-hidden group">
                  <div className="relative">
                    <img
                      src={collection.image}
                      alt={collection.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {collection.featured && (
                      <div className="absolute top-4 right-4 bg-[#C8A951] text-white px-2 py-1 rounded-full text-xs font-medium">
                        Featured
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-white bg-opacity-90 p-2 rounded-full">
                      <collection.icon className="w-5 h-5 text-[#C8A951]" />
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-[#1A1D23] mb-2">{collection.name}</h3>
                    <p className="text-gray-600 text-sm mb-3">{collection.description}</p>
                    <p className="text-[#C8A951] font-semibold mb-4">{collection.priceRange}</p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {collection.items.slice(0, 3).map((item, idx) => (
                        <span
                          key={idx}
                          className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs"
                        >
                          {item}
                        </span>
                      ))}
                      {collection.items.length > 3 && (
                        <span className="text-gray-500 text-xs px-2 py-1">
                          +{collection.items.length - 3} more
                        </span>
                      )}
                    </div>
                    <Link to={`/collection/${collection.id}`}>
                      <Button variant="outline" className="w-full">
                        View Collection
                      </Button>
                    </Link>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <Card className="p-12 bg-gradient-to-r from-[#1A1D23] to-[#2A2D33] text-white">
            <h2 className="text-3xl font-bold mb-4">Can't Find What You're Looking For?</h2>
            <p className="text-gray-300 text-lg mb-8">
              Our master tailors can create custom designs based on your vision
            </p>
            <div className="space-x-4">
              <Link to="/customize">
                <Button size="lg" className="bg-[#C8A951] hover:bg-[#B8992E]">
                  Start Custom Order
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-[#1A1D23]">
                  Contact Us
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}