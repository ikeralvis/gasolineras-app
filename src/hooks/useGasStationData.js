// src/hooks/useGasStationData.js
import { useState, useEffect } from 'react';

/**
 * Custom hook para cargar los datos de las gasolineras desde la API del Ministerio.
 * Maneja el estado de carga, error y los datos de las gasolineras.
 * También extrae listas únicas de comunidades.
 * @returns {object} Un objeto con gasStations, loading, error, uniqueCommunities.
 */
const useGasStationData = () => {
  const [gasStations, setGasStations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uniqueCommunities, setUniqueCommunities] = useState([]);

  useEffect(() => {
    const fetchGasStations = async () => {
      try {
        setLoading(true);
        setError(null);

        const API_URL = 'https://sedeaplicaciones.minetur.gob.es/ServiciosRESTCarburantes/PreciosCarburantes/EstacionesTerrestres/';
        
        console.log("useGasStationData: Iniciando fetch a:", API_URL);
        const response = await fetch(API_URL);
        
        if (!response.ok) {
          throw new Error(`Error HTTP! Estado: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("useGasStationData: Datos crudos de la API recibidos:", data); // ¡IMPORTANTE! Revisa esto en la consola

        // Verificar si 'ListaEESSPrecio' existe y es un array
        if (!data || !Array.isArray(data.ListaEESSPrecio)) {
          console.error("useGasStationData: La estructura de datos de la API es inesperada. 'ListaEESSPrecio' no es un array o no existe.");
          throw new Error("La estructura de datos de la API es inesperada. Por favor, contacta al soporte.");
        }

        const fetchedStations = data.ListaEESSPrecio;
        setGasStations(fetchedStations);
        console.log("useGasStationData: Número de estaciones obtenidas:", fetchedStations.length);
        console.log("useGasStationData: Primeras 5 estaciones:", fetchedStations.slice(0, 5));
        console.log("useGasStationData: CCAA de las primeras 5 estaciones:", fetchedStations.slice(0, 5).map(s => s.CCAA));

        // Extraer comunidades autónomas únicas:
        // 1. Mapear para obtener solo la propiedad 'CCAA'
        // 2. Asegurarse de que sea un string y limpiar espacios
        // 3. Filtrar cualquier valor que sea vacío, null o undefined
        // 4. Usar un Set para obtener solo valores únicos
        // 5. Convertir a Array y ordenar alfabéticamente
        const communities = [...new Set(
          fetchedStations
            .map(station => typeof station.CCAA === 'string' ? station.CCAA.trim() : '')
            .filter(Boolean) // Esto filtra cadenas vacías, null, undefined
        )].sort();
        
        console.log("useGasStationData: Comunidades únicas procesadas y ordenadas:", communities); // ¡IMPORTANTE! Revisa esto
        setUniqueCommunities(communities);

      } catch (e) {
        console.error("useGasStationData: Error al cargar los datos de las gasolineras:", e);
        setError(`No se pudieron cargar los datos de las gasolineras: ${e.message}. Por favor, inténtalo de nuevo más tarde.`);
      } finally {
        setLoading(false);
      }
    };

    fetchGasStations();
  }, []); // El array de dependencias vacío asegura que se ejecute solo una vez al montar el componente

  // Devolvemos los estados y datos que la App principal necesitará
  return { gasStations, loading, error, uniqueCommunities };
};

export default useGasStationData;