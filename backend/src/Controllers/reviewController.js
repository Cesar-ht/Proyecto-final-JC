import Review from '../models/Review.js'

export const createReview = async (req, res, next) => {
  try {
    const { gameId, rating, comment, hoursPlayed } = req.body
    const review = await Review.create({ gameId, rating, comment, hoursPlayed })
    res.status(201).json(review)
  } catch (error) {
    next(error)
  }
}

export const getReviewsByGame = async (req, res, next) => {
  try {
    const reviews = await Review.find({ gameId: req.params.gameId }).sort({ createdAt: -1 })
    res.json(reviews)
  } catch (error) {
    next(error)
  }
}

export const updateReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!review) {
      return res.status(404).json({ message: 'Reseña no encontrada' })
    }
    res.json(review)
  } catch (error) {
    next(error)
  }
}

export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id)
    if (!review) {
      return res.status(404).json({ message: 'Reseña no encontrada' })
    }
    res.json({ message: 'Reseña eliminada' })
  } catch (error) {
    next(error)
  }
}
