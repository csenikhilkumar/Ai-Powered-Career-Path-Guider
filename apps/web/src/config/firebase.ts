import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, type Auth } from "firebase/auth";

const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

/** Required for Google Sign-In: apiKey and authDomain must be set in .env */
export function isFirebaseConfigured(): boolean {
    const apiKey = firebaseConfig.apiKey;
    const authDomain = firebaseConfig.authDomain;
    return Boolean(
        typeof apiKey === "string" &&
        apiKey.length > 0 &&
        apiKey !== "your-api-key-here" &&
        typeof authDomain === "string" &&
        authDomain.length > 0 &&
        authDomain !== "your-auth-domain-here"
    );
}

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

function getFirebaseAuth(): Auth {
    if (!isFirebaseConfigured()) {
        throw new Error(
            "Google sign-in is not configured. Add VITE_FIREBASE_API_KEY and VITE_FIREBASE_AUTH_DOMAIN to apps/web/.env (see .env.example)."
        );
    }
    if (!app) {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
    }
    if (!auth) auth = getAuth(app!);
    return auth;
}

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
    const authInstance = getFirebaseAuth();
    try {
        const result = await signInWithPopup(authInstance, googleProvider);
        return result;
    } catch (error: unknown) {
        console.error("Error signing in with Google", error);
        throw error;
    }
};

export function getAuthInstance(): Auth | null {
    if (!app) return null;
    return auth ?? getAuth(app);
}

export { googleProvider };
