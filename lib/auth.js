import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

// Initialize Firebase Admin SDK using modular exports
function getFirebaseAdmin() {
  try {
    const apps = getApps();
    if (apps.length > 0) {
      return getAuth(apps[0]);
    }

    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY;

    if (!projectId || !clientEmail || !privateKey) {
      console.warn("⚠️ Firebase Admin credentials not set. Firebase Auth verification is disabled.");
      return null;
    }

    const app = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      }),
    });
    return getAuth(app);
  } catch (error) {
    console.error("❌ Failed to initialize Firebase Admin SDK:", error);
    return null;
  }
}

const firebaseAuth = getFirebaseAdmin();

/**
 * Verify a Firebase ID Token using Firebase Admin SDK.
 * @param {string} token
 * @returns {Promise<boolean>}
 */
export async function validateSession(token) {
  if (!token || !firebaseAuth) return false;
  try {
    const decodedToken = await firebaseAuth.verifyIdToken(token);
    return !!decodedToken;
  } catch (error) {
    console.error('Firebase token validation failed:', error);
    return false;
  }
}

/**
 * Extract Firebase token from request headers.
 * Expects: Authorization: Bearer <ID_TOKEN>
 * @param {Request} request
 * @returns {string|null}
 */
export function extractToken(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  return authHeader.slice(7);
}

/**
 * Middleware-style auth check.
 * @param {Request} request
 * @returns {Promise<null|{error: string, status: number}>}
 */
export async function requireAdmin(request) {
  const token = extractToken(request);
  if (!token) {
    return { error: 'Authentication required. Please log in.', status: 401 };
  }

  if (!firebaseAuth) {
    return { error: 'Firebase Auth is not configured on the server.', status: 500 };
  }

  try {
    const decodedToken = await firebaseAuth.verifyIdToken(token);
    request.user = decodedToken;
    return null; // Auth passed
  } catch (error) {
    console.error('Firebase Admin Auth failed verification:', error);
    return { error: 'Session expired or invalid. Please log in again.', status: 401 };
  }
}
