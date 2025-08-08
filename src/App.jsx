// src/App.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import useGasStationData from './hooks/useGasStationData';
import useDebounce from './hooks/useDebounce';
import useGeolocation from './hooks/useGeolocation';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth, db } from './firebaseConfig';
import { useAuth } from './context/AuthContext';
// Importaciones de Firestore
import { doc, setDoc, onSnapshot, updateDoc } from 'firebase/firestore';

// Importamos los componentes
import Header from './components/Header';
import FuelFilter from './components/FuelFilter';
import ProximityFilter from './components/ProximityFilter';
import AveragePriceDisplay from './components/AveragePriceDisplay';
import GasStationList from './components/GasStationList';
import FilterControls from './components/FilterControls';
import FavoriteGasStations from './components/FavoriteGasStations';
import Modal from './components/Modal';
import ClosestGasStation from './components/ClosestGasStation';
import GasStationMap from './components/GasStationMap';
import GasStationDetail from './components/GasStationDetail';
import Login from './components/Login';
import UserProfile from './components/UserProfile'; // Importamos el nuevo componente de perfil

const FILTERS_STORAGE_KEY = 'gasolineraFiltros';

const initializeStateFromLocalStorage = (key, defaultValue) => {
  try {
    const storedValue = localStorage.getItem(key);
    if (storedValue) {
      return JSON.parse(storedValue);
    }
  } catch (e) {
    console.error(`Error al cargar datos de localStorage para la clave ${key}:`, e);
  }
  return defaultValue;
};

const MainContent = React.memo(({
  selectedFuel, onFuelChange, textFilter, onTextFilterChange, distanceKm, onDistanceChange,
  sortBy, onSortChange, onClearFilters, closestStation, favoriteStations, filteredStations,
  cleanPrice, toggleFavorite, favoriteStationIds, onStationClick, latitude, longitude,
  debouncedDistanceKm, geoError, averagePrice, viewMode, setViewMode, gasStations, userLocation,
  calculateDistance, currentUser
}) => {
  const handleToggleView = () => {
    if (viewMode === 'list' && (latitude === null || longitude === null || geoError)) {
      const modalMessage = 'Para ver el mapa, por favor, permite la geolocalización.';
      console.log(modalMessage);
      return;
    }
    setViewMode(prevMode => prevMode === 'list' ? 'map' : 'list');
  };

  return (
    <>
      <div className="max-w-4xl mx-auto container px-4 bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Filtros de Búsqueda</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <FuelFilter
            selectedFuel={selectedFuel}
            onFuelChange={onFuelChange}
          />
          <div>
            <label htmlFor="text-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Buscar (Provincia, Municipio o Marca):
            </label>
            <input
              type="text"
              id="text-filter"
              value={textFilter}
              onChange={onTextFilterChange}
              placeholder="Ej: Bilbao, Repsol"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
            />
          </div>
          <ProximityFilter
            latitude={latitude}
            longitude={longitude}
            geoError={geoError}
            distanceKm={distanceKm}
            onDistanceChange={onDistanceChange}
          />
        </div>
        <FilterControls
          sortBy={sortBy}
          onSortChange={onSortChange}
          onClearFilters={onClearFilters}
        />
      </div>

      <div className="max-w-4xl mx-auto container px-4 bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{viewMode === 'list' ? 'Resultados' : 'Mapa de Gasolineras'}</h2>
          <button
            onClick={handleToggleView}
            className="px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 transition duration-300"
          >
            {viewMode === 'list' ? 'Ver Mapa' : 'Ver Lista'}
          </button>
        </div>
        
        {viewMode === 'list' ? (
          <>
            {closestStation && (
              <ClosestGasStation
                station={closestStation}
                selectedFuel={selectedFuel}
                cleanPrice={cleanPrice}
                distance={closestStation.distance}
                onStationClick={onStationClick}
              />
            )}
            {favoriteStations.length > 0 && (
              <div className="mb-8">
                <FavoriteGasStations
                  stations={favoriteStations}
                  selectedFuel={selectedFuel}
                  cleanPrice={cleanPrice}
                  toggleFavorite={toggleFavorite}
                  favoriteStationIds={favoriteStationIds}
                  onStationClick={onStationClick}
                />
              </div>
            )}
            {filteredStations.length > 0 && (
              <AveragePriceDisplay
                selectedFuelLabel={selectedFuel.replace('Precio ', '')}
                averagePrice={averagePrice}
                distanceKm={debouncedDistanceKm}
                showDistanceInfo={latitude !== null && longitude !== null && !geoError}
              />
            )}
            <GasStationList
              stations={filteredStations}
              selectedFuel={selectedFuel}
              latitude={latitude}
              longitude={longitude}
              cleanPrice={cleanPrice}
              calculateDistance={calculateDistance}
              toggleFavorite={toggleFavorite}
              favoriteStationIds={favoriteStationIds}
              onStationClick={onStationClick}
            />
          </>
        ) : (
          <GasStationMap
            stations={filteredStations}
            latitude={latitude}
            longitude={longitude}
            cleanPrice={cleanPrice}
            selectedFuel={selectedFuel}
            favoriteStationIds={favoriteStationIds}
            userLocation={{ latitude, longitude }} 
          />
        )}
      </div>
    </>
  );
});

