import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Landing from './pages/Landing/Landing'
import Footer from './components/Footer/Footer'
import Login from './pages/Login/Login'
import Register from './pages/Register/Register'
import PatientRecords from './pages/PatientRecords/PatientRecords'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-sand text-bark-soft flex flex-col font-sans antialiased selection:bg-clay/30 selection:text-moss">
        <Routes>
          {/* Main Layout containing Landing Page */}
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
              <>
                <Navbar />
                <main className="flex-grow">
                  <PatientRecords />
                </main>
                <Footer />
              </>
            }
          />
          
          {/* Standalone Login Page */}
          <Route path="/login" element={<Login />} />

          {/* Standalone Register Page */}
          <Route path="/register" element={<Register />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
