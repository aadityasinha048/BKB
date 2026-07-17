const ipRequests = new Map();

// Periodically clean up expired records
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of ipRequests.entries()) {
      if (value.resetTime < now) {
        ipRequests.delete(key);
      }
    }
  }, 5 * 60 * 1000).unref?.();
}

/**
 * Basic in-memory rate limiting for Next.js API routes.
 * @param {string} ip - Client identifier (IP address)
 * @param {string} route - API Route identifier
 * @param {number} limit - Max requests allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {Promise<{success: boolean, limit: number, remaining: number, resetTime: number}>}
 */
export async function rateLimit(ip, route, limit = 10, windowMs = 60 * 1000) {
  const key = `${ip}:${route}`;
  const now = Date.now();
  
  let record = ipRequests.get(key);
  
  if (!record || record.resetTime < now) {
    record = {
      count: 1,
      resetTime: now + windowMs
    };
    ipRequests.set(key, record);
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: record.resetTime
    };
  }
  
  record.count += 1;
  
  if (record.count > limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset: record.resetTime
    };
  }
  
  return {
    success: true,
    limit,
    remaining: limit - record.count,
    reset: record.resetTime
  };
}
