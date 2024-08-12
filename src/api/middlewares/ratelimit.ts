import { redisClient } from '@/loaders/redis'
import { type Request, type Response, type NextFunction } from 'express'

const rateLimit = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const currentTime = Math.floor(Date.now() / 1000)
    const currentMinute = Math.floor(currentTime / 60)
    const key = `global:${currentMinute}`
    const maxRequests = 20

    const requestCount = await redisClient.get(key)

    if (requestCount != null && parseInt(requestCount, 10) >= maxRequests) {
      res.status(429).json({ message: 'Too many requests, please try again later.', success: false })
      return
    }

    await redisClient.multi()
      .incr(key)
      .expire(key, 59)
      .exec()

    next()
  } catch (error) {
    console.error('Rate limiting error:', error)
    res.status(500).json({ message: 'Internal server error', success: false })
  }
}

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next)
  }

export default asyncHandler(rateLimit)
