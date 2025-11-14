import { useState, useEffect } from 'react'
import './../../styles/index.css'
import { Link } from 'react-router-dom';

function Tienda() {
  const [juegos, setJuegos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterGenero, setFilterGenero] = useState('')
  const [filterPlataforma, setFilterPlataforma] = useState('')

  useEffect(() => {
    fetchJuegos()
  }, [])

  const fetchJuegos = async () => {
    try {
      const token = localStorage.getItem('token')
      
      const response = await fetch('http://localhost:3000/api/games', {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      })

      if (!response.ok) {
        throw new Error('Error al cargar los juegos')
      }

      const data = await response.json()
      setJuegos(data)
    } catch (error) {
      console.error('Error:', error)
      setError('No se pudieron cargar los juegos de la tienda')
    } finally {
      setLoading(false)
    }
  }

  const agregarABiblioteca = async (juego) => {
    alert(`"${juego.titulo}" agregado a tu biblioteca`)
  }

  // Filtros
  const juegosFiltrados = juegos.filter(juego => {
    const matchSearch = juego.titulo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchGenero = !filterGenero || juego.genero === filterGenero
    const matchPlataforma = !filterPlataforma || juego.plataforma === filterPlataforma
    return matchSearch && matchGenero && matchPlataforma
  })

  // Obtener géneros y plataformas únicos
  const generos = [...new Set(juegos.map(j => j.genero).filter(Boolean))]
  const plataformas = [...new Set(juegos.map(j => j.plataforma).filter(Boolean))]

  if (loading) {
    return (
      <div className="inicio-loading">
        <p>Cargando tienda...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="inicio-error">
        <p>{error}</p>
        <button onClick={fetchJuegos}>
          Reintentar
        </button>
      </div>
    )
  }

  return (
    <>
      {/* Header */}
      <div className="hero-section">
        <h2 className="hero-title">Tienda de Juegos</h2>
        <h4 className="hero-subtitle">Explora y agrega juegos a tu biblioteca</h4>
        <Link to="/Crear">
          <button 
            className="explorar-tienda-btn"
          >
            + Agregar Juego
          </button>
        </Link>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="filters-container">
        <div className="filters-grid">
          {/* Búsqueda */}
          <div className="filter-group">
            <label>Buscar</label>
            <input
              type="text"
              className="filter-input"
              placeholder="Buscar juego..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filtro Género */}
          <div className="filter-group">
            <label>Género</label>
            <select
              className="filter-select"
              value={filterGenero}
              onChange={(e) => setFilterGenero(e.target.value)}
            >
              <option value="">Todos</option>
              {generos.map(genero => (
                <option key={genero} value={genero}>{genero}</option>
              ))}
            </select>
          </div>

          {/* Filtro Plataforma */}
          <div className="filter-group">
            <label>Plataforma</label>
            <select
              className="filter-select"
              value={filterPlataforma}
              onChange={(e) => setFilterPlataforma(e.target.value)}
            >
              <option value="">Todas</option>
              {plataformas.map(plataforma => (
                <option key={plataforma} value={plataforma}>{plataforma}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Contador de resultados */}
      <div className="results-counter">
        <h3>
          {juegosFiltrados.length} {juegosFiltrados.length === 1 ? 'juego encontrado' : 'juegos encontrados'}
        </h3>
      </div>

      {/* Grid de Juegos */}
      {juegosFiltrados.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"></div>
          <h4>No se encontraron juegos</h4>
          <p>
            Intenta cambiar los filtros de búsqueda
          </p>
        </div>
      ) : (
        <div className="games-grid">
          {juegosFiltrados.map(juego => (
            <div key={juego._id} className="store-game-card">
              {/* Imagen */}
              {juego.imagenPortada && (
                <img 
                  src={juego.imagenPortada} 
                  alt={juego.titulo}
                  className="store-game-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/280x180?text=Sin+Imagen'
                  }}
                />
              )}

              {/* Información */}
              <div className="game-content">
                <h4 className="game-title">
                  {juego.titulo}
                </h4>
                <div className="game-badges">
                  {juego.genero && (
                    <span className="game-badge">{juego.genero}</span>
                  )}
                  {juego.plataforma && (
                    <span className="game-badge">{juego.plataforma}</span>
                  )}
                </div>

                {juego.desarrollador && (
                  <p className="game-developer">
                    {juego.desarrollador}
                  </p>
                )}

                {juego.añoLanzamiento && (
                  <p className="game-release-year">
                    Año: {juego.añoLanzamiento}
                  </p>
                )}

                {juego.descripcion && (
                  <p className="game-description">
                    {juego.descripcion}
                  </p>
                )}

                {/* Botón Agregar */}
                <button
                  className="add-button"
                  onClick={() => agregarABiblioteca(juego)}
                >
                  Agregar a Biblioteca
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

export default Tienda