import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster, toast } from 'react-hot-toast'
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
      <Toaster 
        position="top-center"
        containerStyle={{
          top: '40%',
        }}
        toastOptions={{
          duration: 3000,
        }}
      >
        {(t) => (
          <div
            className={`${
              t.visible ? 'animate-fade-in-up' : 'animate-fade-out-down'
            } max-w-md w-full bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] rounded-[20px] pointer-events-auto flex p-4 relative border border-line/20`}
          >
            {/* Icon Box */}
            <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm ${
              t.type === 'error' ? 'bg-red-100 text-red-500' : 'bg-[#FDF3C7]'
            }`}>
              {t.type === 'error' ? '⚠️' : '👍'}
            </div>

            {/* Content */}
            <div className="ml-4 flex-1 pt-1 pr-6">
              <p className="text-[16px] font-bold text-gray-900 font-sans leading-tight">
                {t.type === 'error' ? 'Action Failed' : 'Success'}
              </p>
              <div className="mt-1 text-[14px] text-gray-500 leading-snug">
                {typeof t.message === 'function' ? t.message(t) : t.message}
              </div>
            </div>
          </div>
        )}
      </Toaster>
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
