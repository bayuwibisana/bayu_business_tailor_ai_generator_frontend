'use client'

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Download, Eye, Wand2 } from 'lucide-react'
import { apiClient } from '@/lib/api'

interface Campaign {
  id: string
  name: string
  brand_name: string
  tone_id: string
  status: string
  created_at: string
}

interface GeneratedPost {
  id: string
  title: string
  generated_caption: string
  generated_image_url: string
  status: string
  created_at: string
}

export function CampaignList({ onSelectCampaign }: { onSelectCampaign: (campaign: Campaign) => void }) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCampaignForResults, setSelectedCampaignForResults] = useState<Campaign | null>(null)
  const [generatedPosts, setGeneratedPosts] = useState<GeneratedPost[]>([])
  const [loadingResults, setLoadingResults] = useState(false)

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

  const loadGeneratedPosts = async (campaignId: string) => {
    setLoadingResults(true)
    try {
      const response = await apiClient.getCampaignPosts(campaignId)
      setGeneratedPosts(response.data || [])
    } catch (error) {
      console.error('Failed to load generated posts:', error)
    } finally {
      setLoadingResults(false)
    }
  }

  const handleViewResults = (campaign: Campaign) => {
    setSelectedCampaignForResults(campaign)
    loadGeneratedPosts(campaign.id)
  }

  const handleCloseResults = () => {
    setSelectedCampaignForResults(null)
    setGeneratedPosts([])
  }

  const exportResults = () => {
    if (!selectedCampaignForResults || generatedPosts.length === 0) return

    const exportData = {
      campaign: selectedCampaignForResults,
      posts: generatedPosts,
      exported_at: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${selectedCampaignForResults.name}_generated_content.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadImage = (imageUrl: string, title: string) => {
    const a = document.createElement('a')
    a.href = imageUrl
    a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
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
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleViewResults(campaign)}
                  size="sm"
                  variant="outline"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View Results
                </Button>
                <Button 
                  onClick={() => onSelectCampaign(campaign)}
                  size="sm"
                >
                  <Wand2 className="h-4 w-4 mr-1" />
                  Generate Content
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Results Modal */}
      {selectedCampaignForResults && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Generated Content - {selectedCampaignForResults.name}
              </h2>
              <div className="flex gap-2">
                <Button onClick={exportResults} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  Export All
                </Button>
                <Button onClick={handleCloseResults} variant="outline" size="sm">
                  Close
                </Button>
              </div>
            </div>

            {loadingResults ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <p>Loading generated content...</p>
              </div>
            ) : generatedPosts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No generated content found for this campaign.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {generatedPosts.map((post) => (
                  <Card key={post.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{post.title}</CardTitle>
                          <Badge variant={post.status === 'completed' ? 'default' : 'secondary'}>
                            {post.status}
                          </Badge>
                        </div>
                        <Button
                          onClick={() => downloadImage(post.generated_image_url, post.title)}
                          size="sm"
                          variant="outline"
                          disabled={!post.generated_image_url}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download Image
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {post.generated_caption && (
                        <div>
                          <h4 className="font-semibold mb-2">Generated Caption:</h4>
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm whitespace-pre-wrap">{post.generated_caption}</p>
                          </div>
                        </div>
                      )}
                      
                      {post.generated_image_url && (
                        <div>
                          <h4 className="font-semibold mb-2">Generated Image:</h4>
                          <div className="flex justify-center">
                            <img 
                              src={post.generated_image_url} 
                              alt={post.title}
                              className="max-w-full h-auto max-h-64 rounded-lg shadow-md"
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}