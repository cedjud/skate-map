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
    defaultZoom={3}
    defaultCenter={{lat: 30.0643914, lng: -18.0244607}}
    defaultOptions={{
      styles: mapStyles,
      disableDefaultUI: true
     }}
    streetView={false}
  >
    { props.isMarkerShown &&
      <div>
        { props.skateSpotsData.map( (skateSpot, index) => {
          return (
            <Marker
              key={uniqueId()}
              icon={skateSpot.new ? AddLocation : Whatshot}
              onClick={
                !skateSpot.new ?
                () => props.handleClick(skateSpot) :
                props.toggleNewSpotDialogue
              }
              position={skateSpot.position}
            />
          )
        })}
      </div>
    }
  </GoogleMap>
))


export default SkateMap;
