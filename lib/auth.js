import crypto from 'crypto';
import { findOne, insertOne, deleteMany } from './db.js';

/**
 * Admin Authentication Module for Bihar Ka Bazaar
 * 
 * Simple session-token based auth for admin panel.
 * Swap this for NextAuth.js / JWT when building the full backend.
 * 
 * Set BKB_ADMIN_USERNAME and BKB_ADMIN_PASSWORD in production.
 */

// Sessions expire after 24 hours
const SESSION_TTL_MS = 24 * 60 * 60 * 1000;

function getAdminCredentials() {
  const username = process.env.BKB_ADMIN_USERNAME;
  const password = process.env.BKB_ADMIN_PASSWORD;

  if (username && password) {
    return { username, password };
  }

  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  return {
    username: 'admin',
    password: 'bkb2026',
  };
}

function timingSafeEqualString(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

/**
 * Validate admin login credentials and create a session.
 * @param {string} username
 * @param {string} password
 * @returns {Promise<{success: boolean, token?: string, error?: string}>}
 */
export async function validateAdminLogin(username, password) {
  const credentials = getAdminCredentials();
  if (!credentials) {
    return { success: false, error: 'Admin credentials are not configured.' };
  }

  const validUsername = timingSafeEqualString(username, credentials.username);
  const validPassword = timingSafeEqualString(password, credentials.password);

  if (!validUsername || !validPassword) {
    return { success: false, error: 'Invalid username or password.' };
  }

  // Clean expired sessions
  await cleanExpiredSessions();

  // Generate new session token
  const token = crypto.randomBytes(32).toString('hex');
  const session = {
    token,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + SESSION_TTL_MS).toISOString(),
  };

  await insertOne('sessions', session);

  return { success: true, token };
}

/**
 * Validate a session token.
 * @param {string} token
 * @returns {Promise<boolean>}
 */
export async function validateSession(token) {
  if (!token) return false;

  const session = await findOne('sessions', 'token', token);
  if (!session) return false;

  // Check expiry
  if (new Date(session.expiresAt) < new Date()) {
    // Session expired — clean it up
    await deleteMany('sessions', s => s.token === token);
    return false;
  }

  return true;
}

/**
 * Invalidate (logout) a session.
 * @param {string} token
 * @returns {Promise<boolean>}
 */
export async function invalidateSession(token) {
  if (!token) return false;
  const count = await deleteMany('sessions', s => s.token === token);
  return count > 0;
}

/**
 * Extract admin token from request headers.
 * Expects: Authorization: Bearer <token>
 * @param {Request} request
 * @returns {string|null}
 */
export function extractToken(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  return authHeader.slice(7);
}

/**
 * Middleware-style auth check. Returns null if valid, or a NextResponse error if invalid.
 * @param {Request} request
 * @returns {Promise<null|{error: string, status: number}>}
 */
export async function requireAdmin(request) {
  const token = extractToken(request);
  if (!token) {
    return { error: 'Authentication required. Please log in.', status: 401 };
  }

  const valid = await validateSession(token);
  if (!valid) {
    return { error: 'Session expired or invalid. Please log in again.', status: 401 };
  }

  return null; // Auth passed
}

/**
 * Clean up expired sessions from the store.
 */
async function cleanExpiredSessions() {
  const now = new Date();
  await deleteMany('sessions', s => new Date(s.expiresAt) < now);
}
