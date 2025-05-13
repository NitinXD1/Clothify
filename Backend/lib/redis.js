import Redis from "ioredis"
import dotenv from 'dotenv'

dotenv.config()

export const redis = new Redis(process.env.UPSTASH_REDIS_URI);
//redis -> key-value store
//how to use redis is with this line foo is the key and bar is the value
// await redis.set('foo', 'bar');