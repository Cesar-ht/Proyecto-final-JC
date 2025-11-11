import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import Inicio from './components/pages/Inicio'
import Tienda from './components/pages/Tienda'
import Biblioteca from './components/pages/Biblioteca'
import Perfil from './components/pages/Perfil'
import Ajustes from './components/pages/Ajustes'

function App() {
  // Agregar la clase tema-oscuro al body cuando se monta el componente
  useEffect(() => {
    document.body.classList.add('tema-oscuro')
  }, [])

  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/tienda" element={<Tienda />} />
          <Route path="/biblioteca" element={<Biblioteca />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/ajustes" element={<Ajustes />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}

export default App