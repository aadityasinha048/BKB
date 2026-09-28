/**
 * In-memory rate limiter for Next.js API routes.
 *
 * SECURITY NOTE: IP detection relies on x-forwarded-for, which can be spoofed
 * by clients unless your proxy/CDN (e.g. Vercel, Cloudflare) strips and overwrites
 * that header before it reaches this server. In production, ensure your infrastructure
 * sets a trusted IP header. We use only the LAST (rightmost) IP in the chain which
 * is the one appended by the trusted reverse proxy closest to the server.
 *
 * For Vercel deployments, use x-vercel-forwarded-for or x-real-ip instead, as those
 * are set by Vercel's infrastructure and cannot be spoofed by the client.
 */

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
 * Extract the most trusted client IP from the request.
 * On Vercel, x-vercel-forwarded-for is set by infrastructure.
 * Otherwise, we take the LAST IP in x-forwarded-for (set by closest trusted proxy),
 * and fall back to x-real-ip, then 127.0.0.1.
 * 
 * @param {Request} request
 * @returns {string}
 */
export function getClientIp(request) {
  // Prefer Vercel's infrastructure-set header (cannot be spoofed by client)
  const vercelIp = request.headers.get('x-vercel-forwarded-for');
  if (vercelIp) return vercelIp.split(',')[0].trim();

  // Use rightmost IP in x-forwarded-for (set by the trusted reverse proxy)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    const parts = forwarded.split(',');
    // The rightmost IP is the one added by the last (most trusted) proxy
    return parts[parts.length - 1].trim();
  }

  return request.headers.get('x-real-ip') || '127.0.0.1';
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
  // Sanitize key components to prevent key injection
  const safeIp = String(ip).slice(0, 64).replace(/[^a-zA-Z0-9.:_-]/g, '_');
  const safeRoute = String(route).slice(0, 64).replace(/[^a-zA-Z0-9_-]/g, '_');
  const key = `${safeIp}:${safeRoute}`;
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
