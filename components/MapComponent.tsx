import React, { useState, useEffect } from 'react';
import {
    APIProvider,
    Map,
    AdvancedMarker,
    Pin,
    InfoWindow,
    useMap,
    useMapsLibrary,
} from '@vis.gl/react-google-maps';
import { GOOGLE_MAPS_API_KEY } from '../lib/maps';

interface Location {
    lat: number;
    lng: number;
}

export interface Place {
    name: string;
    category: string;
    position: Location;
    description?: string;
    address?: string;
    rating?: number;
    user_ratings_total?: number;
    place_id?: string;
    isOpen?: boolean;
}

interface MapComponentProps {
    apiKey: string;
    userLocation: Location | null;
    activeCategory: string; // Used for search
    selectedPlaceName: string | null;
    onPlaceSelect: (placeName: string) => void;
    onPlacesFound: (places: Place[]) => void;
}

// Internal component to handle map interactions and search
const MapOrchestrator: React.FC<{
    center: Location | null,
    userLocation: Location | null,
    zoom: number,
    activeCategory: string,
    onPlacesFound: (places: Place[]) => void
}> = ({ center, userLocation, zoom, activeCategory, onPlacesFound }) => {
    const map = useMap();
    const placesLib = useMapsLibrary('places');
    const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>(null);

    // Initialize Places Service
    useEffect(() => {
        if (!placesLib || !map) return;
        setPlacesService(new placesLib.PlacesService(map));
    }, [placesLib, map]);

    // Handle View Updates
    useEffect(() => {
        if (!map || !center) return;
        map.panTo(center);
        map.setZoom(zoom);
    }, [map, center, zoom]);

    // Perform Search
    useEffect(() => {
        if (!placesService || !userLocation || !activeCategory) return;

        // Map categories to Google Places types/keywords
        let keyword = activeCategory;
        let type = '';

        switch (activeCategory) {
            case 'Hospitales':
                type = 'hospital';
                keyword = 'Hospital pediatrico';
                break;
            case 'Farmacias':
                type = 'pharmacy';
                break;
            case 'Pediatras':
                keyword = 'Pediatra';
                type = 'doctor';
                break;
            case 'Urgencias':
                keyword = 'Urgencias medicas';
                type = 'hospital';
                break;
            case 'Ginecólogo':
                keyword = 'Ginecólogo obstetricia';
                type = 'doctor';
                break;
            case 'Psicoprofilácticos':
                keyword = 'Curso psicoprofiláctico';
                type = 'health';
                break;
            case 'Parto Humanizado':
                keyword = 'Clases preparación parto';
                type = 'health';
                break;
            case 'Células Madre':
                keyword = 'Banco de células madre';
                type = 'health';
                break;
            case 'Nutrición Infantil':
                keyword = 'Nutriólogo pediatra';
                type = 'health';
                break;
            case 'Lactancia':
                keyword = 'Consultora lactancia';
                type = 'health';
                break;
            case 'Fisioterapia Infantil':
                keyword = 'Fisioterapia pediatrica';
                type = 'physiotherapist';
                break;
            case 'Estimulación Temprana':
                keyword = 'Estimulación temprana bebés';
                type = 'school';
                break;
            case 'Psicólogo Infantil':
                keyword = 'Psicólogo infantil';
                type = 'doctor';
                break;
        }

        const request: google.maps.places.PlaceSearchRequest = {
            location: userLocation,
            rankBy: placesLib.RankBy.DISTANCE, // Sort strictly by distance
            keyword: keyword,
            type: type
        };

        placesService.nearbySearch(request, (results, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && results) {
                const mappedPlaces: Place[] = results.map(result => ({
                    name: result.name || 'Lugar desconocido',
                    category: activeCategory,
                    position: {
                        lat: result.geometry?.location?.lat() || 0,
                        lng: result.geometry?.location?.lng() || 0
                    },
                    address: result.vicinity,
                    rating: result.rating,
                    user_ratings_total: result.user_ratings_total,
                    place_id: result.place_id,
                    isOpen: result.opening_hours?.open_now
                }));
                onPlacesFound(mappedPlaces);
            } else {
                console.warn('Places search failed or returned no results:', status);
                onPlacesFound([]);
            }
        });

    }, [placesService, userLocation, activeCategory]);

    return null;
};

