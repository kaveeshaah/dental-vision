import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Landing from './pages/Landing/Landing'
import Footer from './components/Footer/Footer'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import PatientRecords from './pages/PatientRecords/PatientRecords'
import DashboardLayout from './layouts/DashboardLayout'
import PatientDashboard from './pages/Dashboard/PatientDashboard'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-sand text-bark-soft flex flex-col font-sans antialiased selection:bg-clay/30 selection:text-moss">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <main className="flex-grow">
                  <Landing />
                </main>
                <Footer />
              </>
            }
          />

          <Route
            path="/patient-records"
            element={
              <ProtectedRoute>
                <>
                  <Navbar />
                  <main className="flex-grow">
                    <PatientRecords />
                  </main>
                  <Footer />
                </>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard/patient"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <PatientDashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
