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

interface ProgressData {
  total_posts: number
  completed_posts: number
  failed_posts: number
  remaining_posts: number
  percentage: number
}

interface BatchStatusResponse {
  id: string
  status: string
  progress: ProgressData
  created_by: string
}

export function ProgressTracker({ jobId, onComplete }: ProgressTrackerProps) {
  const [progress, setProgress] = useState<ProgressData | null>(null)
  const [status, setStatus] = useState<string>('initializing')
  const [isPolling, setIsPolling] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pollCount, setPollCount] = useState(0)

  useEffect(() => {
    console.log('ProgressTracker initialized with jobId:', jobId)
    
    if (!isPolling || jobId === 'unknown') {
      return
    }

    // Handle 'initializing' state - show immediate feedback
    if (jobId === 'initializing') {
      setProgress({
        total_posts: 0,
        completed_posts: 0,
        failed_posts: 0,
        remaining_posts: 0,
        percentage: 0
      })
      setStatus('initializing')
      return
    }

    const interval = setInterval(async () => {
      try {
        console.log(`Polling progress for job ${jobId} (attempt ${pollCount + 1})`)
        const response = await apiClient.getBatchStatus(jobId)
        console.log('Progress response:', response.data)
        
        const batchStatus: BatchStatusResponse = response.data
        
        // Update progress and status
        setProgress(batchStatus.progress)
        setStatus(batchStatus.status)
        setError(null)
        setPollCount(prev => prev + 1)

        // Check for completion
        if (batchStatus.status === 'completed' || 
            batchStatus.status === 'completed_with_errors' || 
            batchStatus.status === 'failed') {
          console.log('Job completed with status:', batchStatus.status)
          setIsPolling(false)
          onComplete?.()
        }
      } catch (error: any) {
        console.error('Failed to fetch progress:', error)
        console.error('Error details:', error.response?.data)
        
        // If we get a 404, the job might not exist yet
        if (error.response?.status === 404) {
          console.log('Job not found (404) - might not be started yet')
          setError('Job not found - waiting for initialization...')
        } else {
          setError(error.response?.data?.detail || error.message || 'Failed to fetch progress')
        }
        
        // After 10 failed attempts, stop polling
        if (pollCount > 10) {
          console.log('Too many failed attempts, stopping polling')
          setIsPolling(false)
          onComplete?.()
        }
      }
    }, 1000) // Poll every 1 second

    return () => clearInterval(interval)
  }, [jobId, isPolling, onComplete, pollCount])

  if (error) {
    return (
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-700">
            <AlertCircle className="h-5 w-5" />
            Progress Tracking Issue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-orange-600 text-sm mb-2">{error}</p>
          <p className="text-orange-500 text-xs mb-2">Job ID: {jobId}</p>
          <div className="flex items-center justify-center py-2">
            <Loader2 className="h-6 w-6 animate-spin mr-2 text-orange-600" />
            <span className="text-orange-600 text-sm">Still processing in background...</span>
          </div>
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
            <span>{progress.completed_posts} of {progress.total_posts} completed</span>
          </div>
          <Progress value={progress.percentage} className="h-3" />
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-lg font-bold text-green-600">{progress.completed_posts}</span>
            </div>
            <div className="text-sm text-green-700">Completed</div>
          </div>
          
          <div className="p-3 bg-red-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <XCircle className="h-4 w-4 text-red-600" />
              <span className="text-lg font-bold text-red-600">{progress.failed_posts}</span>
            </div>
            <div className="text-sm text-red-700">Failed</div>
          </div>
          
          <div className="p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-lg font-bold text-blue-600">{progress.remaining_posts}</span>
            </div>
            <div className="text-sm text-blue-700">Remaining</div>
          </div>
        </div>

        <div className="text-center">
          <Badge variant={progress.percentage === 100 ? "default" : "secondary"}>
            {Math.round(progress.percentage)}% Complete
          </Badge>
        </div>

        <div className="text-xs text-gray-500 text-center">
          Job ID: {jobId} | Status: {status}
        </div>
      </CardContent>
    </Card>
  )
}