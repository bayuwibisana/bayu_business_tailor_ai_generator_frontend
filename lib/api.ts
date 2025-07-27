import axios, { AxiosInstance } from 'axios'

class ApiClient {
  private client: AxiosInstance

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
      timeout: 120000, // 2 minutes for batch operations
    })

    // Auth interceptor
    this.client.interceptors.request.use((config) => {
      const token = localStorage.getItem('access_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    // Error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('access_token')
          window.location.href = '/login'
        }
        return Promise.reject(error)
      }
    )
  }

  // Authentication
  async login(username: string, password: string) {
    return this.client.post('/auth/login', { username, password })
  }
  
  async logout() {
    try {
      const response = await this.client.post('/auth/logout')
      localStorage.removeItem('access_token')
      return response
    } catch (error) {
      // Even if the server-side logout fails, clear the local token
      localStorage.removeItem('access_token')
      throw error
    }
  }

  // Campaigns
  async getCampaigns() {
    return this.client.get('/campaigns')
  }

  async createCampaign(data: any) {
    return this.client.post('/campaigns', data)
  }

  // CORE: Batch Generation
  async startBatchGeneration(campaignId: string, data: any) {
    return this.client.post(`/campaigns/${campaignId}/generate-batch`, data)
  }

  async getBatchStatus(jobId: string) {
    return this.client.get(`/batch-jobs/${jobId}/status`)
  }

  async getBatchResults(jobId: string) {
    return this.client.get(`/batch-jobs/${jobId}/results`)
  }
}

export const apiClient = new ApiClient()