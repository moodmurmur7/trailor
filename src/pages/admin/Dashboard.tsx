import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, Users, ShoppingBag, Clock, TrendingUp, Calendar, Phone, Mail } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { supabase } from '../../lib/supabase'
import { Order, Customer } from '../../types'

export function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [stats, setStats] = useState({
    todayOrders: 0,
    inProgress: 0,
    readyForPickup: 0,
    urgentOrders: 0,
    totalRevenue: 0
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      // Fetch orders
      const { data: ordersData } = await supabase
        .from('orders')
        .select(`
          *,
          customer:customers(*),
          fabric:fabrics(*),
          garment:garments(*)
        `)
        .order('created_at', { ascending: false })
        .limit(10)

      // Fetch customers
      const { data: customersData } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)

      if (ordersData) setOrders(ordersData)
      if (customersData) setCustomers(customersData)

      // Calculate stats
      const today = new Date().toISOString().split('T')[0]
      const todayOrders = ordersData?.filter(order => 
        order.created_at.split('T')[0] === today
      ).length || 0

      const inProgress = ordersData?.filter(order => 
        !['ready', 'completed'].includes(order.status)
      ).length || 0

      const readyForPickup = ordersData?.filter(order => 
        order.status === 'ready'
      ).length || 0

      const totalRevenue = ordersData?.reduce((sum, order) => sum + order.price, 0) || 0

      setStats({
        todayOrders,
        inProgress,
        readyForPickup,
        urgentOrders: 0,
        totalRevenue
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    }
  }

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1A1D23]">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <Button onClick={fetchDashboardData}>
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
                  <p className="text-2xl font-bold text-[#1A1D23] mt-1">{stat.value}</p>
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
            {orders.slice(0, 5).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-[#1A1D23]">
                    {order.customer?.name || 'Unknown Customer'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.garment?.name} - {order.fabric?.name}
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
                      : 'bg-orange-100 text-orange-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Customers */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#1A1D23]">Recent Customers</h2>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
          <div className="space-y-4">
            {customers.map((customer) => (
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
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}