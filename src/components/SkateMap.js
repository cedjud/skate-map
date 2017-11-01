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
    defaultZoom={13}
    defaultCenter={{ lat: 40.6984445, lng: -73.9251668 }}
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
                () => props.handleClick(skateSpot.name) :
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
