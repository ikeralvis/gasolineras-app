// src/components/LocationFilters.jsx
import React from 'react';

/**
 * Componente para filtrar por Comunidad Autónoma y Municipio.
 * @param {object} props - Las props del componente.
 * @param {string} props.selectedCommunity - La Comunidad Autónoma actualmente seleccionada.
 * @param {function} props.onCommunityChange - Función a llamar cuando cambia la selección de Comunidad Autónoma.
 * @param {string} props.selectedMunicipality - El Municipio actualmente seleccionado.
 * @param {function} props.onMunicipalityChange - Función a llamar cuando cambia la selección de Municipio.
 * @param {Array<string>} props.uniqueCommunities - Lista de Comunidades Autónomas únicas.
 * @param {Array<string>} props.uniqueMunicipalities - Lista de Municipios únicos para la Comunidad Autónoma seleccionada.
 * @param {string} props.municipalitySearch - Valor de búsqueda para el municipio.
 * @param {function} props.onMunicipalitySearchChange - Función para actualizar el valor de búsqueda.
 */
function LocationFilters({
  selectedCommunity,
  onCommunityChange,
  selectedMunicipality,
  onMunicipalityChange,
  uniqueCommunities,
  uniqueMunicipalities,
  municipalitySearch,
  onMunicipalitySearchChange
}) {
  return (
    <>
      {/* Selector de Comunidad Autónoma */}
      <div>
        <label htmlFor="community" className="block text-sm font-medium text-gray-700 mb-1">
          Comunidad Autónoma:
        </label>
        <select
          id="community"
          value={selectedCommunity}
          onChange={onCommunityChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm text-gray-900"
        >
          <option value="">Todas</option>
          {uniqueCommunities.length === 0 ? (
            <option disabled>Cargando Comunidades...</option>
          ) : (
            uniqueCommunities.map(community => (
              <option key={community} value={community}>{community}</option>
            ))
          )}
        </select>
      </div>

      {/* Buscador y Selector de Municipio */}
      <div>
        <label htmlFor="municipality-search" className="block text-sm font-medium text-gray-700 mb-1">
          Buscar Municipio:
        </label>
        <input
          type="text"
          id="municipality-search"
          value={municipalitySearch}
          onChange={onMunicipalitySearchChange}
          placeholder="Ej: Bilbao"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm text-gray-900"
        />
        <select
          id="municipality"
          value={selectedMunicipality}
          onChange={onMunicipalityChange}
          className="mt-2 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm text-gray-900"
          disabled={!selectedCommunity && !municipalitySearch}
        >
          <option value="">Selecciona un municipio</option>
          {uniqueMunicipalities.length === 0 ? (
            <option disabled>No se encontraron municipios</option>
          ) : (
            uniqueMunicipalities.map(municipality => (
              <option key={municipality} value={municipality}>{municipality}</option>
            ))
          )}
        </select>
      </div>
    </>
  );
}

export default LocationFilters;