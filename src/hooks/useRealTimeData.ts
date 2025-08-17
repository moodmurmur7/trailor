import { useState, useEffect } from 'react'
import { 
  orderAPI, 
  customerAPI, 
  fabricAPI, 
  garmentAPI,
  subscribeToOrders,
  subscribeToCustomers,
  Order,
  Customer,
  Fabric,
  Garment
} from '../lib/supabase'

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await orderAPI.getAll()
      setOrders(data)
    } catch (err: any) {
      console.error('Error fetching orders:', err)
      setError(err.message || 'Failed to fetch orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
    
    const subscription = subscribeToOrders(fetchOrders)
    
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return { orders, loading, error, refetch: fetchOrders }
}

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await customerAPI.getAll()
      setCustomers(data)
    } catch (err: any) {
      console.error('Error fetching customers:', err)
      setError(err.message || 'Failed to fetch customers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
    
    const subscription = subscribeToCustomers(fetchCustomers)
    
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return { customers, loading, error, refetch: fetchCustomers }
}

export function useFabrics() {
  const [fabrics, setFabrics] = useState<Fabric[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchFabrics = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await fabricAPI.getAll()
      setFabrics(data)
    } catch (err: any) {
      console.error('Error fetching fabrics:', err)
      setError(err.message || 'Failed to fetch fabrics')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchFabrics()
  }, [])

  return { fabrics, loading, error, refetch: fetchFabrics }
}

export function useGarments() {
  const [garments, setGarments] = useState<Garment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchGarments = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await garmentAPI.getAll()
      setGarments(data)
    } catch (err: any) {
      console.error('Error fetching garments:', err)
      setError(err.message || 'Failed to fetch garments')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGarments()
  }, [])

  return { garments, loading, error, refetch: fetchGarments }
}

export function useOrderTracking(trackingId: string | null) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const trackOrder = async (id: string) => {
    try {
      setLoading(true)
      setError(null)
      const data = await orderAPI.getByTrackingId(id)
      setOrder(data)
    } catch (err: any) {
      console.error('Error tracking order:', err)
      setError('Order not found or failed to load')
      setOrder(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (trackingId) {
      trackOrder(trackingId)
    }
  }, [trackingId])

  return { order, loading, error, trackOrder }
}

// Alias for backward compatibility
export const useRealTimeOrders = useOrders
export const useRealTimeCustomers = useCustomers