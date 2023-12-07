import { useContext, createContext, useState, useEffect } from "react";
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
} from "@firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc, onSnapshot, setDoc, Timestamp } from "firebase/firestore";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);
  const googleSignIn = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then(async (user) => {
      console.log("userdata", user);
      const userRef = doc(db, "users", user?.user.uid);
      const firestoreUser = await getDoc(userRef);

      if (!firestoreUser.data()) {
        await setDoc(userRef, {
          name: user?.user.displayName || "",
          email: user?.user.email,
          rentedBooks: [],
          fbUid: user?.user.uid,
          userImage: user?.user.photoURL,
        });
      }
    });
  };

  console.log(user);

  const logOut = () => {
    signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);

      if (currentUser?.uid) {
        const userDocRef = doc(db, "users", currentUser.uid);
        const unsubscribeFirestore = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            setUser(doc.data());
          } else {
            setUser(null);
            logOut();
          }
          setLoading(false);
        });

        return () => {
          unsubscribeFirestore();
        };
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, googleSignIn, logOut }}>
      {loading ? <p>loading</p> : children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
