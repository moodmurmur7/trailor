import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables. Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database types
export interface Customer {
  id: string
  name: string
  phone: string
  email: string
  address?: string
  date_of_birth?: string
  gender?: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface Measurement {
  id: string
  customer_id: string
  chest?: number
  waist?: number
  hips?: number
  shoulder?: number
  sleeve_length?: number
  shirt_length?: number
  trouser_length?: number
  neck?: number
  bicep?: number
  wrist?: number
  thigh?: number
  knee?: number
  ankle?: number
  method: 'manual' | 'home_visit' | 'saved' | 'guide'
  measured_by?: string
  notes?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Fabric {
  id: string
  name: string
  material: string
  color: string
  pattern?: string
  weight?: string
  price_per_meter: number
  stock_meters: number
  minimum_stock: number
  supplier?: string
  fabric_code?: string
  care_instructions?: string
  description?: string
  images: string[]
  featured: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Garment {
  id: string
  name: string
  category: string
  subcategory?: string
  base_price: number
  description?: string
  image_url?: string
  customization_options: Record<string, any>
  fabric_requirement: number
  stitching_time_days: number
  difficulty_level?: string
  gender?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  tracking_id: string
  customer_id?: string
  status: string
  total_amount: number
  advance_paid: number
  balance_amount: number
  payment_method?: string
  payment_status: string
  urgent: boolean
  urgent_charges: number
  special_instructions?: string
  estimated_completion_date?: string
  actual_completion_date?: string
  delivery_method: string
  delivery_address?: string
  delivery_charges: number
  discount_amount: number
  tax_amount: number
  created_at: string
  updated_at: string
  customer?: Customer
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  garment_id?: string
  fabric_id?: string
  measurement_id?: string
  quantity: number
  garment_price: number
  fabric_price_per_meter: number
  fabric_meters_used: number
  customizations: Record<string, any>
  item_total: number
  notes?: string
  created_at: string
  updated_at: string
  garment?: Garment
  fabric?: Fabric
  measurement?: Measurement
}

// API functions
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
      .eq('is_active', true)
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
      .eq('is_active', true)
      .single()
    
    if (error) throw error
    return data
  },

  async updateStock(id: string, metersUsed: number) {
    const { error } = await supabase
      .from('fabrics')
      .update({ 
        stock_meters: supabase.raw(`stock_meters - ${metersUsed}`)
      })
      .eq('id', id)
    
    if (error) throw error
  }
}

export const garmentAPI = {
  async getAll() {
    const { data, error } = await supabase
      .from('garments')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data || []
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('garments')
      .select('*')
      .eq('id', id)
      .eq('is_active', true)
      .single()
    
    if (error) throw error
    return data
  }
}

export const measurementAPI = {
  async create(data: Partial<Measurement>) {
    const { data: measurement, error } = await supabase
      .from('measurements')
      .insert(data)
      .select()
      .single()
    
    if (error) throw error
    return measurement
  },

  async getByCustomerId(customerId: string) {
    const { data, error } = await supabase
      .from('measurements')
      .select('*')
      .eq('customer_id', customerId)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
    
    if (error) throw error
    return data?.[0] || null
  }
}

export const orderAPI = {
  async create(orderData: {
    customer: Partial<Customer>
    measurements: Partial<Measurement>
    items: Array<{
      garment_id: string
      fabric_id: string
      customizations: Record<string, any>
      garment_price: number
      fabric_price_per_meter: number
      fabric_meters_used: number
    }>
    urgent: boolean
    special_instructions?: string
    delivery_method: string
    delivery_address?: string
  }) {
    try {
      // Start transaction
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .insert(orderData.customer)
        .select()
        .single()

      if (customerError) throw customerError

      // Create measurements
      const { data: measurement, error: measurementError } = await supabase
        .from('measurements')
        .insert({
          ...orderData.measurements,
          customer_id: customer.id
        })
        .select()
        .single()

      if (measurementError) throw measurementError

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_id: customer.id,
          urgent: orderData.urgent,
          urgent_charges: orderData.urgent ? 500 : 0,
          special_instructions: orderData.special_instructions,
          delivery_method: orderData.delivery_method,
          delivery_address: orderData.delivery_address,
          delivery_charges: orderData.delivery_method === 'home_delivery' ? 200 : 0,
          estimated_completion_date: new Date(Date.now() + (orderData.urgent ? 7 : 14) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          status: 'confirmed'
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = orderData.items.map(item => ({
        ...item,
        order_id: order.id,
        measurement_id: measurement.id,
        quantity: 1,
        item_total: item.garment_price + (item.fabric_price_per_meter * item.fabric_meters_used)
      }))

      const { data: items, error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)
        .select()

      if (itemsError) throw itemsError

      // Update fabric stock
      for (const item of orderData.items) {
        await fabricAPI.updateStock(item.fabric_id, item.fabric_meters_used)
      }

      return {
        ...order,
        customer,
        order_items: items
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
        order_items(
          *,
          garment:garments(*),
          fabric:fabrics(*),
          measurement:measurements(*)
        )
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
        order_items(
          *,
          garment:garments(*),
          fabric:fabrics(*),
          measurement:measurements(*)
        )
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
        actual_completion_date: status === 'completed' ? new Date().toISOString().split('T')[0] : null
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
    .on('postgres_changes', { event: '*', schema: 'public', table: 'order_items' }, callback)
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