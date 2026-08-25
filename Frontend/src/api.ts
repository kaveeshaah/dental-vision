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


export interface Patient {
  id: number
  custom_id: string
  full_name: string
  age: number
  status: string
  created_at: string
}

export async function getPatients(): Promise<Patient[]> {
  const response = await api.get<Patient[]>('/patients')
  return response.data
}

export async function createPatient(data: { full_name: string; age: number; custom_id?: string; status?: string }): Promise<Patient> {
  const response = await api.post<Patient>('/patients', data)
  return response.data
}

export async function deletePatient(patientId: number): Promise<{ message: string }> {
  const response = await api.delete<{ message: string }>(`/patients/${patientId}`)
  return response.data
}

export async function generateReport(patientId: number, predictionData: PredictResponse): Promise<Blob> {
  const response = await api.post<Blob>(
    '/report',
    { patient_id: patientId, data: predictionData },
    { responseType: 'blob' }
  )
  return response.data
}

export interface ReportRecord {
  id: number
  patient_id: number
  image_id: string | null
  findings: PredictResponse
  created_at: string
}

export async function saveReport(patientId: number, predictionData: PredictResponse): Promise<ReportRecord> {
  const response = await api.post<{ message: string, report: ReportRecord }>(
    '/report/save',
    { patient_id: patientId, data: predictionData }
  )
  return response.data.report
}

export async function getReportHistory(patientId: number): Promise<ReportRecord[]> {
  const response = await api.get<ReportRecord[]>(`/report/history/${patientId}`)
  return response.data
}

export interface AnalyticsData {
  total_patients: number
  total_scans: number
  disease_distribution: { name: string; value: number }[]
  age_distribution: { name: string; value: number }[]
  activity_over_time: { date: string; scans: number }[]
  average_findings: number
}

export async function getAnalytics(): Promise<AnalyticsData> {
  const response = await api.get<AnalyticsData>('/analytics')
  return response.data
}

export async function getScanImage(imageId: string): Promise<string> {
  const response = await api.get(`/images/${imageId}`, {
    responseType: 'blob'
  })
  return URL.createObjectURL(response.data)
}

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to home on 401 if it's NOT a login request
    if (error.response && error.response.status === 401 && !error.config.url?.includes('/login')) {
      useAuthStore.getState().logout()
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

export default api
