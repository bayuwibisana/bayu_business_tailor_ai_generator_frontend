'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CampaignForm } from '@/components/campaign-form'
import { CampaignList } from '@/components/campaign-list'
import { BatchGenerator } from '@/components/batch-generator'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { LogOut, ChevronDown, ChevronUp } from 'lucide-react'

export default function DashboardPage() {
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [showGenerateForm, setShowGenerateForm] = useState(false)
  const [isCampaignListCollapsed, setIsCampaignListCollapsed] = useState(false)
  const { isAuthenticated, isLoading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  // Show loading or nothing while checking auth
  if (isLoading || !isAuthenticated) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Logout */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Social Media Content Generator</h1>
        <Button 
          variant="outline" 
          onClick={logout} 
          className="flex items-center gap-2"
        >
          <LogOut size={16} />
          Logout
        </Button>
      </div>
      
      {!selectedCampaign ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Campaign List */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">Your Campaigns</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCampaignListCollapsed(!isCampaignListCollapsed)}
                  className="p-1"
                >
                  {isCampaignListCollapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
                </Button>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => {
                  setShowCreateForm(!showCreateForm)
                  setShowGenerateForm(false)
                }}>
                  {showCreateForm ? 'Cancel' : 'New Campaign'}
                </Button>
              </div>
            </div>
            
            {showCreateForm && (
              <div className="mb-6">
                <CampaignForm onSuccess={() => {
                  setShowCreateForm(false)
                  window.location.reload()
                }} />
              </div>
            )}


            
            {/* Collapsible Campaign List */}
            <div className={`transition-all duration-300 ease-in-out ${
              isCampaignListCollapsed ? 'max-h-0 overflow-hidden opacity-0' : 'max-h-none opacity-100'
            }`}>
              <CampaignList onSelectCampaign={setSelectedCampaign} />
            </div>
            
            {isCampaignListCollapsed && (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">Campaign list is collapsed</p>
              </div>
            )}
          </div>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Start Guide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">1. Create a Campaign</h3>
                <p className="text-sm text-gray-600">Set up your brand, tone, and target audience</p>
              </div>
              <div>
                <h3 className="font-semibold">2. Generate Content</h3>
                <p className="text-sm text-gray-600">Create 1-100 Instagram posts simultaneously</p>
              </div>
              <div>
                <h3 className="font-semibold">3. Review & Export</h3>
                <p className="text-sm text-gray-600">Preview and download your generated content</p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-4 mb-6">
            <Button 
              variant="outline" 
              onClick={() => setSelectedCampaign(null)}
            >
              ← Back to Campaigns
            </Button>
            <h2 className="text-xl font-semibold">Generate Content</h2>
          </div>
          
          <BatchGenerator campaign={selectedCampaign} />
        </div>
      )}
    </div>
  )
}