"use client";
import type { ReactNode } from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import type { UserProfile as AppUserProfile } from '@/lib/types';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, type User as FirebaseUser, signOut as firebaseSignOut, signInWithEmailAndPassword as firebaseSignIn } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export type UserRole = 'student' | 'mentor' | 'admin';

interface UserContextType {
  user: AppUserProfile | null;
  isLoading: boolean;
  loginWithEmail: (email: string, password: string, role: UserRole, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  login: (role: UserRole, name?: string) => Promise<void>; // For UserRoleSwitcher
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const getDefaultAvatar = (role: UserRole) => `https://placehold.co/100x100.png?text=${role.charAt(0).toUpperCase()}`;

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<AppUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userDocRef = doc(db, "users", firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUserState({
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: userData.name || firebaseUser.displayName || 'User',
            role: userData.role || 'student',
            avatarUrl: userData.avatarUrl || firebaseUser.photoURL || getDefaultAvatar(userData.role || 'student'),
            school: userData.school || 'CampusConnect Academy',
          });
        } else {
          // This case implies new user via Auth not yet in Firestore, loginWithEmail handles initial Firestore doc creation
          // For robustness, ensure a default profile is created if somehow missed by login.
          const defaultRole: UserRole = 'student';
          const newUserProfile: AppUserProfile = {
            id: firebaseUser.uid,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || 'New User',
            role: defaultRole,
            avatarUrl: firebaseUser.photoURL || getDefaultAvatar(defaultRole),
            school: 'CampusConnect Academy',
          };
          try {
            await setDoc(userDocRef, { 
              email: newUserProfile.email,
              name: newUserProfile.name,
              role: newUserProfile.role,
              avatarUrl: newUserProfile.avatarUrl,
              school: newUserProfile.school,
              createdAt: serverTimestamp(),
            });
            setUserState(newUserProfile);
          } catch (error) {
            console.error("Error creating fallback user doc:", error)
          }
        }
      } else {
        setUserState(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, password: string, role: UserRole, name?: string) => {
    setIsLoading(true);
    try {
      const userCredential = await firebaseSignIn(auth, email, password);
      const firebaseUser = userCredential.user;
      
      const userDocRef = doc(db, "users", firebaseUser.uid);
      const userDocSnap = await getDoc(userDocRef);
      
      let userName = name || firebaseUser.displayName || email.split('@')[0];
      let avatar = firebaseUser.photoURL || getDefaultAvatar(role);
      let school = 'CampusConnect Academy';

      if (userDocSnap.exists()) {
        const existingData = userDocSnap.data();
        userName = name || existingData.name || userName; // Prioritize passed name, then existing, then default
        avatar = existingData.avatarUrl || avatar;
        school = existingData.school || school;
      }
      
      const userProfileData = {
        email: firebaseUser.email,
        name: userName,
        role: role, 
        avatarUrl: avatar,
        school: school,
        lastLogin: serverTimestamp(),
      };
      if (!userDocSnap.exists()) {
        (userProfileData as any).createdAt = serverTimestamp();
      }

      await setDoc(userDocRef, userProfileData, { merge: true });
      // onAuthStateChanged will handle setting user state.
      
    } catch (error) {
      console.error("Error logging in:", error);
      setIsLoading(false);
      throw error; 
    }
  };
  
  // Function for UserRoleSwitcher to update profile (primarily role)
  const login = async (role: UserRole, name?: string) => {
    if (!auth.currentUser) {
      console.warn("Cannot switch role: no user logged in.");
      throw new Error("User not authenticated.");
    }
    if (isLoading) return;

    setIsLoading(true);
    try {
      const firebaseUser = auth.currentUser;
      const userDocRef = doc(db, "users", firebaseUser.uid);
      
      // Preserve existing details unless new ones are provided
      const currentProfile = user; // Get current local profile state
      let userName = name || currentProfile?.name || firebaseUser.displayName || (firebaseUser.email ? firebaseUser.email.split('@')[0] : 'User');
      let avatar = currentProfile?.avatarUrl || firebaseUser.photoURL || getDefaultAvatar(role);
      let currentSchool = currentProfile?.school || 'CampusConnect Academy';

      const userProfileDataToUpdate = {
        name: userName,
        role: role, // Update role
        avatarUrl: avatar, // Update avatar if necessary based on new role default
        school: currentSchool,
        updatedAt: serverTimestamp(),
      };

      await setDoc(userDocRef, userProfileDataToUpdate, { merge: true });
      
      // Optimistically update local state while onAuthStateChanged eventually syncs
      setUserState(prev => prev ? { 
          ...prev, 
          role, 
          name: userName, 
          avatarUrl: avatar // Update avatarUrl in local state as well
      } : null);

    } catch (error) {
      console.error("Error updating role:", error);
      throw error; // Re-throw for UserRoleSwitcher to handle
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error logging out:", error);
      setIsLoading(false); 
    }
  };

  return (
    <UserContext.Provider value={{ user, isLoading, loginWithEmail, logout, login }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
