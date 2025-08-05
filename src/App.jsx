// src/App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import useGasStationData from './hooks/useGasStationData';
import useDebounce from './hooks/useDebounce';
import useGeolocation from './hooks/useGeolocation';

// Importamos los componentes
import Header from './components/Header';
import FuelFilter from './components/FuelFilter';
import LocationFilters from './components/LocationFilters';
import ProximityFilter from './components/ProximityFilter';
import AveragePriceDisplay from './components/AveragePriceDisplay';
import GasStationList from './components/GasStationList';
import FilterControls from './components/FilterControls';
import Modal from './components/Modal';

function App() {
  // Datos de gasolineras y estado de carga/error de la API
  const { gasStations, loading: apiLoading, error: apiError, uniqueCommunities } = useGasStationData();

  // Geolocalización del usuario
  const { latitude, longitude, error: geoError, isLoading: geoLoading } = useGeolocation();

  // Estados locales para los filtros
  const [selectedFuel, setSelectedFuel] = useState('Precio Gasolina 95 E5');
  const [selectedCommunity, setSelectedCommunity] = useState('');
  const [selectedMunicipality, setSelectedMunicipality] = useState('');
  const [distanceKm, setDistanceKm] = useState(10);
  const debouncedDistanceKm = useDebounce(distanceKm, 500);
  const [companyFilter, setCompanyFilter] = useState('');
  const debouncedCompanyFilter = useDebounce(companyFilter, 300);

  // uniqueMunicipalities es un estado LOCAL de App.jsx, depende de selectedCommunity
  const [uniqueMunicipalities, setUniqueMunicipalities] = useState([]);

  // Estados para los resultados (se derivarán de useMemo)
  const [filteredStations, setFilteredStations] = useState([]);
  const [averagePrice, setAveragePrice] = useState(0);

  // Estados para el modal
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  // Combinar estados de carga y error para la UI global
  const loading = apiLoading || geoLoading;
  const error = apiError || geoError;

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
    const R = 6371; // Radio de la Tierra en kilómetros
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

  // Efecto para actualizar los municipios cuando cambia la comunidad autónoma seleccionada
  useEffect(() => {
    console.log("App.jsx useEffect: selectedCommunity cambió a:", selectedCommunity);
    console.log("App.jsx useEffect: gasStations.length:", gasStations.length);

    if (selectedCommunity && gasStations.length > 0) {
      const municipalities = [...new Set(
        gasStations
          .filter(station => station.CCAA === selectedCommunity)
          .map(station => typeof station.Municipio === 'string' ? station.Municipio.trim() : '')
          .filter(Boolean)
      )].sort();
      console.log(`App.jsx useEffect: Municipios encontrados para ${selectedCommunity}:`, municipalities);
      setUniqueMunicipalities(municipalities);
      setSelectedMunicipality('');
    } else {
      console.log("App.jsx useEffect: Reiniciando municipios (no hay comunidad seleccionada o datos).");
      setUniqueMunicipalities([]);
      setSelectedMunicipality('');
    }
  }, [selectedCommunity, gasStations]); // Dependencias correctas para este efecto

  // Optimizaciones con useMemo para el filtrado y cálculo de precios
  const processedStations = React.useMemo(() => {
    console.log("App.jsx useMemo: Recalculando estaciones filtradas...");
    if (loading || gasStations.length === 0) {
      console.log("App.jsx useMemo: Saltando cálculo, cargando o sin datos.");
      return [];
    }

    let currentFilteredStations = gasStations;

    if (selectedCommunity) {
      currentFilteredStations = currentFilteredStations.filter(
        station => station.CCAA === selectedCommunity
      );
    }

    if (selectedMunicipality) {
      currentFilteredStations = currentFilteredStations.filter(
        station => station.Municipio === selectedMunicipality
      );
    }

    if (debouncedCompanyFilter) {
      const filterText = debouncedCompanyFilter.toLowerCase();
      currentFilteredStations = currentFilteredStations.filter(
        station => station.Rótulo && station.Rótulo.toLowerCase().includes(filterText)
      );
    }

    if (latitude !== null && longitude !== null) {
      currentFilteredStations = currentFilteredStations.filter(station => {
        const stationLat = cleanPrice(station['Latitud'].replace(',', '.'));
        const stationLon = cleanPrice(station['Longitud (WGS84)'].replace(',', '.'));
        
        if (isNaN(stationLat) || isNaN(stationLon)) return false;

        const dist = calculateDistance(latitude, longitude, stationLat, stationLon);
        return dist <= debouncedDistanceKm;
      });
    } else if (geoError) {
        // Si hay un error de geolocalización, no se aplica el filtro de distancia
        // El error ya se muestra en la UI.
    }

    const sortedStations = currentFilteredStations
      .filter(station => cleanPrice(station[selectedFuel]) > 0)
      .sort((a, b) => {
        const priceA = cleanPrice(a[selectedFuel]);
        const priceB = cleanPrice(b[selectedFuel]);
        return priceA - priceB;
      });

    console.log("App.jsx useMemo: Estaciones filtradas y ordenadas:", sortedStations.length);
    return sortedStations;
  }, [
    gasStations,
    selectedFuel,
    selectedCommunity,
    selectedMunicipality,
    latitude,
    longitude,
    debouncedDistanceKm,
    debouncedCompanyFilter,
    loading,
    geoError
  ]);

  const calculatedAveragePrice = React.useMemo(() => {
    console.log("App.jsx useMemo: Recalculando precio medio...");
    if (processedStations.length === 0) return 0;
    const prices = processedStations
      .map(station => cleanPrice(station[selectedFuel]))
      .filter(price => price > 0);

    const total = prices.reduce((sum, price) => sum + price, 0);
    return prices.length > 0 ? (total / prices.length).toFixed(3) : 0;
  }, [processedStations, selectedFuel]);

  useEffect(() => {
    setFilteredStations(processedStations);
    setAveragePrice(calculatedAveragePrice);
  }, [processedStations, calculatedAveragePrice]);


  const handleFuelChange = (e) => setSelectedFuel(e.target.value);
  const handleCommunityChange = (e) => {
    console.log("App.jsx handleCommunityChange: Nueva comunidad seleccionada:", e.target.value);
    setSelectedCommunity(e.target.value);
  };
  const handleMunicipalityChange = (e) => setSelectedMunicipality(e.target.value);
  const handleDistanceChange = (e) => setDistanceKm(parseFloat(e.target.value));
  const handleCompanyFilterChange = (e) => setCompanyFilter(e.target.value);

  // Logs para depuración: ver qué comunidades/municipios se están pasando a LocationFilters
  console.log("App.jsx: uniqueCommunities pasadas a LocationFilters (desde hook):", uniqueCommunities);
  console.log("App.jsx: uniqueMunicipalities locales pasadas a LocationFilters (desde estado local):", uniqueMunicipalities);


  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 font-inter p-4">
        <div className="text-xl font-semibold text-blue-700 animate-pulse mb-4">Cargando datos de gasolineras...</div>
        {geoLoading && (
            <p className="text-gray-600">Obteniendo tu ubicación...</p>
        )}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen w-full bg-red-100 text-red-700 p-4 rounded-lg font-inter">
        <p className="text-lg font-semibold mb-4 text-center">{error}</p>
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

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Filtros de Búsqueda</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <FuelFilter
            selectedFuel={selectedFuel}
            onFuelChange={handleFuelChange}
          />

          <LocationFilters
            selectedCommunity={selectedCommunity}
            onCommunityChange={handleCommunityChange}
            selectedMunicipality={selectedMunicipality}
            onMunicipalityChange={handleMunicipalityChange}
            uniqueCommunities={uniqueCommunities}
            uniqueMunicipalities={uniqueMunicipalities}
          />

          <div>
            <label htmlFor="company-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Marca/Empresa:
            </label>
            <input
              type="text"
              id="company-filter"
              value={companyFilter}
              onChange={handleCompanyFilterChange}
              placeholder="Ej: Repsol, Cepsa"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tu Ubicación Actual:
            </label>
            <p className="text-gray-900 text-base">
              {latitude !== null && longitude !== null
                ? `Lat: ${latitude.toFixed(6)}, Lon: ${longitude.toFixed(6)}`
                : 'Obteniendo ubicación...'}
            </p>
            {geoError && (
                <p className="text-red-500 text-xs mt-1">{geoError}</p>
            )}
          </div>

          <div>
            <label htmlFor="distance-km" className="block text-sm font-medium text-gray-700 mb-1">
              Distancia máxima (Km):
            </label>
            <input
              type="number"
              id="distance-km"
              value={distanceKm}
              onChange={handleDistanceChange}
              min="1"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Resultados</h2>

        {filteredStations.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-lg font-semibold text-blue-800">
              Precio medio de {selectedFuel.replace('Precio ', '')}:{' '}
              <span className="text-blue-600">{averagePrice} €/litro</span>
            </p>
            {latitude !== null && longitude !== null && (
              <p className="text-sm text-blue-700 mt-1">
                (Calculado para estaciones dentro de {debouncedDistanceKm} km de tu ubicación)
              </p>
            )}
          </div>
        )}

        {filteredStations.length === 0 ? (
          <p className="text-gray-600 text-center py-8">
            No se encontraron gasolineras con los filtros seleccionados o dentro de la distancia especificada.
            Intenta ajustar los filtros o la ubicación.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">
                    Gasolinera
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dirección
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Municipio
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Provincia
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Distancia (Km)
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">
                    Precio (€/L)
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredStations.map((station, index) => (
                  <tr key={station.IDEESS + '-' + index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-3 py-4 text-sm font-medium text-gray-900">
                      {station.Rótulo}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-700">
                      {station.Dirección}, {station.Localidad}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-700">
                      {station.Municipio}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-700">
                      {station.Provincia}
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-700">
                      {latitude !== null && longitude !== null
                        ? calculateDistance(
                            latitude,
                            longitude,
                            cleanPrice(station['Latitud'].replace(',', '.')),
                            cleanPrice(station['Longitud (WGS84)'].replace(',', '.'))
                          ).toFixed(2) + ' km'
                        : 'N/A'}
                    </td>
                    <td className="px-3 py-4 text-sm font-bold text-green-700">
                      {cleanPrice(station[selectedFuel]).toFixed(3)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

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