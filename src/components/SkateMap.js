import React from 'react';
import mapStyles from '../mapStyles.json';
import uniqueId from 'lodash/uniqueId';
import Whatshot from  '../images/ic_whatshot_black_24dp_2x.png';
import AddLocation from  '../images/ic_add_location_black_24dp_2x.png';

import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
 } from 'react-google-maps';


const SkateMap = withScriptjs( withGoogleMap( props =>
  <GoogleMap
    ref={props.onMapMounted}
    defaultZoom={props.zoom}
    zoom={props.zoom}
    defaultCenter={{lat: 40.6451594, lng: -74.0850816}}
    defaultOptions={{
      styles: mapStyles,
      // disableDefaultUI: true
     }}
    streetView={false}
  >
    { props.createSpot ?
      <Marker
        ref={props.onNewSpotMounted}
        icon={AddLocation}
        position={props.newSpotPosition}
        draggable={true}
      /> :
      null
    }
    { props.isMarkerShown &&
      <div>
        { props.skateSpotsData.map( (skateSpot, index) => {
          return (
            <Marker
              key={uniqueId()}
              icon={Whatshot}
              onClick={() => props.viewSpot(skateSpot)}
              position={skateSpot.position}
            />
          )
        })}
      </div>
    }
  </GoogleMap>
))


export default SkateMap;
