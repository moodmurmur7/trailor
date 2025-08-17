import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ShoppingBag, ZoomIn as Zoom, Clock, Truck, AlertCircle } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { fabricAPI, Fabric } from '../lib/supabase'

export function FabricDetail() {
  const { id } = useParams()
  const [fabric, setFabric] = useState<Fabric | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)

  useEffect(() => {
    if (id) {
      fetchFabric()
    }
  }, [id])

  const fetchFabric = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await fabricAPI.getById(id!)
      setFabric(data)
    } catch (error: any) {
      console.error('Error fetching fabric:', error)
      setError('Fabric not found or failed to load.')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F5F0] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#C8A951] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading fabric details...</p>
        </div>
      </div>
    )
  }

  if (error || !fabric) {
    return (
      <div className="min-h-screen bg-[#F8F5F0] flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Fabric Not Found</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link to="/fabrics">
            <Button>Back to Fabrics</Button>
          </Link>
        </Card>
      </div>
    )
  }

  const images = fabric.images_json && fabric.images_json.length > 0 
    ? fabric.images_json 
    : ['https://images.pexels.com/photos/6069107/pexels-photo-6069107.jpeg']

  return (
    <div className="min-h-screen bg-[#F8F5F0] py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link to="/fabrics" className="inline-flex items-center text-[#C8A951] hover:text-[#B8992E] mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Fabrics
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <Card className="overflow-hidden">
              <div className="relative">
                <img
                  src={images[selectedImage]}
                  alt={fabric.name}
                  className={`w-full h-96 object-cover cursor-zoom-in transition-transform duration-300 ${
                    isZoomed ? 'scale-150' : 'scale-100'
                  }`}
                  onClick={() => setIsZoomed(!isZoomed)}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/6069107/pexels-photo-6069107.jpeg'
                  }}
                />
                <button
                  onClick={() => setIsZoomed(!isZoomed)}
                  className="absolute top-4 right-4 bg-white bg-opacity-90 p-2 rounded-full hover:bg-opacity-100 transition-all"
                >
                  <Zoom className="w-5 h-5 text-[#1A1D23]" />
                </button>
              </div>
            </Card>
            
            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="flex space-x-2">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-[#C8A951]' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${fabric.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/6069107/pexels-photo-6069107.jpeg'
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold text-[#1A1D23]">{fabric.name}</h1>
                {fabric.featured && (
                  <span className="bg-[#C8A951] text-white px-3 py-1 rounded-full text-sm font-medium">
                    Featured
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-4 mb-4">
                <span className="text-2xl font-bold text-[#C8A951]">₹{fabric.price_per_meter}/meter</span>
                <span className="text-gray-600">•</span>
                <span className={`${fabric.stock <= 0 ? 'text-red-600' : fabric.stock <= 10 ? 'text-orange-600' : 'text-gray-600'}`}>
                  {fabric.stock} meters available
                </span>
              </div>
              <div className="flex items-center space-x-6 mb-6">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Material:</span>
                  <span className="text-sm text-gray-600">{fabric.material}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Color:</span>
                  <span className="text-sm text-gray-600">{fabric.color}</span>
                </div>
              </div>
            </div>

            {fabric.description && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-[#1A1D23] mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed">{fabric.description}</p>
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
              <Link to={`/customize?fabric=${fabric.id}`} className="block">
                <Button size="lg" className="w-full" disabled={fabric.stock === 0}>
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  {fabric.stock === 0 ? 'Out of Stock' : 'Start Custom Order'}
                </Button>
              </Link>
              <Link to="/garments" className="block">
                <Button variant="outline" size="lg" className="w-full">
                  Browse Garment Types
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}