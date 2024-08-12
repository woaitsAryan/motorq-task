import constants from '@/config/constants'
import logger from '@/loaders/logger'
import { redisClient } from '@/loaders/redis'
import { type Request, type Response, type NextFunction } from 'express'

const globalRateLimit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const currentTime = Math.floor(Date.now() / 1000)
    const key = `global:${currentTime}`

    const requestCount = await redisClient.get(key)

    if (requestCount != null && parseInt(requestCount, 10) >= constants.globalRateLimit) {
      res.status(429).json({ message: 'Too many requests, please try again later.', success: false, data: {} })
      logger.protect('Rate limit exceeded by' + req.ip)
      return
    }

    await redisClient.multi()
      .incr(key)
      .expire(key, 59)
      .exec()

    next()
  } catch (error) {
    // logger.error(`Rate limiting error: ${error}`)
    console.error('Rate limiting error:', error)
    res.status(500).json({ message: 'Internal server error', success: false })
  }
}

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next)
  }

export default asyncHandler(globalRateLimit)
