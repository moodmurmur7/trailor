export interface Customer {
  id: string
  name: string
  phone: string
  email: string
  measurements_json?: any
  created_at: string
}

export interface Order {
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
  customer?: Customer
  fabric?: Fabric
  garment?: Garment
}

export interface Fabric {
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

export interface Garment {
  id: string
  name: string
  base_price: number
  description: string
  image_url: string
  category: string
  created_at: string
}

export interface Customization {
  fit: 'regular' | 'slim' | 'relaxed'
  collar: string
  sleeves: string
  cuffs: string
  pockets: string
  lining: boolean
  buttons: string
  embroidery?: string
  monogram?: string
  special_instructions?: string
}

export interface Measurements {
  chest?: number
  waist?: number
  hips?: number
  shoulder?: number
  sleeve_length?: number
  shirt_length?: number
  trouser_length?: number
  method: 'manual' | 'home_visit' | 'saved'
}

export const ORDER_STATUSES = [
  'confirmed',
  'fabric_ready',
  'cutting',
  'stitching',
  'embroidery',
  'quality_check',
  'ready'
] as const

export type OrderStatus = typeof ORDER_STATUSES[number]