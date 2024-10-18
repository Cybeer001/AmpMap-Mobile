import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Linking } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import axios from 'axios';
import { markerImages } from './markerImages';
import { DrawerLayoutAndroid } from 'react-native';

const App = () => {
  const [stations, setStations] = useState([]);
  const [drawerContent, setDrawerContent] = useState('menu');
  const drawer = useRef(null);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await axios.get('https://api.openchargemap.io/v3/poi/', {
          params: {
            output: 'json',
            countrycode: 'BR',
            maxresults: 500,
            key: '40d68154-534c-4026-a54f-67b2c0e90459',
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
    setDrawerContent('menu');
    if (drawer.current) {
      drawer.current.openDrawer();
    }
  };

  const handleProfilePress = () => {
    setDrawerContent('profile');
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

  const profileView = () => (
    <View style={styles.drawerContainer}>
      <Text style={styles.drawerHeader}>Bem vindo! Usuário</Text>
      <TouchableOpacity style={styles.profileButton} onPress={() => alert('Histórico')}>
        <Text style={styles.menuButtonText}>Histórico</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.profileButton} onPress={() => alert('Preferências')}>
        <Text style={styles.menuButtonText}>Preferências de Usuário</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.profileButton} onPress={() => alert('Favoritos')}>
        <Text style={styles.menuButtonText}>Favoritos</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <DrawerLayoutAndroid
      ref={drawer}
      drawerWidth={300}
      drawerPosition="left"
      renderNavigationView={drawerContent === 'menu' ? navigationView : profileView}
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
          source={require('./assets/logoB.png')}
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
        {/* Circular Profile Button */}
        <TouchableOpacity
          style={styles.profileButtonCircle}
          onPress={handleProfilePress}
        >
          <Image
            source={require('./assets/perfil.png')}
            style={styles.profileButtonImage}
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
  profileButtonCircle: {
    position: 'absolute',
    top: 40,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'lightblue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileButtonImage: {
    width: 40,
    height: 40,
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
  profileButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: 'center',
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