function App() {
  const { gasStations, loading: apiLoading, error: apiError } = useGasStationData();
  const { latitude, longitude, error: geoError, isLoading: geoLoading } = useGeolocation();
  const navigate = useNavigate();

  // Obtenemos el usuario y el tipo de vehículo del contexto
  const { currentUser, loading: authLoading, vehicleType } = useAuth();

  // El estado de los filtros se inicializa con el valor del perfil si existe,
  // si no, se usa el de localStorage.
  const [selectedFuel, setSelectedFuel] = useState(() => vehicleType || initializeStateFromLocalStorage(FILTERS_STORAGE_KEY, {}).selectedFuel || 'Precio Gasolina 95 E5');
  const [distanceKm, setDistanceKm] = useState(() => initializeStateFromLocalStorage(FILTERS_STORAGE_KEY, {}).distanceKm || 10);
  const debouncedDistanceKm = useDebounce(distanceKm, 500);
  const [textFilter, setTextFilter] = useState(() => initializeStateFromLocalStorage(FILTERS_STORAGE_KEY, {}).textFilter || '');
  const debouncedTextFilter = useDebounce(textFilter, 300);
  const [sortBy, setSortBy] = useState(() => initializeStateFromLocalStorage(FILTERS_STORAGE_KEY, {}).sortBy || 'price');
  
  // Nuevo estado para los favoritos obtenidos de Firestore
  const [favoriteStationIds, setFavoriteStationIds] = useState(new Set());
  
  const [viewMode, setViewMode] = useState('list');

  const [filteredStations, setFilteredStations] = useState([]);
  const [averagePrice, setAveragePrice] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  
  const loading = apiLoading || geoLoading;
  const appBlockingError = apiError;

  const showMessageBox = (message) => {
    setModalMessage(message);
    setShowModal(true);
  };

  const cleanPrice = (priceString) => {
    if (!priceString) return 0;
    const cleaned = priceString.replace(',', '.');
    return parseFloat(cleaned);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };
  
  // Efecto para escuchar los favoritos del usuario en Firestore
  useEffect(() => {
    // Solo si hay un usuario logueado
    if (currentUser) {
      const docRef = doc(db, "favorites", currentUser.uid);
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const favoritesData = docSnap.data().stations || [];
          setFavoriteStationIds(new Set(favoritesData));
        } else {
          // Si el documento no existe, inicializamos con un array vacío.
          setDoc(docRef, { stations: [] });
          setFavoriteStationIds(new Set());
        }
      });

      // Función de limpieza para cancelar la suscripción
      return () => unsubscribe();
    } else {
      // Si el usuario cierra sesión, limpiamos los favoritos
      setFavoriteStationIds(new Set());
    }
  }, [currentUser]); // Depende del currentUser, se ejecuta al iniciar/cerrar sesión

  // Nuevo useEffect para sincronizar el filtro de combustible con el tipo de vehículo del usuario
  useEffect(() => {
    if (vehicleType) {
      setSelectedFuel(vehicleType);
    }
  }, [vehicleType]);


  useEffect(() => {
    try {
      const filters = {
        selectedFuel,
        distanceKm,
        textFilter,
        sortBy
      };
      localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify(filters));
    } catch (e) {
      console.error("Error al guardar filtros en localStorage:", e);
    }
  }, [selectedFuel, distanceKm, textFilter, sortBy]);
  
  // Función para añadir/eliminar de favoritos en Firestore
  const toggleFavorite = useCallback(async (stationId) => {
    if (!currentUser) {
      showMessageBox("Por favor, inicia sesión para guardar favoritos.");
      return;
    }
    
    const docRef = doc(db, "favorites", currentUser.uid);
    const newIds = new Set(favoriteStationIds);

    if (newIds.has(stationId)) {
      newIds.delete(stationId);
      showMessageBox("Gasolinera eliminada de favoritos.");
    } else {
      newIds.add(stationId);
      showMessageBox("Gasolinera añadida a favoritos.");
    }

    try {
      await updateDoc(docRef, {
        stations: Array.from(newIds)
      });
    } catch (error) {
      console.error("Error al actualizar favoritos:", error);
      showMessageBox("Error al actualizar favoritos en la base de datos.");
    }
  }, [currentUser, favoriteStationIds]);

  const processedStations = useMemo(() => {
    if (apiLoading || gasStations.length === 0) {
      return [];
    }
    let currentFilteredStations = gasStations;
    const filterText = debouncedTextFilter.toLowerCase();
    if (filterText) {
      currentFilteredStations = currentFilteredStations.filter(station => {
        const province = station.Provincia?.toLowerCase() || '';
        const municipality = station.Municipio?.toLowerCase() || '';
        const company = station.Rótulo?.toLowerCase() || '';
        return province.includes(filterText) || municipality.includes(filterText) || company.includes(filterText);
      });
    }
    if (latitude !== null && longitude !== null && !geoError) {
      currentFilteredStations = currentFilteredStations.filter(station => {
        const stationLat = cleanPrice(station['Latitud'].replace(',', '.'));
        const stationLon = cleanPrice(station['Longitud (WGS84)'].replace(',', '.'));
        if (isNaN(stationLat) || isNaN(stationLon)) return false;
        const dist = calculateDistance(latitude, longitude, stationLat, stationLon);
        return dist <= debouncedDistanceKm;
      });
    } else {
      console.log("App.jsx useMemo: No se aplica filtro de distancia (geolocalización no disponible/error).");
    }
    let sortedStations = currentFilteredStations.filter(station => cleanPrice(station[selectedFuel]) > 0);
    sortedStations.sort((a, b) => {
      const priceA = cleanPrice(a[selectedFuel]);
      const priceB = cleanPrice(b[selectedFuel]);
      const distA = latitude !== null && longitude !== null && !geoError
        ? calculateDistance(latitude, longitude, cleanPrice(a['Latitud'].replace(',', '.')), cleanPrice(a['Longitud (WGS84)'].replace(',', '.')))
        : Infinity;
      const distB = latitude !== null && longitude !== null && !geoError
        ? calculateDistance(latitude, longitude, cleanPrice(b['Latitud'].replace(',', '.')), cleanPrice(b['Longitud (WGS84)'].replace(',', '.')))
        : Infinity;
      let result;
      if (sortBy === 'price') {
        result = priceA - priceB;
        if (result === 0) {
          result = distA - distB;
        }
      } else {
        result = distA - distB;
        if (result === 0) {
          result = priceA - priceB;
        }
      }
      return result;
    });
    return sortedStations;
  }, [gasStations, selectedFuel, latitude, longitude, debouncedDistanceKm, debouncedTextFilter, apiLoading, geoError, sortBy]);

  const calculatedAveragePrice = useMemo(() => {
    if (processedStations.length === 0) return 0;
    const prices = processedStations.map(station => cleanPrice(station[selectedFuel])).filter(price => price > 0);
    const total = prices.reduce((sum, price) => sum + price, 0);
    return prices.length > 0 ? (total / prices.length).toFixed(3) : 0;
  }, [processedStations, selectedFuel]);

  const closestStation = useMemo(() => {
    if (processedStations.length === 0 || latitude === null || longitude === null) {
      return null;
    }
    const stationWithDistance = processedStations.map(station => {
      const stationLat = cleanPrice(station['Latitud'].replace(',', '.'));
      const stationLon = cleanPrice(station['Longitud (WGS84)'].replace(',', '.'));
      const dist = calculateDistance(latitude, longitude, stationLat, stationLon);
      return { ...station, distance: dist };
    }).sort((a, b) => a.distance - b.distance);
    return stationWithDistance[0];
  }, [processedStations, latitude, longitude]);

  useEffect(() => {
    setFilteredStations(processedStations);
    setAveragePrice(calculatedAveragePrice);
  }, [processedStations, calculatedAveragePrice]);

  const favoriteStations = useMemo(() => {
    if (!gasStations.length || favoriteStationIds.size === 0) return [];
    return gasStations.filter(station => favoriteStationIds.has(station.IDEESS));
  }, [gasStations, favoriteStationIds]);

  const handleFuelChange = (e) => setSelectedFuel(e.target.value);
  const handleDistanceChange = (e) => setDistanceKm(parseFloat(e.target.value));
  const handleTextFilterChange = (e) => setTextFilter(e.target.value);
  const handleSortChange = (e) => setSortBy(e.target.value);

  const handleClearFilters = () => {
    // Reseteamos el filtro de combustible al valor del perfil del usuario, si existe
    setSelectedFuel(vehicleType || 'Precio Gasolina 95 E5'); 
    setDistanceKm(10);
    setTextFilter('');
    setSortBy('price');
    showMessageBox("Todos los filtros han sido limpiados.");
  };

  const handleOpenDetail = useCallback((station) => {
    navigate(`/gasolinera/${station.IDEESS}`);
  }, [navigate]);

  if (authLoading || apiLoading || geoLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 font-inter p-4">
        <div className="text-xl font-semibold text-blue-700 animate-pulse mb-4">
          {authLoading ? 'Cargando estado de usuario...' : 'Cargando datos de gasolineras...'}
        </div>
        {geoLoading && <p className="text-gray-600">Obteniendo tu ubicación...</p>}
      </div>
    );
  }

  if (appBlockingError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full bg-red-100 text-red-700 p-4 rounded-lg font-inter">
        <p className="text-lg font-semibold mb-4 text-center">{appBlockingError}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 font-inter">
      <Modal isOpen={showModal} message={modalMessage} onClose={() => setShowModal(false)} />
      <Header />
      
      {!currentUser ? (
        <Login />
      ) : (
        <>
          <Routes>
            <Route path="/" element={
              <MainContent
                selectedFuel={selectedFuel} onFuelChange={handleFuelChange}
                textFilter={textFilter} onTextFilterChange={handleTextFilterChange}
                distanceKm={distanceKm} onDistanceChange={handleDistanceChange}
                sortBy={sortBy} onSortChange={handleSortChange}
                onClearFilters={handleClearFilters} closestStation={closestStation}
                favoriteStations={favoriteStations} filteredStations={filteredStations}
                cleanPrice={cleanPrice} toggleFavorite={toggleFavorite}
                favoriteStationIds={favoriteStationIds} onStationClick={handleOpenDetail}
                latitude={latitude} longitude={longitude}
                debouncedDistanceKm={debouncedDistanceKm} geoError={geoError}
                averagePrice={averagePrice}
                calculateDistance={calculateDistance}
                viewMode={viewMode}
                setViewMode={setViewMode}
                currentUser={currentUser}
              />
            } />
            <Route path="/gasolinera/:id" element={
              <GasStationDetail
                gasStations={gasStations}
                cleanPrice={cleanPrice}
                favoriteStationIds={favoriteStationIds}
                toggleFavorite={toggleFavorite}
                calculateDistance={calculateDistance}
              />
            } />
            {/* Nueva ruta para el perfil de usuario */}
            <Route path="/perfil" element={<UserProfile />} />
          </Routes>
        </>
      )}
      
      <footer className="text-center text-gray-500 text-sm mt-8">
        <p>Datos obtenidos del Ministerio para la Transición Ecológica y el Reto Demográfico.</p>
        <p>
          Nota: La funcionalidad de "día más barato de la semana" no es posible con la API actual,
          ya que proporciona datos en tiempo real y no históricos.
        </p>
      </footer>
    </div>
  );
}

export default App;