import React from 'react';
import icon from  '../images/ic_whatshot_black_24dp_2x.png';
import mapStyles from '../mapStyles.json';

import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
 } from 'react-google-maps';


const SkateMap = withScriptjs( withGoogleMap( props =>
  <GoogleMap
    defaultZoom={15}
    defaultCenter={{ lat: 40.6984445, lng: -73.9251668 }}
    defaultOptions={{
      styles: mapStyles,
      fullscreenControl: false,
      streetViewControl: false,
     }}
    streetView={false}
  >
    { props.isMarkerShown &&
      <div>
        <Marker
          onClick={() => props.handleClick(1)}
          icon={icon}
          position={{ lat: 40.70065, lng: -73.9292556 }}
        />
        <Marker
          onClick={() => props.handleClick(2)}
          icon={icon}
          position={{ lat: 40.6998477, lng: -73.9210112 }}
        />
        <Marker
          onClick={() => props.handleClick(3)}
          icon={icon}
          position={{ lat: 40.6954066, lng: -73.9240412 }} />
      </div> }
  </GoogleMap>
))


export default SkateMap;
