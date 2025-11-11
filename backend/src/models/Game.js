// src/models/Game.js
import mongoose from 'mongoose'

const gameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  platform: {
    type: String,
    required: true,
    enum: ['PC', 'PlayStation', 'Xbox', 'Nintendo Switch', 'Mobile', 'Otro']
  },
  genre: {
    type: String,
    default: null,
    trim: true
  },
  releaseDate: {
    type: Date,
    default: null
  }
}, {
  timestamps: true 
})

const Game = mongoose.model('Game', gameSchema)

export default Game
