import axios from 'axios'

// JSON server runs on port 8000
const API_BASE_URL = 'http://localhost:8000'

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false // We don't need cookies for our JSON server
})

// Request interceptor - for debugging API calls
axiosInstance.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`)
    
    // Uncomment if you add authentication
    // config.headers.Authorization = `Bearer ${token}`
    
    return config
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor for logging and error handling
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response.status)
    return response
  },
  (error) => {
    console.error('Response interceptor error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
    })
    
    // Handle common error scenarios
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.warn('Unauthorized access detected')
    }
    
    if (error.response?.status >= 500) {
      // Handle server errors
      console.error('Server error detected')
    }
    
    return Promise.reject(error)
  }
)

export default axiosInstance