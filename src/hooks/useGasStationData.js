// src/hooks/useGasStationData.js
import { useState, useEffect } from 'react';
import { openDB } from 'idb';

const DB_NAME = 'gasolinerasDB';
const STORE_NAME = 'gasolinerasStore';
const CACHE_TTL_MS = 60 * 60 * 1000; // 60 minutos

const initDB = async () => {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            db.createObjectStore(STORE_NAME);
        },
    });
};

const useGasStationData = () => {
    const [gasStations, setGasStations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let db;
        let isMounted = true;

        const fetchGasStations = async () => {
            if (!isMounted) return;
            setLoading(true);
            setError(null);

            try {
                db = await initDB();
                const cachedData = await db.get(STORE_NAME, 'data');
                
                if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL_MS) {
                    console.log('Cargando datos desde la caché de IndexedDB.');
                    setGasStations(cachedData.data);
                    setLoading(false);
                    return;
                }

                console.log('Caché expirada o no encontrada. Buscando nuevos datos...');
                await fetchFromAPI(db);

            } catch (e) {
                console.error('Error al acceder a IndexedDB. Intentando directamente con la API:', e);
                await fetchFromAPI(null);
            } finally {
                if (db) {
                    db.close();
                }
            }
        };

        const fetchFromAPI = async (dbInstance) => {
            if (!isMounted) return;
            try {
                const API_URL = 'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/';
                const response = await fetch(API_URL);

                if (!response.ok) {
                    throw new Error(`Error HTTP! Estado: ${response.status}`);
                }
                
                const data = await response.json();

                if (!data || !Array.isArray(data.ListaEESSPrecio)) {
                    throw new Error("La estructura de datos de la API es inesperada.");
                }

                const fetchedStations = data.ListaEESSPrecio;
                
                if (dbInstance) {
                    await dbInstance.put(STORE_NAME, {
                        data: fetchedStations,
                        timestamp: Date.now(),
                    }, 'data');
                    console.log('Datos de la API guardados en IndexedDB.');
                }
                
                setGasStations(fetchedStations);
            } catch (e) {
                setError(`No se pudieron cargar los datos: ${e.message}.`);
                console.error('Error al cargar datos de la API:', e);
            } finally {
                setLoading(false);
            }
        };

        fetchGasStations();

        return () => {
            isMounted = false;
        };
    }, []);

    return { gasStations, loading, error };
};

export default useGasStationData;