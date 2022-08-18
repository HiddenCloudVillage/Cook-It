import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import mapKey from '../../lib/mapKey';

const axios = require('axios');

function GroceryStore() {
  const [center, setCenter] = useState('');
  const [stores, setStores] = useState();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setCenter({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${position.coords.latitude}%2C${position.coords.longitude}&radius=1500&type=store&keyword=grocery&key=${mapKey}`;
      axios({
        method: 'put',
        url: '/getStores',
        data: { url },
      })
        .then((res) => {
          const storeArray = res.data.results.map(
            (store) => store.geometry.location,
          );
          setStores(storeArray);
        })
        .catch((err) => console.log('🚨', err));
    });
  }, []);

  const options = {
    mapId: 'e0dcd433510d5496',
  };
  const mapStyles = {
    height: '50vh',
    width: '50%',
  };
  if (!stores) {
    return null;
  }
  return (
    <LoadScript googleMapsApiKey={mapKey}>
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={16}
        center={center}
        options={options}
      >
        {stores.map((eachStore) => (
          <Marker position={eachStore} />
        ))}
      </GoogleMap>
    </LoadScript>
  );
}

export default GroceryStore;
