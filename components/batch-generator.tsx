'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, Wand2, Loader2 } from 'lucide-react'
import { apiClient } from '@/lib/api'
import { ProgressTracker } from '@/components/progress-tracker'

interface PostInput {
  id: string
  title: string
  topic: string
  brief: string
  generate_image: boolean
  generate_caption: boolean
}

interface Campaign {
  id: string
  name: string
  brand_name: string
  tone_id: string
}

export function BatchGenerator({ campaign }: { campaign: Campaign }) {
  const [posts, setPosts] = useState<PostInput[]>([
    {
      id: '1',
      title: '',
      topic: '',
      brief: '',
      generate_image: true,
      generate_caption: true
    }
  ])
  const [isGenerating, setIsGenerating] = useState(false)
  const [batchResult, setBatchResult] = useState<any>(null)
  const [currentJobId, setCurrentJobId] = useState<string | null>(null)

  const addPost = () => {
    setPosts([...posts, {
      id: Date.now().toString(),
      title: '',
      topic: '',
      brief: '',
      generate_image: true,
      generate_caption: true
    }])
  }

  const removePost = (id: string) => {
    if (posts.length > 1) {
      setPosts(posts.filter(p => p.id !== id))
    }
  }

  const updatePost = (id: string, field: keyof PostInput, value: any) => {
    setPosts(posts.map(p => p.id === id ? { ...p, [field]: value } : p))
  }

  const startGeneration = async () => {
    // Validation
    const invalidPosts = posts.filter(p => !p.title.trim() || !p.brief.trim())
    if (invalidPosts.length > 0) {
      alert(`${invalidPosts.length} posts are missing title or brief`)
      return
    }

    setIsGenerating(true)
    setBatchResult(null)
    setCurrentJobId(null)

    try {
      const batchData = {
        name: `Batch ${new Date().toLocaleString()}`,
        posts: posts.map(p => ({
          title: p.title,
          topic: p.topic || p.title,
          brief: p.brief,
          brand_name: campaign.brand_name,
          tone: campaign.tone_id,
          generate_image: p.generate_image,
          generate_caption: p.generate_caption
        })),
        generation_options: {
          max_caption_words: 150,
          include_hashtags: true,
          include_emojis: true,
          use_cache: true
        }
      }

      console.log('Starting batch generation for', posts.length, 'posts...')
      
      const startTime = Date.now()

      const response = await apiClient.startBatchGeneration(campaign.id, batchData)
      
      // Try different possible job ID fields
      const jobId = response.data.batch_job.id
      
      if (jobId) {
        setCurrentJobId(jobId)
      } else {
        console.warn('No job ID found in response:', Object.keys(response.data))
        // Still show progress tracker even without job ID for user feedback
        setCurrentJobId('unknown')
      }

      const endTime = Date.now()
      const duration = (endTime - startTime) / 1000

      setBatchResult({
        ...response.data,
        duration: duration
      })

    } catch (error: any) {
      console.error('Batch generation failed:', error)
      console.error('Error response:', error.response?.data)
      alert('Batch generation failed: ' + (error.response?.data?.detail || error.message))
      setIsGenerating(false)
      setCurrentJobId(null)
    }
  }

  const handleGenerationComplete = () => {
    setIsGenerating(false)
    setCurrentJobId(null)
    console.log('Batch generation completed')
  }

  const addMultiplePosts = (count: number) => {
    const newPosts = Array.from({ length: count }, (_, i) => ({
      id: `${Date.now()}_${i}`,
      title: `Post ${posts.length + i + 1}`,
      topic: 'Sample Topic',
      brief: 'Sample brief for quick testing',
      generate_image: true,
      generate_caption: true
    }))
    setPosts([...posts, ...newPosts])
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5" />
                Batch Content Generator
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Campaign: {campaign.name} | Brand: {campaign.brand_name}
              </p>
            </div>
            <Badge variant="outline">
              {posts.length} {posts.length === 1 ? 'Post' : 'Posts'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            <Button onClick={addPost} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Post
            </Button>
            <Button onClick={() => addMultiplePosts(10)} variant="outline" size="sm">
              Add 10 Posts
            </Button>
            <Button onClick={() => addMultiplePosts(50)} variant="outline" size="sm">
              Add 50 Posts
            </Button>
            <Button onClick={() => addMultiplePosts(100)} variant="outline" size="sm">
              Add 100 Posts
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Progress Tracker - Show when job is running */}
      {currentJobId && (
        <ProgressTracker 
          jobId={currentJobId} 
          onComplete={handleGenerationComplete}
        />
      )}

      {/* Posts Input */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {posts.map((post, index) => (
          <Card key={post.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Post #{index + 1}</h3>
                {posts.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removePost(post.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Input
                  placeholder="Post title"
                  value={post.title}
                  onChange={(e) => updatePost(post.id, 'title', e.target.value)}
                />
                <Input
                  placeholder="Topic (optional)"
                  value={post.topic}
                  onChange={(e) => updatePost(post.id, 'topic', e.target.value)}
                />
              </div>
              
              <Textarea
                placeholder="Brief description of this post..."
                value={post.brief}
                onChange={(e) => updatePost(post.id, 'brief', e.target.value)}
                rows={2}
              />

              <div className="flex gap-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={post.generate_caption}
                    onChange={(e) => updatePost(post.id, 'generate_caption', e.target.checked)}
                  />
                  <span className="text-sm">Generate Caption</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={post.generate_image}
                    onChange={(e) => updatePost(post.id, 'generate_image', e.target.checked)}
                  />
                  <span className="text-sm">Generate Image</span>
                </label>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Generate Button */}
      <div className="text-center">
        <Button
          onClick={startGeneration}
          disabled={isGenerating || posts.length === 0}
          size="lg"
          className="min-w-[200px]"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating {posts.length} Posts...
            </>
          ) : (
            <>
              <Wand2 className="mr-2 h-4 w-4" />
              Generate {posts.length} {posts.length === 1 ? 'Post' : 'Posts'}
            </>
          )}
        </Button>
      </div>

      {/* Results */}
      {batchResult && (
        <Card>
          <CardHeader>
            <CardTitle>Generation Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {batchResult.result?.completed_posts || 0}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {batchResult.result?.failed_posts || 0}
                </div>
                <div className="text-sm text-gray-600">Failed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {batchResult.duration?.toFixed(1)}s
                </div>
                <div className="text-sm text-gray-600">Duration</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">
                  {((batchResult.result?.completed_posts || 0) / (batchResult.duration || 1) * 60).toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">Posts/min</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}