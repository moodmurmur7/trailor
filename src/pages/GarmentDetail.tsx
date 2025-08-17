import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ShoppingBag, Clock, Truck, Palette, AlertCircle } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { garmentAPI, Garment } from '../lib/supabase'

export function GarmentDetail() {
  const { id } = useParams()
  const [garment, setGarment] = useState<Garment | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (id) {
      fetchGarment()
    }
  }, [id])

  const fetchGarment = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await garmentAPI.getById(id!)
      setGarment(data)
    } catch (error: any) {
      console.error('Error fetching garment:', error)
      setError('Garment not found or failed to load.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F5F0] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#C8A951] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading garment details...</p>
        </div>
      </div>
    )
  }

  if (error || !garment) {
    return (
      <div className="min-h-screen bg-[#F8F5F0] flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Garment Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link to="/garments">
            <Button>Back to Garments</Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8F5F0] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link to="/garments" className="inline-flex items-center text-[#C8A951] hover:text-[#B8992E] mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Garments
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <img
                src={garment.image_url || 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg'}
                alt={garment.name}
                className="w-full h-96 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg'
                }}
              />
            </Card>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold text-[#1A1D23]">{garment.name}</h1>
                <span className="bg-[#C8A951] text-white px-3 py-1 rounded-full text-sm font-medium">
                  {garment.category}
                </span>
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-2xl font-bold text-[#C8A951]">₹{garment.base_price.toLocaleString()}</span>
                <span className="text-gray-600">•</span>
                <span className="text-gray-600">Base Price</span>
              </div>
            </div>

            {garment.description && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-[#1A1D23] mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">{garment.description}</p>
              </Card>
            )}

            {/* Customization Options */}
            {garment.customization_options && Object.keys(garment.customization_options).length > 0 && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-[#1A1D23] mb-4">Customization Options</h3>
                <div className="space-y-4">
                  {Object.entries(garment.customization_options).map(([key, options]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-[#1A1D23] mb-2 capitalize">
                        {key.replace('_', ' ')}
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {(options as string[]).map((option) => (
                          <button
                            key={option}
                            className="px-3 py-1 border border-gray-300 rounded-full text-sm hover:border-[#C8A951] hover:text-[#C8A951] transition-colors"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Delivery Info */}
            <Card className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-[#C8A951]" />
                  <div>
                    <p className="font-medium text-[#1A1D23]">Stitching Time</p>
                    <p className="text-sm text-gray-600">10-14 days</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Truck className="w-5 h-5 text-[#C8A951]" />
                  <div>
                    <p className="font-medium text-[#1A1D23]">Delivery</p>
                    <p className="text-sm text-gray-600">Free pickup</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link to={`/customize?garment=${garment.id}`} className="block">
                <Button size="lg" className="w-full">
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  Customize This Garment
                </Button>
              </Link>
              <Link to="/fabrics" className="block">
                <Button variant="outline" size="lg" className="w-full">
                  <Palette className="w-5 h-5 mr-2" />
                  Choose Fabric
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}