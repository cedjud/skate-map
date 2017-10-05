// Import dependecies
import React, { Component } from 'react';
import uniqueId from 'lodash/uniqueId';

// Import Material-UI components
import { GridList, GridTile } from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import BottomNavigation, {
  BottomNavigationButton
} from 'material-ui/BottomNavigation';

// Import material icons
// import ContentClear from 'material-ui/svg-icons/content/clear';
// import ActionPanTool from 'material-ui/svg-icons/action/pan-tool';

import Clear from 'material-ui-icons//Clear';
import AddLocation from 'material-ui-icons/AddLocation';
import MyLocation from 'material-ui-icons/MyLocation';
import AddAPhoto from 'material-ui-icons/AddAPhoto';
import CameraAlt from 'material-ui-icons/CameraAlt';

import {
    googleMapURL,
    containerElementStyles,
} from './google-map-settings.js';

// Import our components
import SkateMap from './components/SkateMap';
import AppBottomNavigation from './components/AppBottomNavigation';


import './App.css';


const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  gridList: {
    width: '100%',
    height: '100%',
    overflowY: 'auto',
  },
};


class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      currentSpotName: '',
      sweetTricksVisible: false,
      tilesData: this.props.tilesData,
      userLocation: null,
      fetchingLocation: false,
      skateSpotsData: this.props.skateSpotsData,
    }
  }


  toggleSweetTricks = (value) => this.setState({
    currentSpotName: 'Sweet Spot #' + value,
    sweetTricksVisible: !this.state.sweetTricksVisible
  })


  addPoint = (updatedTile) => {
    let updatedTiles = [...this.state.tilesData];

    updatedTiles = updatedTiles.map( tile => {
      return tile === updatedTile ? { ...tile, points: tile.points + 1 } : tile
    })

    this.setState({
      tilesData: updatedTiles
    })
  }


  addSkateSpot = (location) => {
    console.log('addSkateSpot');
  }


  /**
   * Set the user location.
   */
  setUserLocation = () => {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    const setPosition = (pos) => {

      const position = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };

      const addSpotMarker = {
        id: uniqueId(),
        name: '',
        position: position
      }

      const updatesSkateSpots = [...this.state.skateSpotsData];
      updatesSkateSpots.push(addSpotMarker);

      this.skateMap.panTo(position);

      this.setState({
        userLocation: position,
        skateSpotsData: updatesSkateSpots,
      });
    }

    const getPositionError = (error) => {
      console.log(error);
    }

    if ("geolocation" in navigator) {
      console.log('geolocating...')
      navigator.geolocation.getCurrentPosition(setPosition);
    } else {
      console.log('not geodude :()')
    }
  }


  toggleCamera = () => {
    console.log('toggleCamera');
  }

  onMapMounted = (ref) => {
    this.skateMap = ref;
  }

  toggleNewSpotDialogue = (position) => {
    console.log('toggleNewSpotDialogue');
  }


  render() {
    const {
      currentSpotName,
      sweetTricksVisible,
      tilesData,
      skateSpotsData,
      userLocation,
    } = this.state;

    let sortedTiles = [...tilesData];

    sortedTiles.sort((a, b) => {
      return b.points - a.points
    });

     let owner = sortedTiles[0];

    return (

      <div className="App">
        <SkateMap
          googleMapURL={googleMapURL}
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={ <div style={ containerElementStyles } /> }
          mapElement={<div style={{ height: `100%` }} />}
          isMarkerShown={true}
          handleClick={this.toggleSweetTricks}
          userLocation={userLocation}
          onMapMounted={this.onMapMounted}
          toggleNewSpotDialogue={this.toggleNewSpotDialogue}
          skateSpotsData={skateSpotsData}
        />

        <AppBottomNavigation
          addSkateSpot={this.addSkateSpot}
          setUserLocation={this.setUserLocation}
          toggleCamera={this.toggleCamera}
        />

        <div className={"SweetTricks " + (sweetTricksVisible ? "is-visible" : "")}>
          <div className="SweetTricks__heading">
            <p>{currentSpotName}<br />
              <span>owned by:</span>
              <span>{" " + owner.name}</span>
            </p>
            <IconButton onClick={this.toggleSweetTricks} >
              <Clear />
            </IconButton>
          </div>

          {/* <GridList
            cellHeight={180}
            cols={2}
            style={styles.gridList}
            className="SweetTricks__grid"
          >
            { sortedTiles.map((tile, index) => (
              <GridTile
                key={uniqueId()}
                cols={index === 0 ? 2 : 1}
                title={tile.name}
                style={{textAlign: "left"}}
                subtitle={<span>points: <b>{tile.points}</b></span>}
                actionIcon={
                  <IconButton
                    onClick={() => this.addPoint(tile)}
                  >
                    <Clear color="white" />
                  </IconButton>
                }
              >
                <img src={tile.img} />
              </GridTile>
            ))}
          </GridList> */}
        </div>
      </div>
    );
  }
}

export default App;
