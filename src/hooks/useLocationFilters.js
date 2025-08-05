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
 */
function LocationFilters({
  selectedCommunity,
  onCommunityChange,
  selectedMunicipality,
  onMunicipalityChange,
  uniqueCommunities,
  uniqueMunicipalities,
}) {
  console.log("LocationFilters: Prop uniqueCommunities recibida:", uniqueCommunities);
  console.log("LocationFilters: Prop uniqueMunicipalities recibida:", uniqueMunicipalities);

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

      {/* Selector de Municipio */}
      <div>
        <label htmlFor="municipality" className="block text-sm font-medium text-gray-700 mb-1">
          Municipio:
        </label>
        <select
          id="municipality"
          value={selectedMunicipality}
          onChange={onMunicipalityChange}
          disabled={!selectedCommunity}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm disabled:bg-gray-50 disabled:cursor-not-allowed text-gray-900"
        >
          <option value="">Todos</option>
          {uniqueMunicipalities.length === 0 && selectedCommunity ? (
            <option disabled>Cargando Municipios...</option>
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