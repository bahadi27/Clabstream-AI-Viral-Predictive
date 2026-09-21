import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut, User } from "firebase/auth";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  getDocs,
  collection,
  query,
  where,
  orderBy,
  deleteDoc,
  onSnapshot
} from "firebase/firestore";
import { ViralityAnalysis } from "../types";

// Safe dynamic resolution of Firebase configuration to support both AI Studio local applet config and GitHub deployment env vars
let appletConfig: Record<string, any> = {};
try {
  const configs = import.meta.glob("../../firebase-applet-config.json", { eager: true });
  const configKey = Object.keys(configs)[0];
  if (configKey && configs[configKey]) {
    appletConfig = (configs[configKey] as any).default || configs[configKey];
  }
} catch {
  // Graceful fallback if firebase-applet-config.json is absent on GitHub
}

const firebaseConfig = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || appletConfig.projectId || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || appletConfig.appId || "",
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || appletConfig.apiKey || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || appletConfig.authDomain || "",
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID || appletConfig.firestoreDatabaseId || "(default)",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || appletConfig.storageBucket || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || appletConfig.messagingSenderId || "",
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.projectId &&
  firebaseConfig.apiKey &&
  firebaseConfig.projectId !== "" &&
  firebaseConfig.apiKey !== ""
);

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// CRITICAL: Initialize Firestore with explicit database ID from config
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Operational type enum for error tracking
export enum OperationType {
  CREATE = "create",
  UPDATE = "update",
  DELETE = "delete",
  LIST = "list",
  GET = "get",
  WRITE = "write",
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.warn("Firestore Operation Notice: ", JSON.stringify(errInfo));
}

// Test Firestore connection on boot if configured
export async function testConnection() {
  if (!isFirebaseConfigured) return;
  try {
    await getDoc(doc(db, "test", "connection"));
  } catch (error) {
    // Graceful offline fallback
  }
}

if (isFirebaseConfigured) {
  testConnection();
}

// Auth helper functions
export async function loginWithGoogle() {
  if (!isFirebaseConfigured) {
    console.warn("Firebase is not fully configured for Google Auth.");
    return null;
  }
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    if (user) {
      const userRef = doc(db, "users", user.uid);
      await setDoc(
        userRef,
        {
          uid: user.uid,
          displayName: user.displayName || "Creator",
          email: user.email || "",
          photoURL: user.photoURL || "",
          createdAt: new Date().toISOString(),
        },
        { merge: true }
      );
    }
    return user;
  } catch (err: any) {
    if (
      err?.code === "auth/cancelled-popup-request" ||
      err?.code === "auth/popup-closed-by-user" ||
      err?.code === "auth/popup-blocked"
    ) {
      console.warn("Google Sign In popup was closed or cancelled:", err.code);
      return null;
    }
    console.error("Google Sign In Error:", err);
    throw err;
  }
}

export async function logoutUser() {
  if (!isFirebaseConfigured) return;
  return firebaseSignOut(auth);
}

// Helper to sanitize analysis object so it stays well under Firestore's 1MB limit
function sanitizeAnalysisForFirestore(analysis: ViralityAnalysis): Record<string, any> {
  const sanitized: Record<string, any> = { ...analysis };

  // Strip large data: or blob: video_url strings that take up megabytes
  if (
    sanitized.video_url &&
    (sanitized.video_url.startsWith("data:") || sanitized.video_url.startsWith("blob:"))
  ) {
    delete sanitized.video_url;
  }

  // Strip large base64 imageData strings in keyframes if > 10KB
  if (Array.isArray(sanitized.keyframes)) {
    sanitized.keyframes = sanitized.keyframes.map((kf: any) => {
      const cleanKf = { ...kf };
      if (cleanKf.imageData && cleanKf.imageData.length > 10000) {
        delete cleanKf.imageData;
      }
      return cleanKf;
    });
  }

  return sanitized;
}

// Firestore analyses operations
export async function saveAnalysisToFirestore(userId: string, analysis: ViralityAnalysis) {
  if (!isFirebaseConfigured || !userId) return;
  const path = `users/${userId}/analyses/${analysis.id}`;
  try {
    const payload = sanitizeAnalysisForFirestore(analysis);
    payload.userId = userId;

    const docRef = doc(db, "users", userId, "analyses", analysis.id);
    await setDoc(docRef, payload);

    // Also copy to top-level analyses for sharing
    const topDocRef = doc(db, "analyses", analysis.id);
    await setDoc(topDocRef, payload);
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function fetchUserAnalyses(userId: string): Promise<ViralityAnalysis[]> {
  if (!isFirebaseConfigured || !userId) return [];
  const path = `users/${userId}/analyses`;
  try {
    const colRef = collection(db, "users", userId, "analyses");
    const snapshot = await getDocs(colRef);
    const results: ViralityAnalysis[] = [];
    snapshot.forEach((docSnap) => {
      results.push(docSnap.data() as ViralityAnalysis);
    });
    return results;
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
    return [];
  }
}

export async function saveSharedAnalysisToFirestore(analysis: ViralityAnalysis) {
  if (!isFirebaseConfigured) return;
  try {
    const payload = sanitizeAnalysisForFirestore(analysis);
    const topDocRef = doc(db, "analyses", analysis.id);
    await setDoc(topDocRef, payload, { merge: true });
  } catch (err) {
    console.warn("Could not save top-level shared analysis to Firestore:", err);
  }
}

export async function fetchSharedAnalysisFromFirestore(analysisId: string): Promise<ViralityAnalysis | null> {
  if (!isFirebaseConfigured || !analysisId) return null;
  try {
    const docRef = doc(db, "analyses", analysisId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as ViralityAnalysis;
    }
  } catch (err) {
    console.warn("Could not fetch shared analysis from Firestore:", err);
  }
  return null;
}

export async function deleteAnalysisFromFirestore(userId: string, analysisId: string) {
  if (!isFirebaseConfigured || !userId || !analysisId) return;
  const path = `users/${userId}/analyses/${analysisId}`;
  try {
    await deleteDoc(doc(db, "users", userId, "analyses", analysisId));
    await deleteDoc(doc(db, "analyses", analysisId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

