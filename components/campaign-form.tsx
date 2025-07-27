'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { apiClient } from '@/lib/api'

export function CampaignForm({ onSuccess }: { onSuccess?: () => void }) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    brand_name: '',
    target_audience: '',
    tone_id: 'friendly'
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await apiClient.createCampaign(formData)
      alert('Campaign created successfully!')
      onSuccess?.()
    } catch (error) {
      alert('Failed to create campaign')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Campaign</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="Campaign Name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
          
          <Input
            placeholder="Brand Name"
            value={formData.brand_name}
            onChange={(e) => setFormData({...formData, brand_name: e.target.value})}
            required
          />
          
          <Textarea
            placeholder="Campaign Description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            rows={3}
          />
          
          <Textarea
            placeholder="Target Audience"
            value={formData.target_audience}
            onChange={(e) => setFormData({...formData, target_audience: e.target.value})}
            rows={2}
          />
          
          <Select value={formData.tone_id} onValueChange={(value) => setFormData({...formData, tone_id: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select tone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="friendly">Friendly</SelectItem>
              <SelectItem value="casual">Casual</SelectItem>
              <SelectItem value="modern">Modern</SelectItem>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="humorous">Humorous</SelectItem>
            </SelectContent>
          </Select>
          
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating...' : 'Create Campaign'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}