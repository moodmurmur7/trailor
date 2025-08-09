import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'your-supabase-url'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key'

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Database = {
  public: {
    Tables: {
      customers: {
        Row: {
          id: string
          name: string
          phone: string
          email: string
          measurements_json: any
          created_at: string
        }
        Insert: {
          name: string
          phone: string
          email: string
          measurements_json?: any
        }
        Update: {
          name?: string
          phone?: string
          email?: string
          measurements_json?: any
        }
      }
      orders: {
        Row: {
          id: string
          customer_id: string
          fabric_id: string
          garment_id: string
          customizations_json: any
          price: number
          status: string
          tracking_id: string
          created_at: string
          estimated_completion: string
        }
        Insert: {
          customer_id: string
          fabric_id: string
          garment_id: string
          customizations_json?: any
          price: number
          status?: string
          tracking_id: string
          estimated_completion?: string
        }
        Update: {
          status?: string
          price?: number
          customizations_json?: any
          estimated_completion?: string
        }
      }
      fabrics: {
        Row: {
          id: string
          name: string
          material: string
          price_per_meter: number
          color: string
          stock: number
          images_json: string[]
          featured: boolean
          created_at: string
        }
        Insert: {
          name: string
          material: string
          price_per_meter: number
          color: string
          stock?: number
          images_json?: string[]
          featured?: boolean
        }
        Update: {
          name?: string
          material?: string
          price_per_meter?: number
          color?: string
          stock?: number
          images_json?: string[]
          featured?: boolean
        }
      }
      garments: {
        Row: {
          id: string
          name: string
          base_price: number
          description: string
          image_url: string
          category: string
          created_at: string
        }
        Insert: {
          name: string
          base_price: number
          description: string
          image_url: string
          category: string
        }
        Update: {
          name?: string
          base_price?: number
          description?: string
          image_url?: string
          category?: string
        }
      }
    }
  }
}