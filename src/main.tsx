import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import Navbar from './components/Navbar.tsx'
import Footer from './components/Footer.tsx'
import ToolsPage from './components/page/ToolsPage.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/tool/:id" element={<ToolsPage />} />
      {/* <Route path="/game/:gamename" element={<}/> */}
    </Routes>

    <Footer />
  </BrowserRouter>
)
