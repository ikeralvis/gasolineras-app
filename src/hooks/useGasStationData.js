// src/hooks/useGasStationData.js
import { useState, useEffect } from 'react';
import { openDB } from 'idb'; // Importamos la librería idb

// Configuración de la base de datos y la caché
const DB_NAME = 'gasolinerasDB';
const STORE_NAME = 'gasolinerasStore';
const CACHE_TTL_MS = 60 * 60 * 1000; // 60 minutos en milisegundos

// Función para inicializar la base de datos IndexedDB
const initDB = async () => {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      // Creamos un "almacén de objetos" (como una tabla) si no existe
      db.createObjectStore(STORE_NAME);
    },
  });
};

const useGasStationData = () => {
  const [gasStations, setGasStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGasStations = async () => {
      setLoading(true);
      setError(null);
      let db;

      try {
        // 1. Abrir la base de datos IndexedDB
        db = await initDB();
        
        // 2. Intentar obtener los datos de la caché
        const cachedData = await db.get(STORE_NAME, 'data');
        
        if (cachedData && Date.now() - cachedData.timestamp < CACHE_TTL_MS) {
          console.log('Cargando datos desde la caché de IndexedDB...');
          setGasStations(cachedData.data);
          setLoading(false);
          return; // Salimos, no se necesita la petición a la API
        } else {
          if (cachedData) {
            console.log('Caché de IndexedDB expirada. Buscando nuevos datos...');
          }
        }
      } catch (e) {
        console.error('Error al acceder a IndexedDB:', e);
        // Si hay un error con IndexedDB, simplemente seguimos y hacemos la petición a la API
      }

      // 3. Si la caché no existe o está expirada, hacemos la petición a la API
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

        // 4. Guardamos los nuevos datos en IndexedDB
        if (db) {
          await db.put(STORE_NAME, {
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
        if (db) {
          db.close();
        }
      }
    };

    fetchGasStations();
  }, []);

  return { gasStations, loading, error };
};

export default useGasStationData;