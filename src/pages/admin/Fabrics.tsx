import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Plus, Edit, Eye, Palette, Star, Trash2, Save, X } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card } from '../../components/ui/Card'
import { Modal } from '../../components/ui/Modal'
import { useFabrics } from '../../hooks/useRealTimeData'
import { fabricAPI, Fabric } from '../../lib/supabase'

export function AdminFabrics() {
  const { fabrics, loading, error, refetch } = useFabrics()
  const [filteredFabrics, setFilteredFabrics] = useState<Fabric[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [materialFilter, setMaterialFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingFabric, setEditingFabric] = useState<Fabric | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    material: '',
    color: '',
    price_per_meter: 0,
    stock: 0,
    description: '',
    featured: false,
    images_json: ['']
  })

  useEffect(() => {
    filterFabrics()
  }, [fabrics, searchTerm, materialFilter])

  const filterFabrics = () => {
    let filtered = fabrics

    if (searchTerm) {
      filtered = filtered.filter(fabric =>
        fabric.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fabric.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
        fabric.color.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (materialFilter !== 'all') {
      filtered = filtered.filter(fabric => fabric.material === materialFilter)
    }

    setFilteredFabrics(filtered)
  }

  const materials = [...new Set(fabrics.map(f => f.material))]

  const openCreateModal = () => {
    setFormData({
      name: '',
      material: '',
      color: '',
      price_per_meter: 0,
      stock: 0,
      description: '',
      featured: false,
      images_json: ['']
    })
    setEditingFabric(null)
    setIsCreating(true)
    setIsModalOpen(true)
  }

  const openEditModal = (fabric: Fabric) => {
    setFormData({
      name: fabric.name,
      material: fabric.material,
      color: fabric.color,
      price_per_meter: fabric.price_per_meter,
      stock: fabric.stock,
      description: fabric.description || '',
      featured: fabric.featured,
      images_json: fabric.images_json.length > 0 ? fabric.images_json : ['']
    })
    setEditingFabric(fabric)
    setIsCreating(false)
    setIsModalOpen(true)
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      
      const fabricData = {
        ...formData,
        images_json: formData.images_json.filter(url => url.trim() !== '')
      }

      if (isCreating) {
        await fabricAPI.create(fabricData)
      } else if (editingFabric) {
        await fabricAPI.update(editingFabric.id, fabricData)
      }

      setIsModalOpen(false)
      refetch()
    } catch (error) {
      console.error('Error saving fabric:', error)
      alert('Failed to save fabric. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (fabricId: string) => {
    if (!confirm('Are you sure you want to delete this fabric?')) return

    try {
      setDeleting(fabricId)
      await fabricAPI.delete(fabricId)
      refetch()
    } catch (error) {
      console.error('Error deleting fabric:', error)
      alert('Failed to delete fabric. Please try again.')
    } finally {
      setDeleting(null)
    }
  }

  const toggleFeatured = async (fabric: Fabric) => {
    try {
      await fabricAPI.update(fabric.id, { featured: !fabric.featured })
      refetch()
    } catch (error) {
      console.error('Error updating fabric:', error)
      alert('Failed to update fabric. Please try again.')
    }
  }

  const updateFormData = (key: string, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images_json: [...prev.images_json, '']
    }))
  }

  const removeImageField = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images_json: prev.images_json.filter((_, i) => i !== index)
    }))
  }

  const updateImageUrl = (index: number, url: string) => {
    setFormData(prev => ({
      ...prev,
      images_json: prev.images_json.map((img, i) => i === index ? url : img)
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
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Error Loading Fabrics</h2>
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
          <h1 className="text-3xl font-bold text-[#1A1D23]">Fabric Management</h1>
          <p className="text-gray-600 mt-1">Manage fabric inventory and pricing</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="w-4 h-4 mr-2" />
          Add New Fabric
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search fabrics..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select
            value={materialFilter}
            onChange={(e) => setMaterialFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C8A951]"
          >
            <option value="all">All Materials</option>
            {materials.map(material => (
              <option key={material} value={material}>{material}</option>
            ))}
          </select>
        </div>
      </Card>

      {/* Fabric Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Fabrics</p>
              <p className="text-2xl font-bold text-[#1A1D23] mt-1">{fabrics.length}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-50">
              <Palette className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Featured</p>
              <p className="text-2xl font-bold text-[#1A1D23] mt-1">
                {fabrics.filter(f => f.featured).length}
              </p>
            </div>
            <div className="p-3 rounded-full bg-[#C8A951] bg-opacity-10">
              <Star className="w-6 h-6 text-[#C8A951]" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Stock</p>
              <p className="text-2xl font-bold text-[#1A1D23] mt-1">
                {fabrics.reduce((sum, f) => sum + f.stock, 0)} m
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-50">
              <Palette className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Price</p>
              <p className="text-2xl font-bold text-[#1A1D23] mt-1">
                ₹{fabrics.length > 0 ? Math.round(fabrics.reduce((sum, f) => sum + f.price_per_meter, 0) / fabrics.length) : 0}
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-50">
              <Palette className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Fabrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFabrics.map((fabric, index) => (
          <motion.div
            key={fabric.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={fabric.images_json[0] || 'https://images.pexels.com/photos/6069107/pexels-photo-6069107.jpeg'}
                  alt={fabric.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 left-4 flex space-x-2">
                  {fabric.featured && (
                    <span className="bg-[#C8A951] text-white px-2 py-1 rounded-full text-xs font-medium">
                      Featured
                    </span>
                  )}
                  <span className="bg-white bg-opacity-90 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
                    {fabric.stock} meters
                  </span>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-[#1A1D23]">{fabric.name}</h3>
                  <span className="text-[#C8A951] font-bold">₹{fabric.price_per_meter}/m</span>
                </div>
                <div className="flex items-center space-x-4 mb-3">
                  <span className="text-sm text-gray-600">{fabric.material}</span>
                  <span className="text-sm text-gray-600">•</span>
                  <span className="text-sm text-gray-600">{fabric.color}</span>
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{fabric.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Stock:</span>
                    <span className={`text-sm font-medium ${
                      fabric.stock > 20 ? 'text-green-600' : 
                      fabric.stock > 10 ? 'text-orange-600' : 'text-red-600'
                    }`}>
                      {fabric.stock} meters
                    </span>
                  </div>
                  <button
                    onClick={() => toggleFeatured(fabric)}
                    className={`p-1 rounded ${
                      fabric.featured ? 'text-[#C8A951]' : 'text-gray-400'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${fabric.featured ? 'fill-current' : ''}`} />
                  </button>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => openEditModal(fabric)}>
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(fabric.id)}
                    disabled={deleting === fabric.id}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredFabrics.length === 0 && (
        <Card className="p-12 text-center">
          <Palette className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No fabrics found</h3>
          <p className="text-gray-500">Try adjusting your search criteria or add a new fabric</p>
        </Card>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isCreating ? 'Add New Fabric' : 'Edit Fabric'}
      >
        <div className="space-y-4">
          <Input
            label="Fabric Name"
            value={formData.name}
            onChange={(e) => updateFormData('name', e.target.value)}
            placeholder="Enter fabric name"
            required
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Material"
              value={formData.material}
              onChange={(e) => updateFormData('material', e.target.value)}
              placeholder="e.g., Cotton, Silk, Wool"
              required
            />
            <Input
              label="Color"
              value={formData.color}
              onChange={(e) => updateFormData('color', e.target.value)}
              placeholder="e.g., Navy Blue, Red"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price per Meter (₹)"
              type="number"
              value={formData.price_per_meter}
              onChange={(e) => updateFormData('price_per_meter', parseFloat(e.target.value) || 0)}
              placeholder="0"
              required
            />
            <Input
              label="Stock (meters)"
              type="number"
              value={formData.stock}
              onChange={(e) => updateFormData('stock', parseInt(e.target.value) || 0)}
              placeholder="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1D23] mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => updateFormData('description', e.target.value)}
              placeholder="Enter fabric description"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C8A951]"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#1A1D23] mb-2">
              Images
            </label>
            {formData.images_json.map((url, index) => (
              <div key={index} className="flex space-x-2 mb-2">
                <Input
                  value={url}
                  onChange={(e) => updateImageUrl(index, e.target.value)}
                  placeholder="Enter image URL"
                  className="flex-1"
                />
                {formData.images_json.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeImageField(index)}
                    className="text-red-600"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addImageField}>
              <Plus className="w-4 h-4 mr-2" />
              Add Image
            </Button>
          </div>

          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={formData.featured}
              onChange={(e) => updateFormData('featured', e.target.checked)}
              className="rounded border-gray-300 text-[#C8A951] focus:ring-[#C8A951]"
            />
            <span className="text-sm text-[#1A1D23]">Featured Fabric</span>
          </label>

          <div className="flex space-x-3 pt-4">
            <Button
              onClick={handleSave}
              disabled={saving || !formData.name || !formData.material || !formData.color}
              className="flex-1"
            >
              <Save className="w-4 h-4 mr-2" />
              {saving ? 'Saving...' : 'Save Fabric'}
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