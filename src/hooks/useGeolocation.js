// src/hooks/useGeolocation.js
import { useState, useEffect } from 'react';

/**
 * Custom hook para obtener la ubicación actual del usuario (latitud y longitud).
 * @returns {object} Un objeto con latitude, longitude, error (si lo hay) y isLoading.
 */
const useGeolocation = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("La geolocalización no es soportada por tu navegador.");
      setIsLoading(false);
      return;
    }

    const handleSuccess = (position) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
      setError(null);
      setIsLoading(false);
    };

    const handleError = (geoError) => {
      switch (geoError.code) {
        case geoError.PERMISSION_DENIED:
          setError("Permiso de geolocalización denegado. La búsqueda por distancia no estará disponible.");
          break;
        case geoError.POSITION_UNAVAILABLE:
          setError("Información de ubicación no disponible.");
          break;
        case geoError.TIMEOUT:
          setError("La solicitud para obtener la ubicación ha expirado.");
          break;
        default:
          setError("Ha ocurrido un error desconocido al obtener la ubicación.");
          break;
      }
      setIsLoading(false);
    };

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    setIsLoading(true);
    const watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, options);

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return { latitude, longitude, error, isLoading };
};

export default useGeolocation;