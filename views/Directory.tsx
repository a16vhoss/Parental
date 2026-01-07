
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

const Directory: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [aiResponseText, setAiResponseText] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<string | null>(null);

  useEffect(() => {
    handleGetLocation();
  }, []);

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(coords);
          // Al inicio, el mapa muestra la ubicación del usuario
          if (!selectedPlace) {
            setSelectedPlace(`${coords.lat},${coords.lng}`);
          }
          performSearch("Hospitales pediátricos", coords);
        },
        (error) => {
          console.error("Error obteniendo ubicación:", error);
          const fallbackCoords = { lat: 19.4326, lng: -99.1332 }; 
          setUserLocation(fallbackCoords);
          if (!selectedPlace) {
            setSelectedPlace("19.4326,-99.1332");
          }
          performSearch("Hospitales pediátricos", fallbackCoords);
        }
      );
    }
  };

  const performSearch = async (query: string, location?: { lat: number, lng: number }) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setSearchQuery(query);
    setAiResponseText(null);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const currentLoc = location || userLocation;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Encuentra ${query} cercanos. Dame un resumen ejecutivo de máximo 40 palabras destacando la mejor opción por cercanía o reputación.`,
        config: {
          systemInstruction: "Eres un concierge experto en salud infantil. Tu respuesta debe ser extremadamente breve, útil y directa al punto sobre los lugares encontrados mediante la herramienta de mapas.",
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: {
              latLng: currentLoc ? {
                latitude: currentLoc.lat,
                longitude: currentLoc.lng
              } : undefined
            }
          }
        },
      });

      setAiResponseText(response.text || null);
      
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const mapResults = chunks.filter((c: any) => c.maps);
      
      setResults(mapResults);

      if (mapResults.length > 0) {
        setSelectedPlace(mapResults[0].maps.title);
      }
    } catch (error) {
      console.error("Error en búsqueda inteligente:", error);
      setAiResponseText("Lo sentimos, hubo un error al conectar con el servicio de mapas.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchQuery);
  };

  const selectItem = (title: string) => {
    setSelectedPlace(title);
    if (window.innerWidth < 1024) {
      const mapElem = document.getElementById('map-container');
      if (mapElem) mapElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Función para construir el SRC del mapa dinámicamente
  const getMapUrl = () => {
    if (!selectedPlace && !userLocation) return '';
    
    const baseUrl = "https://maps.google.com/maps";
    const params = new URLSearchParams();
    
    // Si tenemos ubicación del usuario Y un lugar seleccionado que no sea su propia coordenada
    // Mostramos la ruta para que se vean ambos puntos en el mapa
    if (userLocation && selectedPlace && selectedPlace !== `${userLocation.lat},${userLocation.lng}`) {
      params.set('saddr', `${userLocation.lat},${userLocation.lng}`);
      params.set('daddr', selectedPlace);
    } else {
      // Si solo tenemos uno de los dos, mostramos el punto simple
      params.set('q', selectedPlace || `${userLocation?.lat},${userLocation?.lng}`);
    }
    
    params.set('t', '');
    params.set('z', '15');
    params.set('ie', 'UTF8');
    params.set('iwloc', '');
    params.set('output', 'embed');
    
    return `${baseUrl}?${params.toString()}`;
  };

  return (
    <main className="flex flex-col lg:flex-row h-screen overflow-hidden bg-background-light dark:bg-background-dark">
      {/* Columna Izquierda: Lista y Búsqueda */}
      <div className="w-full lg:w-[450px] xl:w-[500px] h-full flex flex-col bg-white dark:bg-surface-dark shadow-xl z-20 border-r border-gray-100 dark:border-gray-800">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-black text-text-main dark:text-white tracking-tight flex items-center gap-2">
              Directorio
            </h1>
            <button 
              onClick={handleGetLocation}
              className={`p-2 rounded-xl border flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-all ${userLocation ? 'bg-primary/10 border-primary text-primary' : 'bg-gray-50 border-gray-200 text-gray-400'}`}
            >
              <span className="material-symbols-outlined text-sm">{userLocation ? 'my_location' : 'location_searching'}</span>
              {userLocation ? 'GPS' : 'Activar'}
            </button>
          </div>
          
          <form onSubmit={handleSearchSubmit} className="relative group">
            <span className={`material-symbols-outlined absolute left-4 top-3.5 text-gray-400 transition-colors ${isSearching ? 'animate-spin text-primary' : ''}`}>
              {isSearching ? 'progress_activity' : 'search'}
            </span>
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-gray-50 dark:bg-background-dark border-none rounded-xl text-sm focus:ring-2 focus:ring-primary transition-all shadow-inner" 
              placeholder="¿Qué buscas hoy?" 
              type="text"
            />
          </form>

          <div className="flex gap-2 overflow-x-auto mt-4 hide-scrollbar">
            {['Farmacias', 'Pediatras', 'Hospitales', 'Urgencias'].map(cat => (
              <button 
                key={cat}
                onClick={() => performSearch(cat)}
                className="px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 text-[10px] font-bold uppercase tracking-tighter hover:border-primary hover:text-primary transition-colors whitespace-nowrap bg-white dark:bg-surface-dark"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {isSearching ? (
            <div className="flex flex-col items-center justify-center py-20 opacity-40">
              <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4"></div>
              <p className="text-sm font-bold">Localizando servicios...</p>
            </div>
          ) : results.length > 0 || aiResponseText ? (
            <>
              {aiResponseText && (
                <div className="relative overflow-hidden group mb-6 animate-in fade-in slide-in-from-top-4 duration-500">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent rounded-2xl border border-primary/20 shadow-sm"></div>
                  <div className="relative p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-primary animate-pulse icon-filled" style={{fontSize: '20px'}}>auto_awesome</span>
                        <span className="text-[11px] font-black uppercase tracking-[0.1em] text-primary-dark dark:text-primary">Resumen Inteligente</span>
                      </div>
                      <span className="text-[9px] font-bold text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">Gemini 2.5</span>
                    </div>
                    <p className="text-xs leading-relaxed text-gray-700 dark:text-gray-200 font-medium">
                      {aiResponseText}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="space-y-3">
                {results.map((item, idx) => (
                  <article 
                    key={idx} 
                    onClick={() => selectItem(item.maps.title)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer group animate-in slide-in-from-bottom-2 duration-300 ${selectedPlace === item.maps.title ? 'bg-primary/5 border-primary ring-1 ring-primary/20 shadow-md' : 'bg-white dark:bg-surface-dark border-gray-100 dark:border-gray-700 hover:border-primary/40'}`}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1">
                        <h3 className="font-bold text-text-main dark:text-white group-hover:text-primary transition-colors">
                          {item.maps.title}
                        </h3>
                        <div className="flex items-center gap-1 mt-1 text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                          <span className="material-symbols-outlined text-xs">location_on</span>
                          Ubicación Verificada
                        </div>
                      </div>
                      <a 
                        href={item.maps.uri} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg bg-gray-50 dark:bg-background-dark border border-gray-100 dark:border-gray-700 text-gray-400 hover:text-primary transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="material-symbols-outlined text-sm">directions</span>
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center opacity-30">
              <span className="material-symbols-outlined text-6xl mb-4">explore_off</span>
              <p className="font-black text-lg">Sin resultados</p>
              <p className="text-sm mt-1 px-10">Intenta con "Hospital pediátrico" o "Clínica 24h".</p>
            </div>
          )}
        </div>
      </div>

      {/* Columna Derecha: Mapa */}
      <div id="map-container" className="flex-1 h-full relative bg-gray-100">
        {selectedPlace || userLocation ? (
          <iframe
            key={getMapUrl()}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            src={getMapUrl()}
            className="w-full h-full grayscale-[0.1] dark:invert-[0.9] dark:hue-rotate-180"
          ></iframe>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-background-dark">
            <div className="text-center opacity-20">
              <span className="material-symbols-outlined text-[120px] mb-4">map_search</span>
              <p className="text-xl font-bold">Cargando Mapa...</p>
            </div>
          </div>
        )}
        
        {/* Leyenda de ruta */}
        {userLocation && selectedPlace && selectedPlace !== `${userLocation.lat},${userLocation.lng}` && (
          <div className="absolute bottom-24 left-6 bg-white/90 dark:bg-surface-dark/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-primary/20 z-30 animate-in slide-in-from-left-4 duration-500">
             <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-blue-500"></div>
                <p className="text-[10px] font-bold text-gray-500 uppercase">Tú</p>
                <div className="w-4 h-0.5 border-t border-dashed border-gray-300 mx-1"></div>
                <div className="size-2 rounded-full bg-primary"></div>
                <p className="text-[10px] font-bold text-gray-500 uppercase">Destino</p>
             </div>
          </div>
        )}

        <div className="absolute top-6 left-6 right-6 lg:left-auto lg:w-72 bg-white/95 dark:bg-surface-dark/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-white/20 z-30">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined icon-filled">health_and_safety</span>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-none mb-1">Red Parental</p>
              <p className="text-sm font-bold text-primary">Servicios Verificados</p>
            </div>
          </div>
        </div>

        <button 
          onClick={() => {
            handleGetLocation();
            if (userLocation) setSelectedPlace(`${userLocation.lat},${userLocation.lng}`);
          }}
          className="absolute bottom-6 right-6 size-14 bg-primary text-white rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-30"
          title="Centrar en mí"
        >
          <span className="material-symbols-outlined">my_location</span>
        </button>
      </div>
    </main>
  );
};

export default Directory;
