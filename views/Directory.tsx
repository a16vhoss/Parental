
import React, { useState, useEffect } from 'react';
import MapComponent, { Place } from '../components/MapComponent';

const Directory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Hospitales');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [selectedPlaceName, setSelectedPlaceName] = useState<string | null>(null);

  // Predefined verified locations (Simulated data)
  // In a real app, these would come from the database or Google Places Search
  const verifiedPlaces: Place[] = [
    {
      name: 'Hospital Infantil de México',
      category: 'Hospitales',
      position: { lat: 19.4124, lng: -99.1523 },
      address: 'Dr. Márquez 162, Doctores, CDMX'
    },
    {
      name: 'Hospital Pediátrico de Coyoacán',
      category: 'Hospitales',
      position: { lat: 19.3248, lng: -99.1558 },
      address: 'Moctezuma 18, Del Carmen, Coyoacán, CDMX'
    },
    {
      name: 'Farmacia San Pablo - Roma',
      category: 'Farmacias',
      position: { lat: 19.4192, lng: -99.1627 },
      address: 'Av. Oaxaca 176, Coyoacán, CDMX'
    },
    {
      name: 'Farmacia Guadalajara - Del Valle',
      category: 'Farmacias',
      position: { lat: 19.3879, lng: -99.1685 },
      address: 'Av. Coyoacán 836, Col del Valle Centro, CDMX'
    },
    {
      name: 'Pediatra Dr. López',
      category: 'Pediatras',
      position: { lat: 19.4312, lng: -99.1764 },
      address: 'Av. Horacio 1502, Polanco, CDMX'
    },
    {
      name: 'Cruz Roja Mexicana - Polanco',
      category: 'Urgencias',
      position: { lat: 19.4397, lng: -99.2065 },
      address: 'Juan Luis Vives 200, Los Morales, CDMX'
    },
    {
      name: 'IMSS Hospital General de Zona 1A "Venados"',
      category: 'Urgencias',
      position: { lat: 19.3697, lng: -99.1568 },
      address: 'Municipio Libre 270, Portales Nte, CDMX'
    },
  ];

  const categories = ['Hospitales', 'Farmacias', 'Pediatras', 'Urgencias'];
  // Use env var or fallback to placeholder (which will fail if not replaced)
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

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

        setLocationError(errorMsg);
        // Fallback to Mexico City
        setUserLocation({ lat: 19.4326, lng: -99.1332 });
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app we would use Places Service here to search dynamic results
    // For now we filter local verified places
  };

  const handleCategoryClick = (category: string) => {
    setActiveCategory(category);
    setSearchQuery(category);
    setSelectedPlaceName(null);
  };

  const filteredPlaces = verifiedPlaces.filter(
    p => p.category === activeCategory || searchQuery.toLowerCase().includes(p.category.toLowerCase())
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
            <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-amber-700 dark:text-amber-300 text-xs">
              <span className="material-symbols-outlined text-sm align-middle mr-1">warning</span>
              {locationError}. Usando ubicación por defecto (CDMX).
            </div>
          )}

          <form onSubmit={handleSearchSubmit} className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-3.5 text-gray-400">
              search
            </span>
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-background-dark border-none rounded-xl text-sm focus:ring-2 focus:ring-primary transition-all shadow-inner"
              placeholder="Buscar lugares verificados..."
              type="text"
            />
          </form>

          <div className="flex gap-2 overflow-x-auto mt-4 hide-scrollbar">
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
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
            Lugares Verificados ({filteredPlaces.length})
          </p>

          {filteredPlaces.map((place, idx) => (
            <article
              key={idx}
              onClick={() => setSelectedPlaceName(place.name)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer group ${selectedPlaceName === place.name
                  ? 'bg-primary/5 border-primary ring-1 ring-primary/20'
                  : 'bg-white dark:bg-surface-dark border-gray-100 dark:border-gray-700 hover:border-primary/40'
                }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-text-main dark:text-white group-hover:text-primary transition-colors text-sm">
                    {place.name}
                  </h3>
                  <div className="flex items-center gap-1 mt-1 text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                    <span className="material-symbols-outlined text-xs text-primary">verified</span>
                    {place.category}
                  </div>
                </div>
                <span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors">
                  chevron_right
                </span>
              </div>
            </article>
          ))}

          {filteredPlaces.length === 0 && (
            <div className="text-center py-10 opacity-50">
              <p className="text-sm">No se encontraron lugares verificados en esta categoría.</p>
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
              Para ver el mapa interactivo, necesitas configurar la variable <code>VITE_GOOGLE_MAPS_API_KEY</code> en tu archivo .env o en Vercel.
            </p>
          </div>
        ) : (
          <MapComponent
            apiKey={apiKey}
            userLocation={userLocation}
            places={filteredPlaces}
            selectedPlaceName={selectedPlaceName}
            onPlaceSelect={setSelectedPlaceName}
          />
        )}

        {/* Header overlay */}
        <div className="absolute top-6 left-6 right-6 lg:left-auto lg:w-72 bg-white/95 dark:bg-surface-dark/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-white/20 z-30 pointer-events-none">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined icon-filled">health_and_safety</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none mb-1">Red Parental</p>
              <p className="text-sm font-bold text-primary">Mapa Interactivo</p>
            </div>
          </div>
        </div>

        {/* Center on me button */}
        <button
          onClick={handleGetLocation}
          disabled={isLocating}
          className="absolute bottom-24 right-6 size-14 bg-white dark:bg-surface-dark text-gray-700 dark:text-white rounded-full shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-30 disabled:opacity-50"
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
