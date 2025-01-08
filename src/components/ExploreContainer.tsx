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

          map = await GoogleMap.create({
            id: 'main-map',
            apiKey: apiKey,
            config: {
              center: {
                lat: 0,
                lng: 0
              },
              zoom: 5
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

    const enableCurrentLocation = async (map: GoogleMap) => {
      await map.enableCurrentLocation(true);
      const currentLocation = await Geolocation.getCurrentPosition();
      await map.setCamera({
        coordinate: {
          lat: currentLocation.coords.latitude,
          lng: currentLocation.coords.longitude
        },
        zoom: 15
      });
    };

    const resolvePermissionStatus = async (): Promise<void> => {
      if (!isPlatform('mobile')) {
        return;
      }

      const currentPermissionStatus = await Geolocation.checkPermissions();

      switch (currentPermissionStatus.location) {
        case 'prompt':
        case 'prompt-with-rationale':
          const status = await Geolocation.requestPermissions({permissions: ['location']});
          
          if (status.location !== 'granted') {
            throw new Error('Location permission not granted');
          }

          return;

        case 'denied':
          return;

        case 'granted':
          return;
      }
    };

    const permissionsTask = async () => {
      await resolvePermissionStatus();
      await enableCurrentLocation(map);
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
      await Promise.allSettled([tileOverlayTask(), permissionsTask()]);
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
