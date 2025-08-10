import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { Header } from './components/Layout/Header'
import { Footer } from './components/Layout/Footer'
import { Home } from './pages/Home'
import { Fabrics } from './pages/Fabrics'
import { FabricDetail } from './pages/FabricDetail'
import { Garments } from './pages/Garments'
import { Collections } from './pages/Collections'
import { Customize } from './pages/Customize'
import { OrderConfirmation } from './pages/OrderConfirmation'
import { TrackOrder } from './pages/TrackOrder'
import { GarmentDetail } from './pages/GarmentDetail'
import { CollectionDetail } from './pages/CollectionDetail'
import { AdminLogin } from './pages/admin/Login'
import { AdminLayout } from './pages/admin/AdminLayout'
import { AdminDashboard } from './pages/admin/Dashboard'
import { AdminOrders } from './pages/admin/Orders'
import { AdminCustomers } from './pages/admin/Customers'
import { AdminProducts } from './pages/admin/Products'
import { AdminFabrics } from './pages/admin/Fabrics'
import { AdminAnalytics } from './pages/admin/Analytics'
import { AdminSettings } from './pages/admin/Settings'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={
            <>
              <Header />
              <Home />
              <Footer />
            </>
          } />
          <Route path="/fabrics" element={
            <>
              <Header />
              <Fabrics />
              <Footer />
            </>
          } />
          <Route path="/fabric/:id" element={
            <>
              <Header />
              <FabricDetail />
              <Footer />
            </>
          } />
          <Route path="/garments" element={
            <>
              <Header />
              <Garments />
              <Footer />
            </>
          } />
          <Route path="/garment/:id" element={
            <>
              <Header />
              <GarmentDetail />
              <Footer />
            </>
          } />
          <Route path="/collections" element={
            <>
              <Header />
              <Collections />
              <Footer />
            </>
          } />
          <Route path="/collection/:id" element={
            <>
              <Header />
              <CollectionDetail />
              <Footer />
            </>
          } />
          <Route path="/customize" element={
            <>
              <Header />
              <Customize />
              <Footer />
            </>
          } />
          <Route path="/order-confirmation/:trackingId" element={
            <>
              <Header />
              <OrderConfirmation />
              <Footer />
            </>
          } />
          <Route path="/track" element={
            <>
              <Header />
              <TrackOrder />
              <Footer />
            </>
          } />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="fabrics" element={<AdminFabrics />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App