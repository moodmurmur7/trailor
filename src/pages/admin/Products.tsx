import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Plus, Edit, Eye, Package, Trash2, Save, X } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card } from '../../components/ui/Card'
import { Modal } from '../../components/ui/Modal'
import { useGarments } from '../../hooks/useRealTimeData'
import { garmentAPI, Garment } from '../../lib/supabase'

export function AdminProducts() {
  const { garments, loading, error, refetch } = useGarments()
  const [filteredGarments, setFilteredGarments] = useState<Garment[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingGarment, setEditingGarment] = useState<Garment | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    base_price: 0,
    description: '',
    image_url: '',
    customization_options: {
      collar: ['Regular', 'Button Down', 'Spread'],
      sleeves: ['Full Sleeve', 'Half Sleeve'],
      fit: ['Regular', 'Slim', 'Relaxed']
    }
  })

  useEffect(() => {
    filterGarments()
  }, [garments, searchTerm, categoryFilter])

  const filterGarments = () => {
    let filtered = garments

    if (searchTerm) {
      filtered = filtered.filter(garment =>
        garment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        garment.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(garment => garment.category === categoryFilter)
    }

    setFilteredGarments(filtered)
  }

  const categories = [...new Set(garments.map(g => g.category))]

  const openCreateModal = () => {
    setFormData({
      name: '',
      category: '',
      base_price: 0,
      description: '',
      image_url: '',
      customization_options: {
        collar: ['Regular', 'Button Down', 'Spread'],
        sleeves: ['Full Sleeve', 'Half Sleeve'],
        fit: ['Regular', 'Slim', 'Relaxed']
      }
    })
    setEditingGarment(null)
    setIsCreating(true)
    setIsModalOpen(true)
  }

  const openEditModal = (garment: Garment) => {
    setFormData({
      name: garment.name,
      category: garment.category,
      base_price: garment.base_price,
      description: garment.description || '',
      image_url: garment.image_url || '',
      customization_options: garment.customization_options || {
        collar: ['Regular', 'Button Down', 'Spread'],
        sleeves: ['Full Sleeve', 'Half Sleeve'],
        fit: ['Regular', 'Slim', 'Relaxed']
      }
    })
    setEditingGarment(garment)
    setIsCreating(false)
    setIsModalOpen(true)
  }

  const handleSave = async () => {
    try {
      setSaving(true)

      if (isCreating) {
        await garmentAPI.create(formData)
      } else if (editingGarment) {
        await garmentAPI.update(editingGarment.id, formData)
      }

      setIsModalOpen(false)
      refetch()
    } catch (error) {
      console.error('Error saving garment:', error)
      alert('Failed to save garment. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (garmentId: string) => {
    if (!confirm('Are you sure you want to delete this garment?')) return

    try {
      setDeleting(garmentId)
      await garmentAPI.delete(garmentId)
      refetch()
    } catch (error) {
      console.error('Error deleting garment:', error)
      alert('Failed to delete garment. Please try again.')
    } finally {
      setDeleting(null)
    }
  }

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const updateCustomizationOption = (optionKey: string, values: string[]) => {
    setFormData(prev => ({
      ...prev,
      customization_options: {
        ...prev.customization_options,
        [optionKey]: values
      }
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#C8A951]"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Products</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={refetch}>Try Again</Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1A1D23]">Product Management</h1>
          <p className="text-gray-600 mt-1">Manage garment types and customization options</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Product
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C8A951]"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Product Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-[#1A1D23] mt-1">{garments.length}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-50">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
        {categories.slice(0, 3).map(category => (
          <Card key={category} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{category}</p>
                <p className="text-2xl font-bold text-[#1A1D23] mt-1">
                  {garments.filter(g => g.category === category).length}
                </p>
              </div>
              <div className="p-3 rounded-full bg-[#C8A951] bg-opacity-10">
                <Package className="w-6 h-6 text-[#C8A951]" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGarments.map((garment, index) => (
          <motion.div
            key={garment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={garment.image_url || 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg'}
                  alt={garment.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4 bg-[#C8A951] text-white px-2 py-1 rounded-full text-sm font-medium">
                  {garment.category}
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-[#1A1D23]">{garment.name}</h3>
                  <span className="text-[#C8A951] font-bold">₹{garment.base_price.toLocaleString()}</span>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{garment.description}</p>
                
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Customization Options:</p>
                  <div className="flex flex-wrap gap-1">
                    {Object.keys(garment.customization_options || {}).slice(0, 3).map(option => (
                      <span key={option} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                        {option}
                      </span>
                    ))}
                    {Object.keys(garment.customization_options || {}).length > 3 && (
                      <span className="text-gray-500 text-xs px-2 py-1">
                        +{Object.keys(garment.customization_options || {}).length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => openEditModal(garment)}>
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(garment.id)}
                    disabled={deleting === garment.id}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredGarments.length === 0 && (
        <Card className="p-12 text-center">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No products found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or add a new product</p>
        </Card>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isCreating ? 'Add New Product' : 'Edit Product'}
      >
        <div className="space-y-4 max-h-96 overflow-y-auto">
          <Input
            label="Product Name"
            value={formData.name}
            onChange={(e) => updateFormData('name', e.target.value)}
            placeholder="Enter product name"
            required
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Category"
              value={formData.category}
              onChange={(e) => updateFormData('category', e.target.value)}
              placeholder="e.g., Shirts, Suits, Kurtas"
              required
            />
            <Input
              label="Base Price (₹)"
              type="number"
              value={formData.base_price}
              onChange={(e) => updateFormData('base_price', parseFloat(e.target.value) || 0)}
              placeholder="0"
              required
            />
          </div>

          <Input
            label="Image URL"
            value={formData.image_url}
            onChange={(e) => updateFormData('image_url', e.target.value)}
            placeholder="Enter image URL"
          />

          <div>
            <label className="block text-sm font-medium text-[#1A1D23] mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => updateFormData('description', e.target.value)}
              placeholder="Enter product description"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C8A951]"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1D23] mb-2">
              Customization Options
            </label>
            {Object.entries(formData.customization_options).map(([key, values]) => (
              <div key={key} className="mb-3">
                <label className="block text-xs font-medium text-gray-600 mb-1 capitalize">
                  {key.replace('_', ' ')}
                </label>
                <Input
                  value={values.join(', ')}
                  onChange={(e) => updateCustomizationOption(key, e.target.value.split(',').map(v => v.trim()).filter(v => v))}
                  placeholder="Enter options separated by commas"
                />
              </div>
            ))}
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              onClick={handleSave}
              disabled={saving || !formData.name || !formData.category}
              className="flex-1"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Product'}
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              disabled={saving}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}