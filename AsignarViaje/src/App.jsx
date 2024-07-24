import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import Contenido from './components/Contenido'

function App() {

  return (
    <div className='flex flex-col h-screen'>
      <Header />
      <Contenido />
      <Footer />
    </div>
  )
}

export default App
