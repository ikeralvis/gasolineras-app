import React, { createContext, useContext, useEffect, useState } from 'react';
// La ruta ahora apunta al nombre correcto del archivo.
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Este listener se ejecuta cuando el estado de autenticación cambia.
    // Esto es crucial para saber si el usuario ha iniciado o cerrado sesión.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // Esta función de limpieza se ejecuta cuando el componente se desmonta,
    // para evitar fugas de memoria.
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
