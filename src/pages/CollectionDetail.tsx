import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Eye, ShoppingBag, Star } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'

export function CollectionDetail() {
  const { id } = useParams()
  const [collection, setCollection] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])

  useEffect(() => {
    // Sample collection data
    const collections = {
      wedding: {
        id: 'wedding',
        name: 'Wedding Collection',
        description: 'Exquisite garments for your special day',
        image: 'https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg',
        priceRange: '₹8,000 - ₹25,000',
        items: [
          {
            id: '1',
            name: 'Royal Wedding Sherwani',
            price: 15000,
            image: 'https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg',
            description: 'Luxurious sherwani with gold embroidery'
          },
          {
            id: '2',
            name: 'Bridal Lehenga Blouse',
            price: 12000,
            image: 'https://images.pexels.com/photos/8849295/pexels-photo-8849295.jpeg',
            description: 'Elegant blouse with intricate beadwork'
          },
          {
            id: '3',
            name: 'Groom\'s Wedding Suit',
            price: 18000,
            image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg',
            description: 'Premium wedding suit with custom tailoring'
          }
        ]
      },
      festive: {
        id: 'festive',
        name: 'Festive Collection',
        description: 'Celebrate in style with our festive wear',
        image: 'https://images.pexels.com/photos/8849295/pexels-photo-8849295.jpeg',
        priceRange: '₹2,500 - ₹12,000',
        items: [
          {
            id: '4',
            name: 'Festive Kurta',
            price: 3500,
            image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg',
            description: 'Traditional kurta for festivals'
          },
          {
            id: '5',
            name: 'Anarkali Dress',
            price: 8500,
            image: 'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg',
            description: 'Flowing anarkali with embellishments'
          }
        ]
      },
      office: {
        id: 'office',
        name: 'Office Wear',
        description: 'Professional attire for the modern workplace',
        image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg',
        priceRange: '₹1,500 - ₹15,000',
        items: [
          {
            id: '6',
            name: 'Business Shirt',
            price: 2500,
            image: 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg',
            description: 'Professional shirt for office wear'
          },
          {
            id: '7',
            name: 'Formal Blazer',
            price: 8500,
            image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg',
            description: 'Tailored blazer for business meetings'
          }
        ]
      }
    }

    const foundCollection = collections[id as keyof typeof collections]
    if (foundCollection) {
      setCollection(foundCollection)
      setItems(foundCollection.items)
    }
  }, [id])

  if (!collection) {
    return (
      <div className="min-h-screen bg-[#F8F5F0] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#C8A951]"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F5F0] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link to="/collections" className="inline-flex items-center text-[#C8A951] hover:text-[#B8992E] mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Collections
        </Link>

        {/* Collection Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <Card className="overflow-hidden">
            <div className="relative">
              <img
                src={collection.image}
                alt={collection.name}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h1 className="text-4xl font-bold mb-2">{collection.name}</h1>
                <p className="text-gray-200 text-lg mb-2">{collection.description}</p>
                <p className="text-[#C8A951] font-semibold text-lg">{collection.priceRange}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Collection Items */}
        <div>
          <h2 className="text-2xl font-semibold text-[#1A1D23] mb-8">Items in this Collection</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <Card hover className="overflow-hidden group">
                  <div className="relative">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-[#C8A951] text-white px-3 py-1 rounded-full text-sm font-medium">
                      ₹{item.price.toLocaleString()}
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-[#1A1D23] mb-2">{item.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                    <div className="flex items-center mb-4">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-[#C8A951] fill-current" />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 ml-2">(4.8)</span>
                    </div>
                    <div className="flex space-x-2">
                      <Link to={`/garment/${item.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                      <Link to={`/customize?garment=${item.id}`}>
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
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <Card className="p-12 bg-gradient-to-r from-[#1A1D23] to-[#2A2D33] text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Create Your Perfect Garment?</h2>
            <p className="text-gray-300 text-lg mb-8">
              Start customizing any item from this collection
            </p>
            <div className="space-x-4">
              <Link to="/customize">
                <Button size="lg" className="bg-[#C8A951] hover:bg-[#B8992E]">
                  Start Custom Order
                </Button>
              </Link>
              <Link to="/fabrics">
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-[#1A1D23]">
                  Browse Fabrics
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}