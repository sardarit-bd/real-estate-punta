'use client';

import { useEffect, useRef, useState } from 'react';

const HospitalSchoolFinder = ({ 
  address, 
  apiKey, 
  mapHeight = '500px', 
  radius = 3000 
}) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const boundaryCircleRef = useRef(null);
  const geocoderRef = useRef(null);
  const scriptLoadedRef = useRef(false);
  
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState('');

  // Load Google Maps Script
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if script already loaded
    if (window.google?.maps) {
      setIsLoaded(true);
      scriptLoadedRef.current = true;
      return;
    }

    // Check if script is already being loaded
    if (scriptLoadedRef.current) return;

    const existingScript = document.querySelector(
      `script[src*="maps.googleapis.com"]`
    );

    if (existingScript) {
      existingScript.addEventListener('load', () => {
        setIsLoaded(true);
        scriptLoadedRef.current = true;
      });
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      setIsLoaded(true);
      scriptLoadedRef.current = true;
    };
    
    script.onerror = () => {
      setError('Failed to load Google Maps');
      console.error('Google Maps script failed to load');
    };
    
    document.head.appendChild(script);

    return () => {
      // Cleanup is handled by checking scriptLoadedRef
    };
  }, [apiKey]);

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current || mapInstanceRef.current) return;

    try {
      const defaultCenter = { lat: 23.81411, lng: 90.37417 };

      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center: defaultCenter,
        zoom: 14,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true,
      });

      geocoderRef.current = new window.google.maps.Geocoder();

      // Add click listener to map
      mapInstanceRef.current.addListener('click', (e) => {
        if (e.latLng) {
          handleLocationChange(e.latLng);
        }
      });

      // Initial search with default location
      searchNearby(defaultCenter, 'hospital');
      searchNearby(defaultCenter, 'school');
      drawCircleBoundary(defaultCenter);

    } catch (err) {
      setError('Failed to initialize map');
      console.error('Map initialization error:', err);
    }
  }, [isLoaded]);

  // Handle address prop changes
  useEffect(() => {
    if (!isLoaded || !mapInstanceRef.current || !geocoderRef.current || !address) return;

    geocodeAndUpdate(address);
  }, [isLoaded, address]);

  const geocodeAndUpdate = (addressToGeocode) => {
    if (!geocoderRef.current || !mapInstanceRef.current) return;

    geocoderRef.current.geocode({ address: addressToGeocode }, (results, status) => {
      if (status === 'OK' && results && results[0]) {
        const location = results[0].geometry.location;
        handleLocationChange(location);
        setError(null);
      } else {
        setError(`Location not found: ${status}`);
        console.error('Geocoding failed:', status);
      }
    });
  };

  const handleLocationChange = (location) => {
    if (!mapInstanceRef.current) return;

    mapInstanceRef.current.setCenter(location);
    clearMarkers();
    searchNearby(location, 'hospital');
    searchNearby(location, 'school');
    drawCircleBoundary(location);
  };

  const searchNearby = (location, type) => {
    if (!mapInstanceRef.current) return;

    const service = new window.google.maps.places.PlacesService(mapInstanceRef.current);

    const request = {
      location: location,
      radius: radius,
      type: type,
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
        results.forEach((place) => {
          createMarker(place, type);
        });
      } else if (status !== window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
        console.warn(`Place search failed for ${type}:`, status);
      }
    });
  };

  const createMarker = (place, type) => {
    if (!mapInstanceRef.current || !place.geometry?.location) return;

    let iconUrl = '';

    if (type === 'school') {
      iconUrl = 'https://res.cloudinary.com/dg83pvgls/image/upload/v1770448000/school_hopu7p.png';
    } else if (type === 'hospital') {
      iconUrl = 'https://res.cloudinary.com/dg83pvgls/image/upload/v1770448000/hospital_r0mped.png';
    }

    const marker = new window.google.maps.Marker({
      map: mapInstanceRef.current,
      position: place.geometry.location,
      title: place.name,
      icon: {
        url: iconUrl,
        scaledSize: new window.google.maps.Size(32, 32),
      },
    });

    // Add info window
    const infoWindow = new window.google.maps.InfoWindow({
      content: `
        <div style="padding: 8px; min-width: 200px;">
          <strong style="font-size: 14px; color: #1a1a1a;">${place.name}</strong><br/>
          <span style="font-size: 12px; color: #666;">${place.vicinity || 'Address not available'}</span>
          ${place.rating ? `<br/><span style="font-size: 12px; color: #f59e0b;">⭐ ${place.rating}</span>` : ''}
        </div>
      `,
    });

    marker.addListener('click', () => {
      // Close all other info windows
      markersRef.current.forEach(({ infoWindow: iw }) => {
        if (iw) iw.close();
      });
      infoWindow.open(mapInstanceRef.current, marker);
    });

    markersRef.current.push({ marker, type, infoWindow });
  };

  const clearMarkers = () => {
    markersRef.current.forEach(({ marker, infoWindow }) => {
      if (infoWindow) infoWindow.close();
      marker.setMap(null);
    });
    markersRef.current = [];

    if (boundaryCircleRef.current) {
      boundaryCircleRef.current.setMap(null);
      boundaryCircleRef.current = null;
    }
  };

  const drawCircleBoundary = (center) => {
    if (!mapInstanceRef.current) return;

    if (boundaryCircleRef.current) {
      boundaryCircleRef.current.setMap(null);
    }

    boundaryCircleRef.current = new window.google.maps.Circle({
      map: mapInstanceRef.current,
      center: center,
      radius: radius,
      fillColor: '#4285F4',
      fillOpacity: 0.1,
      strokeColor: '#4285F4',
      strokeOpacity: 0.8,
      strokeWeight: 2,
    });
  };

  const handleSearch = () => {
    if (searchInput.trim()) {
      geocodeAndUpdate(searchInput.trim());
      setSearchInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (error && !mapInstanceRef.current) {
    return (
      <div style={{
        padding: '16px',
        backgroundColor: '#fee2e2',
        border: '1px solid #fecaca',
        borderRadius: '8px',
        color: '#dc2626'
      }}>
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      {/* <div style={{ 
        marginBottom: '16px', 
        display: 'flex', 
        gap: '8px',
        flexWrap: 'wrap'
      }}>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter area name"
          style={{
            flex: '1',
            minWidth: '200px',
            padding: '10px 16px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '14px',
            outline: 'none',
            transition: 'border-color 0.2s'
          }}
          onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
          onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: '10px 24px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#2563eb'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#3b82f6'}
        >
          Search
        </button>
      </div> */}

      {error && mapInstanceRef.current && (
        <div style={{
          marginBottom: '16px',
          padding: '12px',
          backgroundColor: '#fef3c7',
          border: '1px solid #fde68a',
          borderRadius: '8px',
          fontSize: '14px',
          color: '#92400e'
        }}>
          {error}
        </div>
      )}

      {/* <h3 style={{ 
        fontSize: '18px', 
        fontWeight: '600', 
        marginBottom: '12px',
        color: '#1f2937'
      }}>
        লোকেশন অনুযায়ী Hospital & School
      </h3> */}

      <div
        ref={mapRef}
        style={{ 
          height: mapHeight,
          width: '100%',
          borderRadius: '8px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          border: '1px solid #e5e7eb',
          position: 'relative'
        }}
      >
        {!isLoaded && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #e5e7eb',
              borderTop: '4px solid #3b82f6',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ color: '#6b7280', fontSize: '14px' }}>Loading map...</p>
            <style jsx>{`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        )}
      </div>
    </div>
  );
};

export default HospitalSchoolFinder;