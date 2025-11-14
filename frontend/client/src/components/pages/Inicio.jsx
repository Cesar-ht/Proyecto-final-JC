import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './../../styles/index.css'
import BibliotecaJuegos from '../games/BibliotecaJuegos'

function Inicio() {
  const [juegos, setJuegos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

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
      
      // Ordenar por más recientes
      const juegosOrdenados = data.sort((a, b) => {
        if (a.createdAt && b.createdAt) {
          return new Date(b.createdAt) - new Date(a.createdAt)
        }
        return 0
      })
      
      setJuegos(juegosOrdenados)
    } catch (error) {
      console.error('Error:', error)
      setError('No se pudieron cargar los juegos')
    } finally {
      setLoading(false)
    }
  }

  // Estadísticas
  const totalJuegos = juegos.length
  const juegosCompletados = juegos.filter(j => j.completado).length
  const horasTotales = juegos.reduce((sum, j) => sum + (j.horasJugadas || j.tiempoJugado || 0), 0)

  if (loading) {
    return (
      <div className="inicio-loading">
        <p>Cargando...</p>
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
      {/* Hero Section */}
      <div className="hero-section">
        <h2 className="hero-title">
          Bienvenido a GameTracker
        </h2>
        <h4 className="hero-subtitle">
          Tu biblioteca personal de videojuegos
        </h4>
      </div>
      {/* Estadísticas Rápidas */}
      {juegos.length > 0 && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon"></div>
            <div className="stat-value">{totalJuegos}</div>
            <div className="stat-label">Juegos en Biblioteca</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon"></div>
            <div className="stat-value">{juegosCompletados}</div>
            <div className="stat-label">Completados</div>
          </div>

          <div className="stat-card">
            <div className="stat-icon"></div>
            <div className="stat-value">{horasTotales}h</div>
            <div className="stat-label">Horas Jugadas</div>
          </div>
        </div>
      )}

      {/* Accesos Rápidos */}
      <div className="quick-access-section">
        <h3 className="section-title">Accesos rápidos</h3>
        <div className="quick-access-grid">
          <Link to="/tienda" className="quick-access-link">
            <div className="quick-access-card">
              <div className="quick-access-icon"></div>
              <h4 className="quick-access-title">
                Explorar Tienda
              </h4>
              <p className="quick-access-description">
                Descubre nuevos juegos y agrégalos a tu biblioteca
              </p>
            </div>
          </Link>

          <Link to="/biblioteca" className="quick-access-link">
            <div className="quick-access-card">
              <div className="quick-access-icon"></div>
              <h4 className="quick-access-title">
                Mi Biblioteca
              </h4>
              <p className="quick-access-description">
                Gestiona tu colección y marca juegos como completados
              </p>
            </div>
          </Link>
        </div>
      </div>

      {/* Juegos Agregados Recientemente */}
      <div className="recent-games-section">
        <div className="recent-games-header">
          <h3 className="recent-games-title">
            {juegos.length === 0 ? 'Tus Juegos' : 'Agregados Recientemente'}
          </h3>
          {juegos.length > 6 && (
            <Link to="/biblioteca">
              <button className="view-all-button">
                Ver Todos ({juegos.length}) →
              </button>
            </Link>
          )}
        </div>

        {juegos.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🎮</div>
            <h4>Aún no tienes juegos</h4>
            <p>
              Comienza explorando la tienda y agrega tus juegos favoritos
            </p>
            <Link to="/tienda">
              <button className="empty-state-button">
                Ir a la Tienda
              </button>
            </Link>
          </div>
        ) : (
          <div className="games-grid">
            {juegos.slice(0, 6).map(juego => (
              <div key={juego._id} className="game-card">
                {juego.imagenPortada && (
                  <img 
                    src={juego.imagenPortada} 
                    alt={juego.titulo}
                    className="game-image"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/280x160?text=Sin+Imagen'
                    }}
                  />
                )}
                
                <div className="game-content">
                  <h4 className="game-title">
                    {juego.titulo}
                  </h4>
                  
                  <div className="game-info">
                    <span>{juego.plataforma}</span>
                    <span>{juego.genero}</span>
                  </div>

                  {juego.añoLanzamiento && (
                    <p className="game-year">
                      Año: {juego.añoLanzamiento}
                    </p>
                  )}

                  <div className="game-footer">
                    <span className={`game-status ${juego.completado ? 'completado' : 'en-progreso'}`}>
                      {juego.completado ? 'Completado' : 'En progreso'}
                    </span>

                    {(juego.horasJugadas > 0 || juego.tiempoJugado > 0) && (
                      <span className="game-hours">
                        {juego.horasJugadas || juego.tiempoJugado}h
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default Inicio