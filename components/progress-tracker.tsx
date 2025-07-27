'use client'

import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, Clock, Loader2, AlertCircle } from 'lucide-react'
import { apiClient } from '@/lib/api'

interface ProgressTrackerProps {
  jobId: string
  onComplete?: () => void
}

export function ProgressTracker({ jobId, onComplete }: ProgressTrackerProps) {
  const [progress, setProgress] = useState<any>(null)
  const [isPolling, setIsPolling] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pollCount, setPollCount] = useState(0)

  useEffect(() => {
    
    
    if (!isPolling || jobId === 'unknown') {
      // If no valid job ID, show a simulated progress
      if (jobId === 'unknown') {
        setProgress({
          total_posts: 0,
          completed_posts: 0,
          failed_posts: 0,
          remaining_posts: 0,
          percentage: 0,
          status: 'processing'
        })
      }
      return
    }

    const interval = setInterval(async () => {
      try {
        
        const response = await apiClient.getBatchStatus(jobId)
        
        
        setProgress(response.data.progress || response.data)
        setError(null)
        setPollCount(prev => prev + 1)

        if (response.data.status === 'completed' || response.data.status === 'failed') {
          
          setIsPolling(false)
          onComplete?.()
        }
      } catch (error: any) {
        console.error('Failed to fetch progress:', error)
        console.error('Error details:', error.response?.data)
        setError(error.response?.data?.detail || error.message || 'Failed to fetch progress')
        
        // After 5 failed attempts, stop polling
        if (pollCount > 5) {
          setIsPolling(false)
          onComplete?.()
        }
      }
    }, 2000) // Poll every 2 seconds

    return () => clearInterval(interval)
  }, [jobId, isPolling, onComplete, pollCount])

  if (error) {
    return (
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-700">
            <AlertCircle className="h-5 w-5" />
            Progress Tracking Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-orange-600 text-sm">{error}</p>
          <p className="text-orange-500 text-xs mt-2">Job ID: {jobId}</p>
        </CardContent>
      </Card>
    )
  }

  if (!progress) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin mr-2" />
          <span>Loading progress...</span>
        </CardContent>
      </Card>
    )
  }

  if (jobId === 'unknown') {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <Clock className="h-5 w-5" />
            Processing Batch
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-4">
            <Loader2 className="h-8 w-8 animate-spin mr-2 text-blue-600" />
            <span className="text-blue-600">Processing your posts... This may take a few moments.</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Batch Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Progress</span>
            <span>{progress.completed_posts || 0} of {progress.total_posts || 0} completed</span>
          </div>
          <Progress value={progress.percentage || 0} className="h-3" />
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-lg font-bold text-green-600">{progress.completed_posts || 0}</span>
            </div>
            <div className="text-sm text-green-700">Completed</div>
          </div>
          
          <div className="p-3 bg-red-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <XCircle className="h-4 w-4 text-red-600" />
              <span className="text-lg font-bold text-red-600">{progress.failed_posts || 0}</span>
            </div>
            <div className="text-sm text-red-700">Failed</div>
          </div>
          
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-lg font-bold text-blue-600">{progress.remaining_posts || 0}</span>
            </div>
            <div className="text-sm text-blue-700">Remaining</div>
          </div>
        </div>

        <div className="text-center">
          <Badge variant={progress.percentage === 100 ? "default" : "secondary"}>
            {Math.round(progress.percentage || 0)}% Complete
          </Badge>
        </div>

        <div className="text-xs text-gray-500 text-center">
          Job ID: {jobId}
        </div>
      </CardContent>
    </Card>
  )
}