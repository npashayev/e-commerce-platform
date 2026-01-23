import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Initialize Redis client
const redis = Redis.fromEnv();

// Create different rate limiters for different use cases
export const apiRateLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '1 m'), // 100 requests per minute
    analytics: true,
    prefix: 'ratelimit:api',
});

export const authRateLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(5, '15 m'), // 5 login attempts per 15 minutes
    analytics: true,
    prefix: 'ratelimit:auth',
});

export const strictRateLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute for sensitive endpoints
    analytics: true,
    prefix: 'ratelimit:strict',
});