import AboutSection from "./components/About-Section.tsx"
import GameGrid from "./components/GameGrid.tsx"
import IntroSection from "./components/Intro-Section.tsx"
import ToolsGridSection from "./components/ToolsGrid-Section.tsx"

function App() {

  return (
    <div className='flex flex-col justify-around py-32 gap-34 min-h-screen'>
      <IntroSection />
      <GameGrid />
      <ToolsGridSection/>
      <AboutSection />
    </div>
  )
}

export default App
