import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Linking } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import axios from 'axios';
import { markerImages } from './markerImages';
import { DrawerLayoutAndroid } from 'react-native';

const App = () => {
  const [stations, setStations] = useState([]);
  const drawer = useRef(null);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await axios.get('https://api.openchargemap.io/v3/poi/', {
          params: {
            output: 'json',
            countrycode: 'BR',
            maxresults: 500,
            key: '6a219dc6-a068-40d6-a6f6-b6bf8d9fc9c9',
          },
        });
        setStations(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchStations();
  }, []);

  const handleMenuPress = () => {
    if (drawer.current) {
      drawer.current.openDrawer();
    }
  };

  const handleRedirectToSite = () => {
    Linking.openURL('site-ampmap');
  };

  const handleRedirectToSupport = () => {
    Linking.openURL('https://typebot.co/my-typebot-lcuh3kw');
  };

  const navigationView = () => (
    <View style={styles.drawerContainer}>
      <Text style={styles.drawerHeader}>AmpMap v0.1.0</Text>
      <TouchableOpacity style={styles.menuButtonRed} onPress={handleRedirectToSite}>
        <Text style={styles.menuButtonText}>Visite nosso site</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.menuButtonRed} onPress={handleRedirectToSupport}>
        <Text style={styles.menuButtonText}>Suporte</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <DrawerLayoutAndroid
      ref={drawer}
      drawerWidth={300}
      drawerPosition="left"
      renderNavigationView={navigationView}
    >
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: -16.011780,
            longitude: -48.0611047,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {stations.map((station, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: station.AddressInfo.Latitude,
                longitude: station.AddressInfo.Longitude,
              }}
              title={station.AddressInfo.Title}
              description={station.AddressInfo.AddressLine1}
              image={markerImages.marker1}
            >
              <Callout>
                <View style={styles.calloutContainer}>
                  <Text style={styles.calloutTitle}>{station.AddressInfo.Title}</Text>
                  <Text>{station.AddressInfo.AddressLine1}</Text>
                  <Text>Tipo de carregamento:</Text>
                  {station.Connections.map((connection, index) => (
                    <Text key={index}>
                      {connection.ConnectionType.Title}
                    </Text>
                  ))}
                </View>
              </Callout>
            </Marker>
          ))}
        </MapView>
        <Image
          source={require('./assets/pmap.png')}
          style={styles.watermark}
        />
        <TouchableOpacity
          style={styles.menuButton}
          onPress={handleMenuPress}
        >
          <Image
            source={require('./assets/menu.png')}
            style={styles.menuButtonImage}
          />
        </TouchableOpacity>
      </View>
    </DrawerLayoutAndroid>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  calloutContainer: {
    width: 200,
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 4,
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  watermark: {
    position: 'absolute',
    bottom: -15,
    right: -15,
    width: 200,
    height: 100,
    resizeMode: 'contain',
    opacity: 1,
  },
  menuButton: {
    position: 'absolute',
    top: 40,
    left: 0,
  },
  menuButtonImage: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  drawerContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  drawerHeader: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  menuButtonRed: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
  },
  menuButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default App;
