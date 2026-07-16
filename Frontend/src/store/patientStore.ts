import { create } from 'zustand'
import type { Patient } from '../api'

interface PatientState {
  selectedPatient: Patient | null
  setSelectedPatient: (patient: Patient | null) => void
  clearSelectedPatient: () => void
}

export const usePatientStore = create<PatientState>((set) => ({
  selectedPatient: null,
  setSelectedPatient: (patient) => set({ selectedPatient: patient }),
  clearSelectedPatient: () => set({ selectedPatient: null }),
}))
