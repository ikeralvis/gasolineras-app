import React, { createContext, useContext, useEffect, useState } from 'react';
// La ruta ahora apunta al nombre correcto del archivo.
import { auth, db } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [vehicleType, setVehicleType] = useState(null);

    // Función para obtener la referencia al documento de preferencias del usuario
    const getUserDocRef = (userId) => {
        return doc(db, 'users', userId, 'preferences', 'vehicle');
    };

    /**
     * Función para actualizar el tipo de combustible del usuario en Firestore y en el estado local.
     */
    const updateUserVehicleType = async (newVehicleType) => {
        if (!currentUser) {
            console.error("No hay un usuario autenticado para actualizar el perfil.");
            return;
        }
        const userDocRef = getUserDocRef(currentUser.uid);
        try {
            await setDoc(userDocRef, { vehicleType: newVehicleType }, { merge: true });
            setVehicleType(newVehicleType);
            console.log("Tipo de vehículo actualizado en Firestore.");
        } catch (error) {
            console.error("Error al actualizar el tipo de vehículo:", error);
        }
    };

    useEffect(() => {
        // Variable para almacenar la función de desuscripción de onSnapshot
        let unsubscribeSnapshot = () => {};

        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);

            // Siempre limpia el listener de onSnapshot antes de establecer uno nuevo
            unsubscribeSnapshot();

            if (user) {
                const userDocRef = getUserDocRef(user.uid);

                // Usamos onSnapshot para escuchar cambios en tiempo real en el perfil del usuario
                unsubscribeSnapshot = onSnapshot(userDocRef, (docSnap) => {
                    if (docSnap.exists() && docSnap.data().vehicleType) {
                        setVehicleType(docSnap.data().vehicleType);
                        console.log("Tipo de vehículo cargado desde Firestore:", docSnap.data().vehicleType);
                    } else {
                        setVehicleType(null);
                        console.log("No se encontró un tipo de vehículo en Firestore.");
                    }
                }, (error) => {
                    console.error("Error al escuchar cambios en el perfil del usuario:", error);
                });
            } else {
                // Si no hay usuario, limpia el tipo de vehículo
                setVehicleType(null);
            }
        });

        // Esta es la única función de limpieza que debe devolver el useEffect
        return () => {
            unsubscribeAuth();
            unsubscribeSnapshot();
        };
    }, []);

    const value = {
        currentUser,
        loading,
        vehicleType,
        updateUserVehicleType,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
