import{ Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'  

import dotenv from 'dotenv'
dotenv.config();



// Create a new ratelimiter, that allows 10 requests per 60 seconds
const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(10, '10 s'),
});


export default ratelimit;
