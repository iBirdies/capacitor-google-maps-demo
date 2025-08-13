import './ExploreContainer.css';
import { Geolocation } from '@capacitor/geolocation';
import { GoogleMap } from '@capacitor/google-maps';
import { useRef, useEffect, memo, useState, useCallback } from 'react';
import { isPlatform, IonSpinner } from '@ionic/react';

const ExploreContainer: React.FC = () => {
  const [state, setState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const mapRef = useRef<HTMLElement | null>(null);
  const map = useRef<GoogleMap | null>(null);

  const [tileOverlayId, setTileOverlayId] = useState<string | null>(null);

  const toggleTileOverlay = useCallback(async () => {
    if (!map.current) {
      console.error('[toggleTileOverlay] Map not initialized');
      return;
    }

    if (tileOverlayId) {
      try {
        await map.current.removeTileOverlay(tileOverlayId);
        setTileOverlayId(null);
      } catch (error) {
        console.error('[toggleTileOverlay] Error removing tile overlay', error);
      }
    } else {
      try {
        const tileOverlayId = await map.current.addTileOverlay({ url: `https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png`, zIndex: -1000 });
        setTileOverlayId(tileOverlayId);
      } catch (error) {
        console.error('[toggleTileOverlay] Error adding tile overlay', error);
      }
    }
  }, [tileOverlayId]);

  useEffect(() => {
    const setup = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (mapRef.current && !map.current) {
          let apiKey: string;
          if (isPlatform("ios")) {
            apiKey = import.meta.env.VITE_GOOGLE_MAPS_IOS_API_KEY;
          } else if (isPlatform("android")) {
            apiKey = import.meta.env.VITE_GOOGLE_MAPS_ANDROID_API_KEY;
          } else {
            apiKey = import.meta.env.VITE_GOOGLE_MAPS_WEB_API_KEY;
          }

          const paris = {
            lat: 48.8575,
            lng: 2.3514
          };

          const allowedBoundsDistance = 0.005; // 500 meters

          map.current = await GoogleMap.create({
            id: 'main-map',
            element: mapRef.current,
            apiKey: apiKey,
            config: {
              center: paris,
              zoom: 17,
              disableDefaultUI: true,
              minZoom: 15,
              maxZoom: 18,
              mapTypeId: "satellite",
              restriction: {
                latLngBounds: {
                  north: paris.lat + allowedBoundsDistance,
                  south: paris.lat - allowedBoundsDistance,
                  west: paris.lng - allowedBoundsDistance,
                  east: paris.lng + allowedBoundsDistance
                }
              },
              heading: 90,
              mapId: import.meta.env.VITE_GOOGLE_MAPS_MAP_ID,
              styles: [{ featureType: "all", elementType: "labels", stylers: [{ visibility: "off" }] }],
            }
          });
        }

        setState('loaded');
      } catch (error) {
        console.error(error);
        setState('error');
      }
    };

    setup();
  }, []);

  return (
    <div id="container">
      <capacitor-google-map ref={mapRef} id="map"></capacitor-google-map>

      {state === 'loading' && (
        <div id="info-container">
          <IonSpinner />
        </div>
      )}
      {state === 'error' && (
        <div id="info-container">
          <p style={{ color: 'red' }}>Error</p>
        </div>
      )}
      {state === 'loaded' && (
        <button id="toggle-button" onClick={toggleTileOverlay}>{tileOverlayId ? 'Remove Tile Overlay' : 'Add Tile Overlay'}</button>
      )}
    </div>
  );
};

export default memo(ExploreContainer);
