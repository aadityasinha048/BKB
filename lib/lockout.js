const failedAttempts = new Map(); // identifier (email/username/mobile) -> { count, lockoutUntil, lastAttempt }
const ipRequests = new Map(); // ip -> [timestamps]

// Clean up old entries periodically
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of failedAttempts.entries()) {
      if (value.lockoutUntil < now && value.lastAttempt < now - 24 * 60 * 60 * 1000) {
        failedAttempts.delete(key);
      }
    }
    for (const [key, value] of ipRequests.entries()) {
      const filtered = value.filter(ts => now - ts < 60 * 1000);
      if (filtered.length === 0) {
        ipRequests.delete(key);
      } else {
        ipRequests.set(key, filtered);
      }
    }
  }, 15 * 60 * 1000).unref?.();
}

/**
 * 1. Rate Limit: Max 10 requests per IP per minute.
 * @param {string} ip
 * @returns {{success: boolean}}
 */
export function checkIpRateLimit(ip) {
  const now = Date.now();
  let requests = ipRequests.get(ip) || [];
  
  // Filter out requests older than 1 minute (60,000 ms)
  requests = requests.filter(ts => now - ts < 60 * 1000);
  
  if (requests.length >= 10) {
    return { success: false };
  }
  
  requests.push(now);
  ipRequests.set(ip, requests);
  return { success: true };
}

/**
 * Check if an account identifier is currently locked out.
 * @param {string} identifier
 * @returns {{locked: boolean, remainingTime?: number}}
 */
export function getLockoutStatus(identifier) {
  const now = Date.now();
  const record = failedAttempts.get(identifier);
  if (record && record.lockoutUntil > now) {
    return { locked: true, remainingTime: record.lockoutUntil - now };
  }
  return { locked: false };
}


/**
 * Get progressive delay (in milliseconds) based on failed attempt count.
 * 1st fail: 0s, 2nd: 1s, 3rd: 2s, 4th: 4s, 5th: 8s, 6th: 16s...
 * capped at 30 seconds.
 */
export function getDelayTime(failCount) {
  if (failCount <= 1) return 0;
  return Math.min(30 * 1000, Math.pow(2, failCount - 2) * 1000);
}

/**
 * Handles progressive delay, failed counts, and lockouts.
 * @param {string} identifier
 * @param {boolean} isSuccess
 * @param {Function} [onLockoutTriggered]
 * @returns {Promise<{allowed: boolean, delay?: number, lockoutUntil?: number}>}
 */
export async function handleLoginAttempt(identifier, isSuccess, onLockoutTriggered) {
  const now = Date.now();
  let record = failedAttempts.get(identifier);
  
  if (!record) {
    record = {
      count: 0,
      lockoutUntil: 0,
      lastAttempt: now
    };
  }
  
  // If already locked out
  if (record.lockoutUntil > now) {
    return {
      allowed: false,
      lockoutUntil: record.lockoutUntil
    };
  }
  
  if (isSuccess) {
    // Reset count upon successful login
    failedAttempts.delete(identifier);
    return { allowed: true, delay: 0 };
  }
  
  // Failed attempt
  record.count += 1;
  record.lastAttempt = now;
  
  let lockoutUntil = 0;
  if (record.count >= 5) {
    lockoutUntil = now + 15 * 60 * 1000; // 15 mins lockout
    record.lockoutUntil = lockoutUntil;
    
    if (onLockoutTriggered) {
      onLockoutTriggered().catch(err => {
        console.error('Failed to run lockout triggered callback:', err);
      });
    }
  }
  
  failedAttempts.set(identifier, record);
  
  const delay = getDelayTime(record.count);
  return {
    allowed: true,
    delay,
    lockoutUntil
  };
}
