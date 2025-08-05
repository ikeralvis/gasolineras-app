import { useState, useEffect } from 'react';

/**
 * Custom hook para aplicar un "debounce" a un valor.
 * El valor devuelto solo se actualizará después de que haya pasado el 'delay'
 * sin que el 'value' cambie.
 * @param {*} value - El valor a debouncar.
 * @param {number} delay - El tiempo en milisegundos para esperar antes de actualizar el valor.
 * @returns {*} El valor debounced.
 */

function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        }
    } , [value, delay]);
    return debouncedValue;
}

export default useDebounce;