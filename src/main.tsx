import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import ToolsPage from './components/page/ToolsPage.tsx'
import BattleShipsGame from './components/page/BattleShipsGame.tsx'
import Layout from './components/Layout.tsx'
import GameInterface from './components/games/[roomId]/gameInterface.tsx'


createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<App />} />
        <Route path="/tool/:id" element={<ToolsPage />} />
        <Route path='/games/battleship' element={<BattleShipsGame />} />
      </Route>
      <Route path='/games/battleship/:roomId' element={<GameInterface />} />
    </Routes>
  </BrowserRouter>
)

// <BrowserRouter>
//   <Navbar />
//   <Routes>
//     <Route path="/" element={<App />} />
//     <Route path="/tool/:id" element={<ToolsPage />} />
//     <Route path='/games/battleship' element={<BattleShipsGame />} />
//     {/* <Route path="/game/:gamename" element={<}/> */}
//   </Routes>
//   <Footer />
// </BrowserRouter>