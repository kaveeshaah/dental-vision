import axios from 'axios'
import { useAuthStore } from './store/authStore'


const api = axios.create()

export interface Prediction {
  bbox: [number, number, number, number]
  disease_label: string
  confidence: number
  detection_confidence: number
  low_confidence: boolean
  yolo_class_guess: string
}

export interface PredictResponse {
  image_id: string
  image_dimensions: { width: number; height: number }
  predictions: Prediction[]
  summary: {
    total_findings: number
    by_class: Record<string, number>
  }
}

export async function predictXray(file: File): Promise<PredictResponse> {
  const formData = new FormData()
  formData.append('image', file)

  const response = await api.post<PredictResponse>('/predict', formData)

  return response.data
}

export async function checkHealth() {
  const response = await api.get('/health')
  return response.data
}

// Authentication

export interface AuthResponse {
  user: {
    id: number
    username: string
    email: string
  }
  access_token: string
}

export async function loginUser(credentials: any): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/login', credentials)
  return response.data
}

export async function registerUser(userData: any): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/register', userData)
  return response.data
}

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
