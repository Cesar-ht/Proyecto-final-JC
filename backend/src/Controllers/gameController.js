import Game from '../models/Game.js'

export const getGames = async (req, res, next) => {
  try {
    const games = await Game.find().sort({ createdAt: -1 })
    res.json(games)
  } catch (error) {
    next(error)
  }
}

export const getGameById = async (req, res, next) => {
  try {
    const game = await Game.findById(req.params.id)
    if (!game) return res.status(404).json({ message: 'Juego no encontrado' })
    res.json(game)
  } catch (error) {
    next(error)
  }
}

export const createGame = async (req, res, next) => {
  try {
    const { titulo, plataforma, genero, añoLanzamiento, desarrollador, imagenPortada, descripcion, horasJugadas, completado } = req.body
    
    if (!titulo || !plataforma) {
      return res.status(400).json({ message: 'El título y la plataforma son obligatorios' })
    }
    
    const newGame = await Game.create({ 
      titulo, 
      plataforma, 
      genero, 
      añoLanzamiento, 
      desarrollador, 
      imagenPortada, 
      descripcion,
      horasJugadas,
      completado 
    })
    res.status(201).json(newGame)
  } catch (error) {
    next(error)
  }
}

export const updateGame = async (req, res, next) => {
  try {
    const game = await Game.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }  
    )
    if (!game) return res.status(404).json({ message: 'Juego no encontrado' })
    res.json(game)
  } catch (error) {
    next(error)
  }
}

export const deleteGame = async (req, res, next) => {
  try {
    const game = await Game.findByIdAndDelete(req.params.id)
    if (!game) return res.status(404).json({ message: 'Juego no encontrado' })
    res.json({ message: 'Juego eliminado correctamente' })
  } catch (error) {
    next(error)
  }
}