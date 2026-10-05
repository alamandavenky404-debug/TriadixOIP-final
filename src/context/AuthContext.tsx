import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db, handleFirestoreError, OperationType, testFirestoreConnection } from '../lib/firebase';
import { CandidateProfile } from '../types/career';
import { DEFAULT_CANDIDATE_PROFILE } from '../data/mockData';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  userProfile: CandidateProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<CandidateProfile>>;
  saveProfileToFirestore: (profile: CandidateProfile) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<CandidateProfile>(DEFAULT_CANDIDATE_PROFILE);

  useEffect(() => {
    testFirestoreConnection();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Load profile from Firestore
        const userDocRef = doc(db, 'users', user.uid);
        try {
          const snapshot = await getDoc(userDocRef);
          if (snapshot.exists()) {
            const data = snapshot.data();
            setUserProfile((prev) => ({
              ...prev,
              name: data.name || user.displayName || prev.name,
              targetRole: data.targetRole || prev.targetRole,
              college: data.college || prev.college,
              degree: data.degree || prev.degree,
              graduationYear: data.graduationYear || prev.graduationYear,
              currentSkills: data.currentSkills || prev.currentSkills,
            }));
          } else {
            // Initialize document
            await setDoc(userDocRef, {
              userId: user.uid,
              name: user.displayName || userProfile.name,
              email: user.email || '',
              targetRole: userProfile.targetRole,
              college: userProfile.college,
              degree: userProfile.degree,
              graduationYear: userProfile.graduationYear,
              currentSkills: userProfile.currentSkills,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.GET, `users/${user.uid}`);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Google Sign-in Error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout Error:', error);
      throw error;
    }
  };

  const saveProfileToFirestore = async (newProfile: CandidateProfile) => {
    setUserProfile(newProfile);
    if (!currentUser) return;
    const userDocRef = doc(db, 'users', currentUser.uid);
    try {
      await setDoc(
        userDocRef,
        {
          name: newProfile.name,
          targetRole: newProfile.targetRole,
          college: newProfile.college,
          degree: newProfile.degree,
          graduationYear: newProfile.graduationYear,
          currentSkills: newProfile.currentSkills,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${currentUser.uid}`);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        signInWithGoogle,
        logout,
        userProfile,
        setUserProfile,
        saveProfileToFirestore,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
