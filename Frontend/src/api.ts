import axios from 'axios'

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

export default api
