import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, DollarSign, ShoppingBag, Users, Calendar, BarChart3 } from 'lucide-react'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'

export function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState('30d')
  const [analytics, setAnalytics] = useState({
    revenue: {
      total: 125000,
      growth: 12.5,
      trend: 'up'
    },
    orders: {
      total: 45,
      growth: 8.3,
      trend: 'up'
    },
    customers: {
      total: 32,
      growth: 15.2,
      trend: 'up'
    },
    avgOrderValue: {
      total: 2778,
      growth: -2.1,
      trend: 'down'
    }
  })

  const revenueData = [
    { month: 'Jan', revenue: 45000, orders: 18 },
    { month: 'Feb', revenue: 52000, orders: 22 },
    { month: 'Mar', revenue: 48000, orders: 19 },
    { month: 'Apr', revenue: 61000, orders: 25 },
    { month: 'May', revenue: 55000, orders: 21 },
    { month: 'Jun', revenue: 67000, orders: 28 }
  ]

  const topProducts = [
    { name: 'Wedding Sherwani', orders: 12, revenue: 144000 },
    { name: 'Business Suit', orders: 8, revenue: 68000 },
    { name: 'Classic Shirt', orders: 15, revenue: 22500 },
    { name: 'Saree Blouse', orders: 6, revenue: 15000 }
  ]

  const topFabrics = [
    { name: 'Premium Silk', orders: 18, revenue: 45000 },
    { name: 'Italian Wool', orders: 12, revenue: 38400 },
    { name: 'Egyptian Cotton', orders: 10, revenue: 18000 },
    { name: 'Banarasi Silk', orders: 5, revenue: 22500 }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1A1D23]">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Track your business performance and insights</p>
        </div>
        <div className="flex space-x-2">
          {['7d', '30d', '90d', '1y'].map(range => (
            <Button
              key={range}
              variant={timeRange === range ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(range)}
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-[#1A1D23] mt-1">
                ₹{analytics.revenue.total.toLocaleString()}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className={`w-4 h-4 mr-1 ${
                  analytics.revenue.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`} />
                <span className={`text-sm font-medium ${
                  analytics.revenue.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {analytics.revenue.growth}%
                </span>
                <span className="text-sm text-gray-500 ml-1">vs last period</span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-green-50">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-[#1A1D23] mt-1">{analytics.orders.total}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 mr-1 text-green-600" />
                <span className="text-sm font-medium text-green-600">
                  {analytics.orders.growth}%
                </span>
                <span className="text-sm text-gray-500 ml-1">vs last period</span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-blue-50">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">New Customers</p>
              <p className="text-2xl font-bold text-[#1A1D23] mt-1">{analytics.customers.total}</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 mr-1 text-green-600" />
                <span className="text-sm font-medium text-green-600">
                  {analytics.customers.growth}%
                </span>
                <span className="text-sm text-gray-500 ml-1">vs last period</span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-purple-50">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-bold text-[#1A1D23] mt-1">
                ₹{analytics.avgOrderValue.total.toLocaleString()}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp className="w-4 h-4 mr-1 text-red-600 rotate-180" />
                <span className="text-sm font-medium text-red-600">
                  {Math.abs(analytics.avgOrderValue.growth)}%
                </span>
                <span className="text-sm text-gray-500 ml-1">vs last period</span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-[#C8A951] bg-opacity-10">
              <BarChart3 className="w-6 h-6 text-[#C8A951]" />
            </div>
          </div>
        </Card>
      </div>

      {/* Revenue Chart */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-[#1A1D23]">Revenue Trend</h2>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-[#C8A951] rounded-full"></div>
              <span className="text-sm text-gray-600">Revenue</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Orders</span>
            </div>
          </div>
        </div>
        <div className="h-64 flex items-end justify-between space-x-2">
          {revenueData.map((data, index) => (
            <div key={data.month} className="flex-1 flex flex-col items-center">
              <div className="w-full flex flex-col items-center space-y-1">
                <div 
                  className="w-full bg-[#C8A951] rounded-t"
                  style={{ height: `${(data.revenue / 70000) * 200}px` }}
                ></div>
                <div 
                  className="w-3/4 bg-blue-500 rounded-t"
                  style={{ height: `${(data.orders / 30) * 100}px` }}
                ></div>
              </div>
              <span className="text-xs text-gray-600 mt-2">{data.month}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-[#1A1D23] mb-6">Top Products</h2>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-[#C8A951] bg-opacity-10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-[#C8A951]">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-[#1A1D23]">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.orders} orders</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-[#C8A951]">₹{product.revenue.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Top Fabrics */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-[#1A1D23] mb-6">Top Fabrics</h2>
          <div className="space-y-4">
            {topFabrics.map((fabric, index) => (
              <div key={fabric.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium text-[#1A1D23]">{fabric.name}</p>
                    <p className="text-sm text-gray-600">{fabric.orders} orders</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-[#C8A951]">₹{fabric.revenue.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Order Status Distribution */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-[#1A1D23] mb-6">Order Status Distribution</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { status: 'Confirmed', count: 8, color: 'bg-blue-500' },
            { status: 'In Progress', count: 15, color: 'bg-orange-500' },
            { status: 'Quality Check', count: 6, color: 'bg-purple-500' },
            { status: 'Ready', count: 4, color: 'bg-green-500' }
          ].map(item => (
            <div key={item.status} className="text-center">
              <div className={`w-16 h-16 ${item.color} rounded-full flex items-center justify-center mx-auto mb-2`}>
                <span className="text-white font-bold text-lg">{item.count}</span>
              </div>
              <p className="text-sm font-medium text-[#1A1D23]">{item.status}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}