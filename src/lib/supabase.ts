import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types matching the actual schema
export interface Customer {
  id: string
  name: string
  phone: string
  email: string
  measurements_json?: any
  created_at: string
  updated_at: string
}

export interface Fabric {
  id: string
  name: string
  material: string
  color: string
  price_per_meter: number
  stock: number
  images_json: string[]
  featured: boolean
  description?: string
  created_at: string
  updated_at: string
}

export interface Garment {
  id: string
  name: string
  category: string
  base_price: number
  description?: string
  image_url?: string
  customization_options?: any
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  customer_id?: string
  fabric_id?: string
  garment_id?: string
  tracking_id: string
  customizations_json?: any
  measurements_json?: any
  price: number
  status: string
  urgent: boolean
  special_instructions?: string
  estimated_completion?: string
  created_at: string
  updated_at: string
  customer?: Customer
  fabric?: Fabric
  garment?: Garment
}

// API functions with proper error handling
export const customerAPI = {
  async create(data: Partial<Customer>) {
    const { data: customer, error } = await supabase
      .from('customers')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return customer
  },

  async getAll() {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async update(id: string, data: Partial<Customer>) {
    const { data: customer, error } = await supabase
      .from('customers')
      .update(data)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return customer
  }
}

export const fabricAPI = {
  async getAll() {
    const { data, error } = await supabase
      .from('fabrics')
      .select('*')
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('fabrics')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async updateStock(id: string, newStock: number) {
    const { error } = await supabase
      .from('fabrics')
      .update({ stock: newStock })
      .eq('id', id)
    
    if (error) throw error
  }
}

export const garmentAPI = {
  async getAll() {
    const { data, error } = await supabase
      .from('garments')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('garments')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }
}

export const orderAPI = {
  async create(orderData: {
    customer: Partial<Customer>
    fabric_id: string
    garment_id: string
    customizations: any
    measurements: any
    price: number
    urgent: boolean
    special_instructions?: string
  }) {
    try {
      // Create customer first
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .insert({
          name: orderData.customer.name,
          phone: orderData.customer.phone,
          email: orderData.customer.email,
          measurements_json: orderData.measurements
        })
        .select()
        .single()

      if (customerError) throw customerError

      // Generate tracking ID
      const trackingId = 'RT' + Date.now().toString().slice(-6)

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_id: customer.id,
          fabric_id: orderData.fabric_id,
          garment_id: orderData.garment_id,
          tracking_id: trackingId,
          customizations_json: orderData.customizations,
          measurements_json: orderData.measurements,
          price: orderData.price,
          status: 'confirmed',
          urgent: orderData.urgent,
          special_instructions: orderData.special_instructions || '',
          estimated_completion: new Date(Date.now() + (orderData.urgent ? 7 : 14) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        })
        .select()
        .single()

      if (orderError) throw orderError

      return {
        ...order,
        customer,
        tracking_id: trackingId
      }
    } catch (error) {
      console.error('Error creating order:', error)
      throw error
    }
  },

  async getAll() {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        customer:customers(*),
        fabric:fabrics(*),
        garment:garments(*)
      `)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getByTrackingId(trackingId: string) {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        customer:customers(*),
        fabric:fabrics(*),
        garment:garments(*)
      `)
      .eq('tracking_id', trackingId)
      .single()
    
    if (error) throw error
    return data
  },

  async updateStatus(id: string, status: string) {
    const { data, error } = await supabase
      .from('orders')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  }
}

// Real-time subscriptions
export const subscribeToOrders = (callback: () => void) => {
  return supabase
    .channel('orders_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, callback)
    .subscribe()
}

export const subscribeToCustomers = (callback: () => void) => {
  return supabase
    .channel('customers_changes')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'customers' }, callback)
    .subscribe()
}

// Helper functions
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error)
  if (error?.message) {
    throw new Error(error.message)
  }
  throw new Error('An unexpected error occurred')
}