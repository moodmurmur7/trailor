import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, Bell, Shield, Palette, Globe, Mail, Phone } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Card } from '../../components/ui/Card'

export function AdminSettings() {
  const [settings, setSettings] = useState({
    business: {
      name: 'Royal Tailors',
      tagline: 'Crafting Excellence Since 1950',
      phone: '+91 98765 43210',
      email: 'orders@royaltailors.com',
      address: '123 Fashion Street, Mumbai, Maharashtra 400001'
    },
    notifications: {
      emailOrders: true,
      smsOrders: true,
      emailMarketing: false,
      orderReminders: true
    },
    pricing: {
      urgentOrderCharge: 500,
      homeVisitCharge: 200,
      premiumLiningCharge: 300,
      embroideryCharge: 800
    },
    system: {
      orderIdPrefix: 'RT',
      defaultStitchingDays: 14,
      maxUrgentDays: 7,
      autoStatusUpdate: true
    }
  })

  const handleSave = () => {
    // In a real app, this would save to the database
    alert('Settings saved successfully!')
  }

  const updateSetting = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#1A1D23]">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your business settings and preferences</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Business Information */}
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Globe className="w-5 h-5 text-[#C8A951]" />
            <h2 className="text-xl font-semibold text-[#1A1D23]">Business Information</h2>
          </div>
          <div className="space-y-4">
            <Input
              label="Business Name"
              value={settings.business.name}
              onChange={(e) => updateSetting('business', 'name', e.target.value)}
            />
            <Input
              label="Tagline"
              value={settings.business.tagline}
              onChange={(e) => updateSetting('business', 'tagline', e.target.value)}
            />
            <Input
              label="Phone Number"
              value={settings.business.phone}
              onChange={(e) => updateSetting('business', 'phone', e.target.value)}
            />
            <Input
              label="Email Address"
              type="email"
              value={settings.business.email}
              onChange={(e) => updateSetting('business', 'email', e.target.value)}
            />
            <div>
              <label className="block text-sm font-medium text-[#1A1D23] mb-2">
                Business Address
              </label>
              <textarea
                value={settings.business.address}
                onChange={(e) => updateSetting('business', 'address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#C8A951]"
                rows={3}
              />
            </div>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Bell className="w-5 h-5 text-[#C8A951]" />
            <h2 className="text-xl font-semibold text-[#1A1D23]">Notifications</h2>
          </div>
          <div className="space-y-4">
            {[
              { key: 'emailOrders', label: 'Email notifications for new orders' },
              { key: 'smsOrders', label: 'SMS notifications for new orders' },
              { key: 'emailMarketing', label: 'Marketing emails to customers' },
              { key: 'orderReminders', label: 'Order completion reminders' }
            ].map(item => (
              <label key={item.key} className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={settings.notifications[item.key as keyof typeof settings.notifications]}
                  onChange={(e) => updateSetting('notifications', item.key, e.target.checked)}
                  className="rounded border-gray-300 text-[#C8A951] focus:ring-[#C8A951]"
                />
                <span className="text-sm text-[#1A1D23]">{item.label}</span>
              </label>
            ))}
          </div>
        </Card>

        {/* Pricing Settings */}
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Palette className="w-5 h-5 text-[#C8A951]" />
            <h2 className="text-xl font-semibold text-[#1A1D23]">Additional Charges</h2>
          </div>
          <div className="space-y-4">
            <Input
              label="Urgent Order Charge (₹)"
              type="number"
              value={settings.pricing.urgentOrderCharge}
              onChange={(e) => updateSetting('pricing', 'urgentOrderCharge', parseInt(e.target.value))}
            />
            <Input
              label="Home Visit Charge (₹)"
              type="number"
              value={settings.pricing.homeVisitCharge}
              onChange={(e) => updateSetting('pricing', 'homeVisitCharge', parseInt(e.target.value))}
            />
            <Input
              label="Premium Lining Charge (₹)"
              type="number"
              value={settings.pricing.premiumLiningCharge}
              onChange={(e) => updateSetting('pricing', 'premiumLiningCharge', parseInt(e.target.value))}
            />
            <Input
              label="Embroidery Charge (₹)"
              type="number"
              value={settings.pricing.embroideryCharge}
              onChange={(e) => updateSetting('pricing', 'embroideryCharge', parseInt(e.target.value))}
            />
          </div>
        </Card>

        {/* System Settings */}
        <Card className="p-6">
          <div className="flex items-center space-x-2 mb-6">
            <Shield className="w-5 h-5 text-[#C8A951]" />
            <h2 className="text-xl font-semibold text-[#1A1D23]">System Settings</h2>
          </div>
          <div className="space-y-4">
            <Input
              label="Order ID Prefix"
              value={settings.system.orderIdPrefix}
              onChange={(e) => updateSetting('system', 'orderIdPrefix', e.target.value)}
            />
            <Input
              label="Default Stitching Days"
              type="number"
              value={settings.system.defaultStitchingDays}
              onChange={(e) => updateSetting('system', 'defaultStitchingDays', parseInt(e.target.value))}
            />
            <Input
              label="Maximum Urgent Order Days"
              type="number"
              value={settings.system.maxUrgentDays}
              onChange={(e) => updateSetting('system', 'maxUrgentDays', parseInt(e.target.value))}
            />
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={settings.system.autoStatusUpdate}
                onChange={(e) => updateSetting('system', 'autoStatusUpdate', e.target.checked)}
                className="rounded border-gray-300 text-[#C8A951] focus:ring-[#C8A951]"
              />
              <span className="text-sm text-[#1A1D23]">Auto-update order status</span>
            </label>
          </div>
        </Card>
      </div>

      {/* Contact Information */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-[#1A1D23] mb-6">Contact Information Display</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-medium text-[#1A1D23]">Primary Contact</h3>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="w-5 h-5 text-[#C8A951]" />
              <span>{settings.business.phone}</span>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-[#C8A951]" />
              <span>{settings.business.email}</span>
            </div>
          </div>
          <div>
            <h3 className="font-medium text-[#1A1D23] mb-4">Business Hours</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Monday - Friday:</span>
                <span>9:00 AM - 8:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday:</span>
                <span>9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday:</span>
                <span>10:00 AM - 4:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}