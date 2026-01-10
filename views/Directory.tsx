
import React, { useState, useEffect } from 'react';
import MapComponent, { Place } from '../components/MapComponent';

const Directory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Hospitales');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [selectedPlaceName, setSelectedPlaceName] = useState<string | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);

  // Use env var or fallback
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  const categories = ['Hospitales', 'Farmacias', 'Pediatras', 'Urgencias'];

  useEffect(() => {
    handleGetLocation();
  }, []);

  const handleGetLocation = () => {
    setIsLocating(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError('Tu navegador no soporta geolocalización');
      setIsLocating(false);
      // Fallback to Mexico City center
      setUserLocation({ lat: 19.4326, lng: -99.1332 });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLocating(false);
      },
      (error) => {
        console.error('Geolocation error:', error);
        let errorMsg = 'No se pudo obtener tu ubicación';
        if (error.code === 1) errorMsg = 'Permiso de ubicación denegado';
        if (error.code === 2) errorMsg = 'Ubicación no disponible';
        if (error.code === 3) errorMsg = 'Tiempo de espera agotado';

        // Fallback to Mexico City if location fails
        setUserLocation({ lat: 19.4326, lng: -99.1332 });
        setLocationError(errorMsg);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const handlePlacesFound = (foundPlaces: Place[]) => {
    setPlaces(foundPlaces);
    setIsLoadingPlaces(false);
  };

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    setSearchQuery(category);
    setSelectedPlaceName(null);
    setIsLoadingPlaces(true);
    // The MapComponent handles the search automatically when activeCategory changes
  };

  const filteredPlaces = places.filter(
    p => searchQuery === '' || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.includes(searchQuery)
  );

  return (
    <main className="flex flex-col lg:flex-row h-screen overflow-hidden bg-background-light dark:bg-background-dark">
      {/* Left Column: Search and List */}
      <div className="w-full lg:w-[450px] xl:w-[500px] h-full flex flex-col bg-white dark:bg-surface-dark shadow-xl z-20 border-r border-gray-100 dark:border-gray-800">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-black text-text-main dark:text-white tracking-tight">
              Directorio
            </h1>
            <button
              onClick={handleGetLocation}
              disabled={isLocating}
              className={`p-2 rounded-xl border flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all ${userLocation && !locationError
                  ? 'bg-primary/10 border-primary text-primary'
                  : locationError
                    ? 'bg-red-50 border-red-300 text-red-500'
                    : 'bg-gray-50 border-gray-200 text-gray-400'
                }`}
            >
              <span className={`material-symbols-outlined text-sm ${isLocating ? 'animate-spin' : ''}`}>
                {isLocating ? 'progress_activity' : userLocation ? 'my_location' : 'location_searching'}
              </span>
              {isLocating ? 'Buscando...' : userLocation ? 'GPS Activo' : 'Activar GPS'}
            </button>
          </div>

          {locationError && (
            <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-700 dark:text-amber-300 text-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">warning</span>
              <span>{locationError}. Mostrando centro de CDMX.</span>
            </div>
          )}

          <div className="relative group mb-4">
            <span className="material-symbols-outlined absolute left-4 top-3.5 text-gray-400">
              search
            </span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-background-dark border-none rounded-xl text-sm focus:ring-2 focus:ring-primary transition-all shadow-inner"
              placeholder="Buscar en resultados..."
              type="text"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(cat)}
                className={`px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-tighter transition-colors whitespace-nowrap ${activeCategory === cat
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary hover:text-primary bg-white dark:bg-surface-dark'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          <div className="flex justify-between items-center mb-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Cerca de ti ({filteredPlaces.length})
            </p>
            {isLoadingPlaces && (
              <span className="flex items-center gap-1 text-[10px] text-primary font-bold animate-pulse">
                <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                Actualizando...
              </span>
            )}
          </div>

          {filteredPlaces.map((place, idx) => (
            <article
              key={`${place.place_id}-${idx}`}
              onClick={() => setSelectedPlaceName(place.name)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer group ${selectedPlaceName === place.name
                  ? 'bg-primary/5 border-primary ring-1 ring-primary/20'
                  : 'bg-white dark:bg-surface-dark border-gray-100 dark:border-gray-700 hover:border-primary/40'
                }`}
            >
              <div className="flex justify-between items-start gap-3">
                <div className="flex-1">
                  <h3 className="font-bold text-text-main dark:text-white group-hover:text-primary transition-colors text-sm line-clamp-1">
                    {place.name}
                  </h3>
                  <div className="flex flex-col gap-1 mt-1">
                    <p className="text-[10px] text-gray-500 truncate">{place.address}</p>

                    <div className="flex items-center gap-2">
                      {place.rating && (
                        <span className="flex items-center text-[10px] font-bold text-amber-500">
                          <span className="material-symbols-outlined text-[10px] mr-0.5 icon-filled">star</span>
                          {place.rating}
                        </span>
                      )}
                      {place.isOpen !== undefined && (
                        <span className={`text-[9px] font-bold ${place.isOpen ? 'text-green-600' : 'text-red-500'}`}>
                          {place.isOpen ? 'Abierto' : 'Cerrado'}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <span className={`material-symbols-outlined transition-colors ${selectedPlaceName === place.name ? 'text-primary' : 'text-gray-300'}`}>
                  {selectedPlaceName === place.name ? 'location_on' : 'chevron_right'}
                </span>
              </div>
            </article>
          ))}

          {filteredPlaces.length === 0 && !isLoadingPlaces && (
            <div className="text-center py-10 opacity-50 flex flex-col items-center">
              <span className="material-symbols-outlined text-4xl mb-2">location_off</span>
              <p className="text-sm font-bold">No se encontraron lugares.</p>
              {(!userLocation || locationError) && (
                <p className="text-xs max-w-[200px] mt-2">Asegúrate de permitir la ubicación o mueve el mapa.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Interactive Map */}
      <div id="map-container" className="flex-1 h-full relative bg-gray-100">
        {!apiKey ? (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 dark:bg-background-dark p-6 text-center">
            <span className="material-symbols-outlined text-6xl mb-4 text-amber-500">warning</span>
            <h2 className="text-xl font-bold mb-2">Falta API Key de Google Maps</h2>
            <p className="text-sm text-gray-500 max-w-md">
              Configura <code>VITE_GOOGLE_MAPS_API_KEY</code> para ver resultados en tiempo real.
            </p>
          </div>
        ) : (
          <MapComponent
            apiKey={apiKey}
            userLocation={userLocation}
            activeCategory={activeCategory} // Pass category to trigger search
            selectedPlaceName={selectedPlaceName}
            onPlaceSelect={setSelectedPlaceName}
            onPlacesFound={handlePlacesFound}
          />
        )}

        {/* Floating Controls */}
        <div className="absolute top-6 left-6 lg:left-auto lg:right-6 lg:w-auto bg-white/95 dark:bg-surface-dark/95 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/20 z-30 pointer-events-none">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-sm icon-filled">my_location</span>
            <span className="text-[10px] font-bold text-gray-500 uppercase">
              {userLocation ? 'Ubicación Exacta' : 'Ubicación Aproximada'}
            </span>
          </div>
        </div>

        <button
          onClick={handleGetLocation}
          disabled={isLocating}
          className="absolute bottom-24 right-6 size-12 bg-white dark:bg-surface-dark text-gray-700 dark:text-white rounded-xl shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-30 disabled:opacity-50 border border-gray-100 dark:border-gray-700"
          title="Centrar en mi ubicación"
        >
          <span className={`material-symbols-outlined ${isLocating ? 'animate-spin' : ''}`}>
            {isLocating ? 'progress_activity' : 'my_location'}
          </span>
        </button>
      </div>
    </main>
  );
};

export default Directory;
