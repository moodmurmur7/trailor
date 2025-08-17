import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, CheckCircle, Clock, Package, Scissors, Sparkles, Shield, Gift, AlertCircle } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card } from '../components/ui/Card'
import { orderAPI } from '../lib/supabase'

export function TrackOrder() {
  const [trackingId, setTrackingId] = useState('')
  const [orderStatus, setOrderStatus] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const statusSteps = [
    { key: 'confirmed', label: 'Order Confirmed', icon: CheckCircle },
    { key: 'fabric_ready', label: 'Fabric Ready', icon: Package },
    { key: 'cutting', label: 'Cutting in Progress', icon: Scissors },
    { key: 'stitching', label: 'Stitching in Progress', icon: Clock },
    { key: 'embroidery', label: 'Embroidery & Detailing', icon: Sparkles },
    { key: 'quality_check', label: 'Quality Check', icon: Shield },
    { key: 'ready', label: 'Ready for Pickup', icon: Gift }
  ]

  const handleTrackOrder = async () => {
    if (!trackingId.trim()) {
      setError('Please enter a tracking ID')
      return
    }
    
    setLoading(true)
    setError(null)
    
    try {
      const data = await orderAPI.getByTrackingId(trackingId.trim())

      if (data) {
        const statusIndex = statusSteps.findIndex(step => step.key === data.status)
        setOrderStatus({
          id: data.tracking_id,
          status: data.status,
          customerName: data.customer?.name || 'Customer',
          garmentType: data.garment?.name || 'Custom Garment',
          fabric: `${data.fabric?.name || 'Premium Fabric'} - ${data.fabric?.color || 'Custom Color'}`,
          orderDate: new Date(data.created_at).toLocaleDateString(),
          estimatedCompletion: new Date(data.estimated_completion).toLocaleDateString(),
          currentStep: statusIndex >= 0 ? statusIndex : 0,
          price: data.price,
          urgent: data.urgent,
          specialInstructions: data.special_instructions
        })
      }
    } catch (error: any) {
      console.error('Error tracking order:', error)
      setError('Order not found. Please check your tracking ID.')
      setOrderStatus(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8F5F0] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-[#1A1D23] mb-4">Track Your Order</h1>
          <p className="text-gray-600 text-lg">Enter your tracking ID to see real-time progress</p>
        </motion.div>

        <Card className="p-8 mb-8">
          <div className="flex space-x-4 max-w-md mx-auto">
            <Input
              placeholder="Enter Tracking ID (e.g., RT2025001)"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleTrackOrder()}
            />
            <Button onClick={handleTrackOrder} disabled={loading}>
              <Search className="w-4 h-4 mr-2" />
              {loading ? 'Tracking...' : 'Track'}
            </Button>
          </div>
          {error && (
            <div className="mt-4 flex items-center justify-center space-x-2 text-red-600">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </Card>

        {orderStatus && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {/* Order Details */}
            <Card className="p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-semibold text-[#1A1D23] mb-4">Order Details</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-600">Customer:</span>
                      <span className="ml-2 font-medium">{orderStatus.customerName}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Garment:</span>
                      <span className="ml-2 font-medium">{orderStatus.garmentType}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Fabric:</span>
                      <span className="ml-2 font-medium">{orderStatus.fabric}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Order Date:</span>
                      <span className="ml-2 font-medium">{orderStatus.orderDate}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Amount:</span>
                      <span className="ml-2 font-medium text-[#C8A951]">₹{orderStatus.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#1A1D23] mb-4">Delivery Info</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-600">Tracking ID:</span>
                      <span className="ml-2 font-mono font-bold text-[#C8A951]">{orderStatus.id}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Expected Completion:</span>
                      <span className="ml-2 font-medium">{orderStatus.estimatedCompletion}</span>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <span className="text-green-800 font-medium">
                        Status: {statusSteps[orderStatus.currentStep]?.label}
                      </span>
                      {orderStatus.urgent && (
                        <span className="ml-2 bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                          URGENT
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Progress Timeline */}
            <Card className="p-6">
              <h3 className="text-xl font-semibold text-[#1A1D23] mb-6">Order Progress</h3>
              <div className="space-y-4">
                {statusSteps.map((step, index) => {
                  const isCompleted = index <= orderStatus.currentStep
                  const isCurrent = index === orderStatus.currentStep
                  const Icon = step.icon

                  return (
                    <motion.div
                      key={step.key}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                      className="flex items-center space-x-4"
                    >
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center border-2
                        ${isCompleted 
                          ? 'bg-[#C8A951] border-[#C8A951] text-white' 
                          : 'bg-gray-100 border-gray-300 text-gray-400'
                        }
                        ${isCurrent ? 'ring-4 ring-[#C8A951] ring-opacity-20' : ''}
                      `}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-medium ${isCompleted ? 'text-[#1A1D23]' : 'text-gray-400'}`}>
                          {step.label}
                        </h4>
                        {isCurrent && (
                          <p className="text-sm text-[#C8A951] font-medium">In Progress</p>
                        )}
                      </div>
                      {isCompleted && !isCurrent && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </Card>

            {/* Special Instructions */}
            {orderStatus.specialInstructions && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-[#1A1D23] mb-3">Special Instructions</h3>
                <p className="text-gray-700 bg-gray-50 p-3 rounded">{orderStatus.specialInstructions}</p>
              </Card>
            )}

            {/* Next Steps */}
            <Card className="p-6 bg-[#C8A951] bg-opacity-10 border-[#C8A951] border-opacity-20">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-[#1A1D23] mb-2">What's Next?</h3>
                {orderStatus.currentStep < statusSteps.length - 1 ? (
                  <p className="text-gray-700">
                    Your order is currently in the <strong>{statusSteps[orderStatus.currentStep]?.label}</strong> stage.
                    We'll update you as soon as we move to the next step.
                  </p>
                ) : (
                  <p className="text-gray-700">
                    Your order is ready for pickup! Please bring this tracking ID when you visit our store.
                  </p>
                )}
              </div>
            </Card>
          </motion.div>
        )}

        {!orderStatus && !loading && (
          <Card className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <Package className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Enter your tracking ID above</h3>
            <p className="text-gray-500">We'll show you real-time progress of your custom order</p>
          </Card>
        )}
      </div>
    </div>
  )
}