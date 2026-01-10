
import React, { useState, useEffect } from 'react';
import {
    APIProvider,
    Map,
    AdvancedMarker,
    Pin,
    InfoWindow,
    useMap
} from '@vis.gl/react-google-maps';

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
}

interface MapComponentProps {
    apiKey: string;
    userLocation: Location | null;
    places: Place[];
    selectedPlaceName: string | null;
    onPlaceSelect: (placeName: string) => void;
}

// Internal component to handle map interactions like panning
const MapHandler: React.FC<{ center: Location | null, zoom: number }> = ({ center, zoom }) => {
    const map = useMap();

    useEffect(() => {
        if (!map || !center) return;
        map.panTo(center);
        map.setZoom(zoom);
    }, [map, center, zoom]);

    return null;
};

const MapComponent: React.FC<MapComponentProps> = ({
    apiKey,
    userLocation,
    places,
    selectedPlaceName,
    onPlaceSelect
}) => {
    const [activeMarker, setActiveMarker] = useState<string | null>(null);
    const [center, setCenter] = useState<Location>({ lat: 19.4326, lng: -99.1332 }); // CDMX default
    const [zoom, setZoom] = useState(13);

    // Update center when user location changes or a place is selected
    useEffect(() => {
        if (selectedPlaceName) {
            const place = places.find(p => p.name === selectedPlaceName);
            if (place) {
                setCenter(place.position);
                setZoom(15);
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
            default: return '#6B7280';
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'Hospitales': return 'local_hospital';
            case 'Farmacias': return 'medication';
            case 'Pediatras': return 'child_care';
            case 'Urgencias': return 'emergency';
            default: return 'place';
        }
    };

    return (
        <APIProvider apiKey={apiKey} libraries={['marker']}>
            <div className="w-full h-full relative">
                <Map
                    mapId={"bf51a910020fa25a"} // Use a demo mapId or create one in console for advanced markers
                    defaultCenter={center}
                    defaultZoom={zoom}
                    gestureHandling={'greedy'}
                    disableDefaultUI={true}
                    style={{ width: '100%', height: '100%' }}
                >
                    <MapHandler center={center} zoom={zoom} />

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
                    {places.map((place) => (
                        <AdvancedMarker
                            key={place.name}
                            position={place.position}
                            onClick={() => handleMarkerClick(place)}
                            title={place.name}
                        >
                            <Pin
                                background={getPinColor(place.category)}
                                borderColor={'#ffffff'}
                                glyphColor={'#ffffff'}
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
                                <div className="font-bold text-gray-800 pr-4">
                                    {activeMarker}
                                </div>
                            }
                        >
                            <div className="text-sm text-gray-600 max-w-[200px]">
                                <p>{places.find(p => p.name === activeMarker)?.category}</p>
                                {places.find(p => p.name === activeMarker)?.address && (
                                    <p className="mt-1 text-xs">{places.find(p => p.name === activeMarker)?.address}</p>
                                )}
                                <button
                                    className="mt-2 text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-md font-bold w-full hover:bg-blue-100"
                                    onClick={() => {
                                        const place = places.find(p => p.name === activeMarker);
                                        if (place && userLocation) {
                                            window.open(`https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${place.position.lat},${place.position.lng}`, '_blank');
                                        } else if (place) {
                                            window.open(`https://www.google.com/maps/search/?api=1&query=${place.position.lat},${place.position.lng}`, '_blank');
                                        }
                                    }}
                                >
                                    Cómo llegar
                                </button>
                            </div>
                        </InfoWindow>
                    )}
                </Map>
            </div>
        </APIProvider>
    );
};

export default MapComponent;
