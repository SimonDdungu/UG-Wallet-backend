import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'
import "dotenv/config"

const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(15, "20 m"),
})

export default ratelimit