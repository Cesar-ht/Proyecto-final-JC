import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import FormularioJuego from '../games/FormularioJuego' 
import './../../styles/index.css'

function Biblioteca() {
    const navigate = useNavigate()
    const [juegos, setJuegos] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    
    const [mostrarFormulario, setMostrarFormulario] = useState(false) 

    // Filtros
    const [filterCompletado, setFilterCompletado] = useState('todos')
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        fetchJuegos()
    }, [])

    const getToken = () => localStorage.getItem('token')

    const fetchJuegos = async () => {
        try {
            const token = getToken()
            
            const response = await fetch('http://localhost:3000/api/games', {
                headers: {
                    'Authorization': token ? `Bearer ${token}` : ''
                }
            })

            if (!response.ok) {
                // Si la respuesta no es OK (ej. 401 Unauthorized, 500)
                throw new Error('Error al cargar los juegos. ¿Sesión expirada?')
            }

            const data = await response.json()
            setJuegos(data)
        } catch (error) {
            console.error('Error al obtener juegos:', error)
            setError('No se pudieron cargar los juegos. Revisa tu conexión o sesión.')
        } finally {
            setLoading(false)
        }
    }

    // --- MANEJO DE FORMULARIO (Agregar/Editar) ---

    const handleEdit = (juego) => {
        navigate(`/biblioteca/editar/${juego._id}`)
    }

    const handleJuegoGuardado = () => {
        // Se llama después de crear o editar un juego
        navigate('/biblioteca')
        setMostrarFormulario(false)
        fetchJuegos() 
    }

    const handleCancelar = () => {
        setJuegoEditando(null)
        setMostrarFormulario(false)
    }

    // --- MANEJO DE ELIMINACIÓN ---

    const handleDelete = async (juegoId, titulo) => {
        if (!confirm(`¿Estás seguro de ELIMINAR permanentemente "${titulo}"?`)) return

        try {
            const token = getToken()
            
            const response = await fetch(`http://localhost:3000/api/games/${juegoId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': token ? `Bearer ${token}` : ''
                }
            })

            if (response.ok) {
                setJuegos(juegos.filter(j => j._id !== juegoId))
                alert('Juego eliminado de la biblioteca')
            } else {
                 throw new Error('No autorizado o error del servidor.')
            }
        } catch (error) {
            console.error('Error al eliminar:', error)
            alert('Error al eliminar el juego. Revisa tu sesión.')
        }
    }

    // --- MANEJO DE ESTADO COMPLETADO ---

    const toggleCompletado = async (juego) => {
        try {
            const token = getToken()
            
            const response = await fetch(`http://localhost:3000/api/games/${juego._id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ completado: !juego.completado })
            })

            if (response.ok) {
                setJuegos(juegos.map(j => 
                    j._id === juego._id ? { ...j, completado: !j.completado } : j
                ))
            }
        } catch (error) {
            console.error('Error al actualizar:', error)
            alert('Error al actualizar el juego')
        }
    }

    // --- LÓGICA DE FILTROS ---

    const juegosFiltrados = juegos.filter(juego => {
        const matchSearch = juego.titulo.toLowerCase().includes(searchTerm.toLowerCase())
        const matchCompletado = 
            filterCompletado === 'todos' ||
            (filterCompletado === 'completados' && juego.completado) ||
            (filterCompletado === 'pendientes' && !juego.completado)
        return matchSearch && matchCompletado
    })

    // --- ESTADÍSTICAS ---

    const totalJuegos = juegos.length
    const juegosCompletados = juegos.filter(j => j.completado).length
    const horasTotales = juegos.reduce((sum, j) => sum + (j.horasJugadas || j.tiempoJugado || 0), 0)

    if (loading) {
        return (
            <div className="inicio-loading">
                <p>Cargando biblioteca...</p>
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

    // --- RENDERIZADO PRINCIPAL ---

    return (
        <>
            {/* Formulario de Agregar/Editar */}
            {mostrarFormulario && (
                <div className="modal-overlay">
                    <FormularioJuego 
                        juego={juegoEditando} 
                        onGuardado={handleJuegoGuardado}
                        onCancelar={handleCancelar}
                    />
                </div>
            )}
            
            {/* Header con Botón de Tienda y Agregar */}
            <div className="biblioteca-header">
                <div>
                    <h2>Mi Biblioteca</h2>
                    <h4>Gestiona tu colección de juegos</h4>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <Link to="/tienda">
                        <button className="explorar-tienda-btn">
                            Explorar Tienda
                        </button>
                    </Link>
                </div>
            </div>

            {/* Estadísticas */}
            <div className="biblioteca-stats">
                <div className="stat-item">
                    <div className="stat-number">{totalJuegos}</div>
                    <div className="stat-label">Total de Juegos</div>
                </div>
                <div className="stat-item">
                    <div className="stat-number">{juegosCompletados}</div>
                    <div className="stat-label">Completados</div>
                </div>
                <div className="stat-item">
                    <div className="stat-number">{horasTotales}h</div>
                    <div className="stat-label">Horas Jugadas</div>
                </div>
            </div>

            {/* Filtros */}
            <div className="biblioteca-filters">
                <div className="filters-grid-biblioteca">
                    <div className="filter-group-biblioteca">
                        <label>Buscar</label>
                        <input
                            type="text"
                            placeholder="Buscar juego..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="filter-input-biblioteca"
                        />
                    </div>
                    <div className="filter-group-biblioteca">
                        <label>Estado</label>
                        <select
                            value={filterCompletado}
                            onChange={(e) => setFilterCompletado(e.target.value)}
                            className="filter-select-biblioteca"
                        >
                            <option value="todos">Todos</option>
                            <option value="completados">Completados</option>
                            <option value="pendientes">Pendientes</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Lista de Juegos */}
            {juegosFiltrados.length === 0 ? (
                <div className="biblioteca-empty-state">
                    <div className="biblioteca-empty-icon"></div>
                    <h4>
                        {juegos.length === 0 
                            ? 'Tu biblioteca está vacía' 
                            : 'No se encontraron juegos con esos filtros'
                        }
                    </h4>
                    <p className="biblioteca-empty-text">
                        {juegos.length === 0
                            ? 'Comienza agregando juegos o explorando la tienda'
                            : 'Intenta cambiar los filtros de búsqueda'
                        }
                    </p>
                    {juegos.length === 0 && (
                        <button onClick={() => setMostrarFormulario(true)} className="ir-tienda-btn">
                            Añadir mi primer Juego
                        </button>
                    )}
                </div>
            ) : (
                <>
                    <div className="biblioteca-counter">
                        <h3>
                            {juegosFiltrados.length} {juegosFiltrados.length === 1 ? 'juego' : 'juegos'}
                        </h3>
                    </div>

                    <div className="biblioteca-juegos-grid">
                        {juegosFiltrados.map(juego => (
                            <div 
                                key={juego._id}
                                className="juego-card-biblioteca"
                            >
                                {/* Imagen */}
                                {juego.imagenPortada && (
                                    <img 
                                        src={juego.imagenPortada} 
                                        alt={juego.titulo}
                                        className="juego-imagen-biblioteca"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/280x180?text=Sin+Imagen'
                                        }}
                                    />
                                )}

                                {/* Información */}
                                <div className="juego-content-biblioteca">
                                    <h4 className="juego-titulo-biblioteca">
                                        {juego.titulo}
                                    </h4>

                                    <div className="juego-meta-biblioteca">
                                        <div className="juego-plataforma-genero">
                                            {juego.plataforma} • {juego.genero}
                                        </div>
                                        {(juego.horasJugadas > 0 || juego.tiempoJugado > 0) && (
                                            <div className="juego-horas">
                                                {juego.horasJugadas || juego.tiempoJugado} horas jugadas
                                            </div>
                                        )}
                                    </div>

                                    {/* Estado */}
                                    <div className="juego-acciones-biblioteca">
                                        <button
                                            onClick={() => toggleCompletado(juego)}
                                            className={`estado-btn ${juego.completado ? 'completado' : 'en-progreso'}`}
                                        >
                                            {juego.completado ? 'Completado' : 'En Progreso'}
                                        </button>
                                        
                                        {/* Botón Editar */}
                                        <button
                                            onClick={() => handleEdit(juego)}
                                            className="editar-btn"
                                        >
                                            Editar
                                        </button>
                                    </div>

                                    {/* Botón Eliminar */}
                                    <button
                                        onClick={() => handleDelete(juego._id, juego.titulo)}
                                        className="eliminar-btn"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </>
    )
}

export default Biblioteca
