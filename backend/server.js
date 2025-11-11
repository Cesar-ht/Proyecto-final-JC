import dotenv from 'dotenv'
import app from './src/app.js'
import connectDB from './src/config/database.js'

dotenv.config()

const PORT = process.env.PORT || 5000

connectDB()

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`)
  console.log(`URL: http://localhost:${PORT}`)
  console.log(`Ambiente: ${process.env.NODE_ENV}`)
})