import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, Users, ShoppingBag, Clock, TrendingUp, Calendar, Phone, Mail, RefreshCw, AlertCircle } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { useRealTimeOrders, useRealTimeCustomers } from '../../hooks/useRealTimeData'
import { Order, Customer } from '../../types'

export function AdminDashboard() {
  const { data: orders, loading: ordersLoading, error: ordersError, refetch: refetchOrders } = useRealTimeOrders()
  const { data: customers, loading: customersLoading, error: customersError, refetch: refetchCustomers } = useRealTimeCustomers()
  
  const [stats, setStats] = useState({
    todayOrders: 0,
    inProgress: 0,
    readyForPickup: 0,
    urgentOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0
  })

  useEffect(() => {
    if (orders.length > 0) {
      const today = new Date().toISOString().split('T')[0]
      
      const todayOrders = orders.filter(order => 
        order.created_at.split('T')[0] === today
      ).length

      const inProgress = orders.filter(order => 
        !['ready', 'completed'].includes(order.status)
      ).length

      const readyForPickup = orders.filter(order => 
        order.status === 'ready'
      ).length

      const urgentOrders = orders.filter(order => 
        order.urgent === true
      ).length

      const totalRevenue = orders.reduce((sum, order) => sum + (order.price || 0), 0)

      setStats({
        todayOrders,
        inProgress,
        readyForPickup,
        urgentOrders,
        totalRevenue,
        totalCustomers: customers.length
      })
    }
  }, [orders, customers])

  const loading = ordersLoading || customersLoading
  const error = ordersError || customersError

  const statCards = [
    {
      title: "Today's Orders",
      value: stats.todayOrders,
      icon: ShoppingBag,
      color: 'text-blue-600',
      bg: 'bg-blue-50'
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: Clock,
      color: 'text-orange-600',
      bg: 'bg-orange-50'
    },
    {
      title: 'Ready for Pickup',
      value: stats.readyForPickup,
      icon: Calendar,
      color: 'text-green-600',
      bg: 'bg-green-50'
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: 'text-[#C8A951]',
      bg: 'bg-[#C8A951] bg-opacity-10'
    }
  ]

  const handleRefresh = () => {
    refetchOrders()
    refetchCustomers()
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card className="p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={handleRefresh}>Try Again</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1A1D23]">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <Button onClick={handleRefresh} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-[#1A1D23] mt-1">
                    {loading ? (
                      <div className="animate-pulse bg-gray-200 h-8 w-16 rounded"></div>
                    ) : (
                      stat.value
                    )}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#1A1D23]">Recent Orders</h2>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          <div className="space-y-4">
            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 h-16 rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : orders.length > 0 ? (
              orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-[#1A1D23]">
                      {order.customer?.name || 'Unknown Customer'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.garment?.name || 'Custom Garment'} - {order.fabric?.name || 'Custom Fabric'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-[#C8A951]">₹{order.price.toLocaleString()}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'ready' 
                        ? 'bg-green-100 text-green-800'
                        : order.status === 'confirmed'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {order.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">No orders yet</p>
                <p className="text-sm text-gray-500 mt-1">Orders will appear here when customers place them</p>
              </div>
            )}
          </div>
        </Card>

        {/* Recent Customers */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#1A1D23]">Recent Customers</h2>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          <div className="space-y-4">
            {loading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 h-16 rounded-lg"></div>
                  </div>
                ))}
              </div>
            ) : customers.length > 0 ? (
              customers.slice(0, 5).map((customer) => (
                <div key={customer.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-[#1A1D23]">{customer.name}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="w-3 h-3" />
                      <span>{customer.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Mail className="w-3 h-3" />
                      <span>{customer.email}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      Joined {new Date(customer.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">No customers yet</p>
                <p className="text-sm text-gray-500 mt-1">Customer profiles will appear here</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-[#1A1D23] mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Button variant="outline" className="h-20 flex-col">
            <ShoppingBag className="w-6 h-6 mb-2" />
            <span>New Order</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col">
            <Users className="w-6 h-6 mb-2" />
            <span>Add Customer</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col">
            <BarChart3 className="w-6 h-6 mb-2" />
            <span>View Analytics</span>
          </Button>
          <Button variant="outline" className="h-20 flex-col">
            <Calendar className="w-6 h-6 mb-2" />
            <span>Schedule</span>
          </Button>
        </div>
      </Card>
    </div>
  )
}