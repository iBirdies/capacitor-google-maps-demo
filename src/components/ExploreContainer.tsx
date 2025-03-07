import './ExploreContainer.css';
import { Geolocation } from '@capacitor/geolocation';
import { GoogleMap } from '@capacitor/google-maps';
import { useRef, useEffect, memo, useState } from 'react';
import { isPlatform, IonSpinner } from '@ionic/react';

const ExploreContainer: React.FC = () => {
  const [state, setState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const mapRef = useRef<HTMLElement>();
  let map: GoogleMap;

  useEffect(() => {
    const createMap = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (mapRef.current) {
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

          map = await GoogleMap.create({
            id: 'main-map',
            apiKey: apiKey,
            config: {
              center: paris,
              zoom: 17,
              zoomControl: true,
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
              mapId: import.meta.env.VITE_GOOGLE_MAPS_MAP_ID
            },
            element: mapRef.current
          });
        }

        setState('loaded');
      } catch (error) {
        console.error(error);
        setState('error');
      }
    };
    
    const tileOverlayTask = async () => {
      await map.addTileOverlay({
        getTile: (x, y, zoom) => {
          return `https://a.basemaps.cartocdn.com/light_all/${zoom}/${x}/${y}.png`;
        }
      })
    };

    (async () => {
      await createMap();      
      await Promise.allSettled([tileOverlayTask()]);
    })();
  }, []);

  return (
    <div id="container">
      <capacitor-google-map ref={mapRef} id="map" />

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
    </div>
  );
};

export default memo(ExploreContainer);
