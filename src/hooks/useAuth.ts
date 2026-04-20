import React, { useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { auth, googleProvider, githubProvider } from '../firebase';
import { api, ApiUser } from '../lib/api';

export interface UserProfile {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  photoURL: string;
  role: 'admin' | 'user';
  createdAt: any;
}

function apiUserToProfile(apiUser: ApiUser, firebaseUid: string): UserProfile {
  return {
    uid: firebaseUid,
    email: apiUser.email,
    firstName: apiUser.firstName || '',
    lastName: apiUser.lastName || '',
    photoURL: apiUser.photoURL || '',
    role: apiUser.role === 'ADMIN' ? 'admin' : 'user',
    createdAt: new Date(),
  };
}

export function useAuth() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          // Sync with backend — the backend auto-creates the user on first request
          const apiUser = await api.getMe();
          setProfile(apiUserToProfile(apiUser, firebaseUser.uid));
        } catch (err: any) {
          console.error('Failed to sync user with backend:', err.message);
          // Fallback to Firebase data if backend is unreachable
          const names = (firebaseUser.displayName || '').split(' ');
          setProfile({
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            firstName: names[0] || '',
            lastName: names.slice(1).join(' ') || '',
            photoURL: firebaseUser.photoURL || '',
            role: 'user',
            createdAt: new Date(),
          });
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
  const loginWithGithub = () => signInWithPopup(auth, githubProvider);
  
  const registerWithEmail = async (email: string, pass: string, firstName: string, lastName: string) => {
    setError(null);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, pass);
      await updateProfile(res.user, { displayName: `${firstName} ${lastName}` });
      
      // Backend will auto-create the user when we first call getMe (via auth middleware)
      try {
        const apiUser = await api.getMe();
        setProfile(apiUserToProfile(apiUser, res.user.uid));
      } catch {
        setProfile({
          uid: res.user.uid,
          email: res.user.email || '',
          firstName,
          lastName,
          photoURL: res.user.photoURL || '',
          role: 'user',
          createdAt: new Date(),
        });
      }
      
      return res.user;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    setError(null);
    try {
      const res = await signInWithEmailAndPassword(auth, email, pass);
      return res.user;
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const logout = () => signOut(auth);

  return { 
    user, 
    profile, 
    loading, 
    error,
    loginWithGoogle, 
    loginWithGithub, 
    registerWithEmail,
    loginWithEmail,
    logout 
  };
}
