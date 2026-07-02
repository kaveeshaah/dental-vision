import Navbar from './components/Navbar/Navbar'
import Landing from './pages/Landing/Landing'
import Footer from './components/Footer/Footer'

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-cyan-500/30 selection:text-white">
      <Navbar />
      <main className="flex-grow">
        <Landing />
      </main>
      <Footer />
    </div>
  )
}

export default App
