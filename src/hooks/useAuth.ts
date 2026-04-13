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
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider, githubProvider } from '../firebase';

export interface UserProfile {
  uid: string;
  email: string;
  firstName: string;
  lastName: string;
  photoURL: string;
  role: 'admin' | 'user';
  createdAt: any;
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
        const docRef = doc(db, 'users', firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        } else {
          const names = (firebaseUser.displayName || '').split(' ');
          const firstName = names[0] || '';
          const lastName = names.slice(1).join(' ') || '';

          const newProfile: UserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            firstName,
            lastName,
            photoURL: firebaseUser.photoURL || '',
            role: 'user',
            createdAt: serverTimestamp(),
          };
          await setDoc(docRef, newProfile);
          setProfile(newProfile);
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
      
      // Explicitly create profile with split names
      const docRef = doc(db, 'users', res.user.uid);
      const newProfile: UserProfile = {
        uid: res.user.uid,
        email: res.user.email || '',
        firstName,
        lastName,
        photoURL: res.user.photoURL || '',
        role: 'user',
        createdAt: serverTimestamp(),
      };
      await setDoc(docRef, newProfile);
      setProfile(newProfile);
      
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
