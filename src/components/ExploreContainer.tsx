import './ExploreContainer.css';
import { Geolocation } from '@capacitor/geolocation';
import { GoogleMap } from '@capacitor/google-maps';
import { useRef, useEffect, memo, useState, useMemo } from 'react';
import { isPlatform, IonSpinner } from '@ionic/react';

const ExploreContainer: React.FC = () => {
  const [state, setState] = useState<'loading' | 'loaded' | 'error'>('loading');
  const mapRef = useRef<HTMLElement>();
  let map: GoogleMap;
  const apiKey = useMemo<string>(() => {
    if (isPlatform("ios")) {
      return import.meta.env.VITE_GOOGLE_MAPS_IOS_API_KEY;
    }

    if (isPlatform("android")) {
      return import.meta.env.VITE_GOOGLE_MAPS_ANDROID_API_KEY;
    }

    return import.meta.env.VITE_GOOGLE_MAPS_WEB_API_KEY;
  }, []);

  const createMap = async () => {
    if (!mapRef.current) return;

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

  useEffect(() => {
    (async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));

        await createMap();
        setState('loaded');

        try {
          if (isPlatform('mobile')) {
            const currentPermissionStatus = await Geolocation.checkPermissions();
            switch (currentPermissionStatus.location) {
              case 'prompt':
              case 'prompt-with-rationale':
                const newPermissionStatus = await Geolocation.requestPermissions({
                  permissions: ['location']
                });
                if (newPermissionStatus.location === 'granted') {
                  await enableCurrentLocation(map!);
                }
                break;
              case 'denied':
                break;
              case 'granted':
                await enableCurrentLocation(map!);
                break;
            }
          } else {
            await enableCurrentLocation(map!); 
          }
        } catch (error) {
          console.error(error);
        }
      } catch (error) {
        console.error(error);

        setState('error');
      }
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
