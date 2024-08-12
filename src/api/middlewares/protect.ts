import { type Request, type Response, type NextFunction } from 'express'
import { timingSafeEqual } from 'crypto'
import envHandler from '@/config/envHandler'

const protect = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (process.env.NODE_ENV !== 'production') {
    next()
    return
  }
  const apiKey = req.headers['x-api-key']
  if (apiKey == null || typeof apiKey !== 'string') {
    res.status(401).json({ error: 'API key is required' })
    return
  }
  const serverApiKey = envHandler.API_KEY
  const isEqual = timingSafeEqual(Buffer.from(apiKey), Buffer.from(serverApiKey))
  if (!isEqual) {
    res.status(403).json({ error: 'Invalid API key' })
    return
  }
  next()
}

export default protect
