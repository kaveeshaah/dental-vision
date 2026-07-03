import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Landing from './pages/Landing/Landing'
import Footer from './components/Footer/Footer'
import Login from './pages/Login/Login'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-50 text-slate-700 flex flex-col font-sans antialiased selection:bg-teal-500/30 selection:text-white">
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
          
          {/* Standalone Login Page */}
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
