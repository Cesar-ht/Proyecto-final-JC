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
    const { title, platform, genre, releaseDate } = req.body
    const newGame = await Game.create({ title, platform, genre, releaseDate })
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
      { new: true } 
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