const MapComponent: React.FC<MapComponentProps> = ({
    apiKey,
    userLocation,
    activeCategory,
    selectedPlaceName,
    onPlaceSelect,
    onPlacesFound
}) => {
    const [places, setPlaces] = useState<Place[]>([]);
    const [activeMarker, setActiveMarker] = useState<string | null>(null);
    const [center, setCenter] = useState<Location>({ lat: 19.4326, lng: -99.1332 }); // CDMX default
    const [zoom, setZoom] = useState(13);

    // When parent passes places found via callback, update local state for markers
    const handlePlacesFound = (foundPlaces: Place[]) => {
        setPlaces(foundPlaces);
        onPlacesFound(foundPlaces);
    };

    // Update center when user location changes or a place is selected
    useEffect(() => {
        if (selectedPlaceName) {
            const place = places.find(p => p.name === selectedPlaceName);
            if (place) {
                setCenter(place.position);
                setZoom(16);
                setActiveMarker(place.name);
            }
        } else if (userLocation) {
            setCenter(userLocation);
            setZoom(14);
        }
    }, [selectedPlaceName, userLocation, places]);

    const handleMarkerClick = (place: Place) => {
        onPlaceSelect(place.name);
        setActiveMarker(place.name);
    };

    const getPinColor = (category: string) => {
        switch (category) {
            case 'Hospitales': return '#EF4444'; // Red-500
            case 'Farmacias': return '#10B981'; // Emerald-500
            case 'Pediatras': return '#3B82F6'; // Blue-500
            case 'Urgencias': return '#F59E0B'; // Amber-500
            case 'Ginecólogo': return '#EC4899'; // Pink-500
            case 'Psicoprofilácticos': return '#8B5CF6'; // Violet-500
            case 'Parto Humanizado': return '#D946EF'; // Fuchsia-500
            case 'Células Madre': return '#06B6D4'; // Cyan-500
            case 'Nutrición Infantil': return '#84CC16'; // Lime-500
            case 'Lactancia': return '#F472B6'; // Pink-400
            case 'Fisioterapia Infantil': return '#14B8A6'; // Teal-500
            case 'Estimulación Temprana': return '#F59E0B'; // Amber-500
            case 'Psicólogo Infantil': return '#6366F1'; // Indigo-500
            default: return '#6B7280';
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'Hospitales': return 'local_hospital';
            case 'Farmacias': return 'medication';
            case 'Pediatras': return 'child_care';
            case 'Urgencias': return 'emergency';
            case 'Ginecólogo': return 'woman';
            case 'Psicoprofilácticos': return 'psychology';
            case 'Parto Humanizado': return 'pregnant_woman';
            case 'Células Madre': return 'biotech';
            case 'Nutrición Infantil': return 'nutrition';
            case 'Lactancia': return 'baby_changing_station';
            case 'Fisioterapia Infantil': return 'accessibility_new';
            case 'Estimulación Temprana': return 'toys';
            case 'Psicólogo Infantil': return 'sentiment_very_satisfied';
            default: return 'place';
        }
    };

    return (
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY} libraries={['places', 'marker']}>
            <div className="w-full h-full relative">
                <Map
                    mapId={"bf51a910020fa25a"}
                    defaultCenter={center}
                    defaultZoom={zoom}
                    gestureHandling={'greedy'}
                    disableDefaultUI={true}
                    style={{ width: '100%', height: '100%' }}
                >
                    <MapOrchestrator
                        center={center}
                        userLocation={userLocation}
                        zoom={zoom}
                        activeCategory={activeCategory}
                        onPlacesFound={handlePlacesFound}
                    />

                    {/* User Location Marker */}
                    {userLocation && (
                        <AdvancedMarker position={userLocation}>
                            <div className="relative flex items-center justify-center">
                                <div className="w-4 h-4 bg-blue-500 border-2 border-white rounded-full shadow-lg z-10"></div>
                                <div className="absolute w-12 h-12 bg-blue-500/20 rounded-full animate-ping"></div>
                            </div>
                        </AdvancedMarker>
                    )}

                    {/* Places Markers */}
                    {places.map((place, index) => (
                        <AdvancedMarker
                            key={`${place.place_id} -${index} `}
                            position={place.position}
                            onClick={() => handleMarkerClick(place)}
                            title={place.name}
                            zIndex={activeMarker === place.name ? 100 : 1}
                        >
                            <Pin
                                background={getPinColor(place.category)}
                                borderColor={'#ffffff'}
                                glyphColor={'#ffffff'}
                                scale={activeMarker === place.name ? 1.2 : 0.9}
                            >
                                <span className="material-symbols-outlined text-[16px] font-bold" style={{ color: 'white' }}>
                                    {getCategoryIcon(place.category)}
                                </span>
                            </Pin>
                        </AdvancedMarker>
                    ))}

                    {/* Info Window */}
                    {activeMarker && (
                        <InfoWindow
                            anchor={null}
                            position={places.find(p => p.name === activeMarker)?.position}
                            onCloseClick={() => setActiveMarker(null)}
                            headerContent={
                                <div className="font-bold text-gray-800 pr-4 max-w-[200px]">
                                    {activeMarker}
                                </div>
                            }
                        >
                            <div className="text-sm text-gray-600 max-w-[200px]">
                                {places.find(p => p.name === activeMarker)?.address && (
                                    <p className="mb-2 text-xs text-gray-500">{places.find(p => p.name === activeMarker)?.address}</p>
                                )}

                                <div className="flex items-center gap-2 mb-2">
                                    {places.find(p => p.name === activeMarker)?.rating && (
                                        <span className="flex items-center text-xs font-bold text-amber-500 bg-amber-50 px-1.5 py-0.5 rounded">
                                            <span className="material-symbols-outlined text-[12px] mr-1">star</span>
                                            {places.find(p => p.name === activeMarker)?.rating}
                                        </span>
                                    )}
                                    {places.find(p => p.name === activeMarker)?.isOpen !== undefined && (
                                        <span className={`text - [10px] font - bold px - 1.5 py - 0.5 rounded ${places.find(p => p.name === activeMarker)?.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} `}>
                                            {places.find(p => p.name === activeMarker)?.isOpen ? 'ABIERTO' : 'CERRADO'}
                                        </span>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    <button
                                        className="text-xs bg-gray-100 text-gray-700 px-2 py-2 rounded-lg font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
                                        onClick={() => {
                                            const place = places.find(p => p.name === activeMarker);
                                            if (place) {
                                                window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name)}&query_place_id=${place.place_id}`, '_blank');
                                            }
                                        }}
                                    >
                                        Ver en Maps
                                    </button >
                                    <button
                                        className="text-xs bg-blue-600 text-white px-2 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-1 shadow-lg shadow-blue-200"
                                        onClick={() => {
                                            const place = places.find(p => p.name === activeMarker);
                                            if (place && userLocation) {
                                                window.open(`https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${place.position.lat},${place.position.lng}&destination_place_id=${place.place_id}`, '_blank');
                                            }
                                        }}
                                    >
                                        <span className="material-symbols-outlined text-[14px]">directions</span>
                                        Ir ahora
                                    </button>
                                </div >
                            </div >
                        </InfoWindow >
                    )}
                </Map >
            </div >
        </APIProvider >
    );
};

export default MapComponent;
