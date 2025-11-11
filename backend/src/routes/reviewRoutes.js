import { Router } from 'express'
const router = Router()

router.get('/', (req, res) => {
  res.json({ message: 'Endpoint de reviews funcionando ✅' })
})

export default router
