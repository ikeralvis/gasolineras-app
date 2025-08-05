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
    // Comprueba si el navegador soporta la API de geolocalización
    if (!navigator.geolocation) {
      setError("La geolocalización no es soportada por tu navegador.");
      setIsLoading(false);
      return;
    }

    // Función de éxito: se llama cuando la ubicación se obtiene correctamente
    const handleSuccess = (position) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
      setError(null); // Limpia cualquier error previo
      setIsLoading(false);
    };

    // Función de error: se llama si hay un problema al obtener la ubicación
    const handleError = (geoError) => {
      switch (geoError.code) {
        case geoError.PERMISSION_DENIED:
          setError("Permiso de geolocalización denegado. Por favor, habilita la ubicación en tu navegador para usar esta función.");
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

    // Opciones para la geolocalización
    const options = {
      enableHighAccuracy: true, // Solicita la mejor precisión posible
      timeout: 10000,            // Tiempo máximo para obtener la ubicación (10 segundos)
      maximumAge: 0             // No usar una posición en caché, obtener una nueva
    };

    setIsLoading(true);
    // Inicia la observación de la posición. watchPosition es mejor para apps en tiempo real
    // ya que actualiza la posición si el usuario se mueve.
    const watchId = navigator.geolocation.watchPosition(handleSuccess, handleError, options);

    // Limpiar el "watcher" cuando el componente se desmonte para evitar fugas de memoria
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []); // El array de dependencias vacío asegura que se ejecute solo una vez al montar el componente

  return { latitude, longitude, error, isLoading };
};

export default useGeolocation;