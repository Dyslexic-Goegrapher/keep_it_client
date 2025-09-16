import { useState, useEffect, useRef } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';

import * as Device from 'expo-device';

import * as Location from 'expo-location';

export default function App() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [historicItems, setHistoricItems] = useState<any[]>([]);
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);

  useEffect(() => {
    async function startLocationTracking() {
      if (Platform.OS === 'android' && !Device.isDevice) {
        setErrorMsg(
          'Oops, this will not work on Snack in an Android Emulator. Try it on your device!'
        );
        return;
      }
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      // Start continuous location tracking
      locationSubscription.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000, // Update every 1 second
          distanceInterval: 1, // Update every 1 meter
        },
        (newLocation) => {
          setLocation(newLocation);
          setIsTracking(true);
        }
      );
    }


    async function startInfoDisplay(x: string, y: string) {
      const bboxBuffer = 0.001;
      const historicItemsUrl = `https://www.mercator.vlaanderen.be/raadpleegdienstenmercatorpubliek/ogc/features/v1/collections/lu:lu_wet_bk_el_pub/items?bbox=${parseFloat(x)-bboxBuffer},${parseFloat(y)-bboxBuffer},${parseFloat(x)+bboxBuffer},${parseFloat(y)+bboxBuffer}`;
      const historicItemsResponse = await fetch(historicItemsUrl);
      const historicItems = await historicItemsResponse.json();
      const historicItemsFeatures = historicItems.features;
      // console.log(historicItems);
      // console.log(historicItemsFeatures);
      console.log(historicItemsFeatures);
      console.log(historicItemsFeatures.length);
      setHistoricItems(historicItems.features[0].properties);
    }

    startLocationTracking();
    startInfoDisplay(location?.coords.longitude?.toFixed(6) || '0', location?.coords.latitude?.toFixed(6) || '0');

    // Cleanup function to stop location tracking when component unmounts
    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
        setIsTracking(false);
      }
    };
  }, []);

  let text = 'Waiting for location...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = `Uitleg: ${historicItems?.naam}\nLocatie: ${historicItems?.locatie}\n URL: ${historicItems?.url}`;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Location Tracker</Text>
      <Text style={styles.status}>
        Status: {isTracking ? '🟢 Tracking' : '🔴 Not Tracking'}
      </Text>
      <Text style={styles.paragraph}>{text}</Text>
      {location && (
        <Text style={styles.timestamp}>
          Last updated: {new Date(location.timestamp).toLocaleTimeString()}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  status: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: '600',
  },
  paragraph: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    color: '#666',
    marginBottom: 10,
  },
  timestamp: {
    fontSize: 14,
    textAlign: 'center',
    color: '#888',
    fontStyle: 'italic',
  },
});
