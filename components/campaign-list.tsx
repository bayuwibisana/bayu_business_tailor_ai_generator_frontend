'use client'

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { apiClient } from '@/lib/api'

interface Campaign {
  id: string
  name: string
  brand_name: string
  tone_id: string
  status: string
  created_at: string
}

export function CampaignList({ onSelectCampaign }: { onSelectCampaign: (campaign: Campaign) => void }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadCampaigns()
  }, [])

  const loadCampaigns = async () => {
    try {
      const response = await apiClient.getCampaigns()
      // API returns campaigns directly as an array, not wrapped in {campaigns: [...]}
      setCampaigns(response.data || [])
      
    } catch (error) {
      console.error('Failed to load campaigns:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>Loading campaigns...</div>

  if (campaigns.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No campaigns found. Create your first campaign to get started!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {campaigns.map((campaign) => (
        <Card key={campaign.id} className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{campaign.name}</CardTitle>
                <p className="text-sm text-gray-600">{campaign.brand_name}</p>
              </div>
              <Badge variant="outline" className="capitalize">
                {campaign.tone_id}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Created: {new Date(campaign.created_at).toLocaleDateString()}
              </span>
              <Button 
                onClick={() => onSelectCampaign(campaign)}
                size="sm"
              >
                Generate Content
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}