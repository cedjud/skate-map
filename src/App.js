// Import dependecies
import React, { Component } from 'react';
import uniqueId from 'lodash/uniqueId';

// Import Material-UI components
import { GridList, GridListTile } from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';

import firebase from './firebase.js';
// Import material icons
// import ContentClear from 'material-ui/svg-icons/content/clear';
// import ActionPanTool from 'material-ui/svg-icons/action/pan-tool';
import Clear from 'material-ui-icons//Clear';

// Import google map settings and styles
import {
    googleMapURL,
    containerElementStyles,
} from './google-map-settings.js';

// Import our components
import SkateMap from './components/SkateMap';
import AddSkateSpotDialog from './components/AddSkateSpotDialog';
import AppBottomNavigation from './components/AppBottomNavigation';


import './App.css';


const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    zIndex: 2,
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
      addSkateSpotDialogIsVisible: false,
      skateSpots: [],
      spotMedia: [],
    }
  }


  componentDidMount(){
    const skateSpotsRef = firebase.database().ref('spots');

    skateSpotsRef.on('value', (snapshot) => {
      let spots = snapshot.val();
      let newState = [];
      for (let spot in spots) {
        newState.push({
          id: spot,
          name: spots[spot].name,
          position: spots[spot].position
        });
      }
      this.setState({
        skateSpots: newState
      });
    });

    const dbMediaRef = firebase.database().ref('media');
    const storageRef = firebase.storage().ref();
    const imagesRef = storageRef.child('media');

    dbMediaRef.on('value', (snapshot) => {
      let media = snapshot.val();
      let newState = [];

      for (let content in media) {
        console.log(media[content].name);
        const dlUrl = imagesRef.child(media[content].name).getDownloadURL().then((url => {
          console.log(url);
          newState.push({
            img: url,
            name: media[content].name,
            points: 0
          })
        }));
        this.setState({
          spotMedia: newState
        })
      }
    });
  }

  /**
   * Toggle the tricks picture drawer
   *
   */
  toggleTricksDrawer = (value) => this.setState({
    currentSpotName: 'Spot name: ' + value,
    sweetTricksVisible: !this.state.sweetTricksVisible
  })


  /**
   * Upvote the tile
   *
   */
  addPoint = (updatedTile) => {
    let updatedTiles = [...this.state.tilesData];

    updatedTiles = updatedTiles.map( tile => {
      return tile === updatedTile ? { ...tile, points: tile.points + 1 } : tile
    })

    this.setState({
      tilesData: updatedTiles
    })
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


  /**
   * Toggle the camera ?
   *
   */
  toggleCamera = () => {
    this.videoInput.click();
  }


  /**
   * Add a skate spot
   *
   */
  addSkateSpot = (location) => {
    this.toggleNewSpotDialogue(this.skateMap.getCenter().toJSON());
  }


  /**
   * Set map reference
   */
  onMapMounted = (ref) => {
    this.skateMap = ref;
  }


  /**
   * Toggle the New Skate Spot dialoge
   *
   * @param LatLng position
   * @return void
   */
  toggleNewSpotDialogue = (position) => {
    this.setState({
      newSkateSpotPosition: position,
      addSkateSpotDialogIsVisible: !this.state.addSkateSpotDialogIsVisible
    })
  }


  handleFileInput = (files) => {
    const file = this.videoInput.files[0];
    // Create a root reference
    var storageRef = firebase.storage().ref();
    var fileRef = storageRef.child('media/' + file.name);
    fileRef.put(file).then(function(snapshot) {
      console.log('Uploaded a blob or file!');
    });

    const dbMediaRef = firebase.database().ref('media');
    const media = {
      name: file.name 
    }
    dbMediaRef.push(media);
  }
  /**
   * Render App Component
   *
   */
  render() {
    const {
      currentSpotName,
      sweetTricksVisible,
      tilesData,
      skateSpotsData,
      userLocation,
      addSkateSpotDialogIsVisible,
      newSkateSpotPosition,
      skateSpots,
      spotMedia
    } = this.state;

    // let sortedTiles = [...tilesData];
    let sortedTiles = [...spotMedia];
    sortedTiles.sort((a, b) => {
      return b.points - a.points
    });

    let owner = sortedTiles.length > 0 ? sortedTiles[0] : "Not claimed";
    // let owner = sortedTiles[0];

    return (

      <div className="App">
        <input
          id="videoInput"
          type="file"
          accept="video/*;capture=camcorder"
          ref={(input) => { this.videoInput = input }}
          onChange={this.handleFileInput}
        />

        <SkateMap
          googleMapURL={googleMapURL}
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={ <div style={ containerElementStyles } /> }
          mapElement={<div style={{ height: `100%` }} />}
          onMapMounted={this.onMapMounted}
          isMarkerShown={true}
          handleClick={this.toggleTricksDrawer}
          userLocation={userLocation}
          toggleNewSpotDialogue={this.toggleNewSpotDialogue}
          skateSpotsData={skateSpots}
        />

        <AppBottomNavigation
          addSkateSpot={this.addSkateSpot}
          setUserLocation={this.setUserLocation}
          toggleCamera={this.toggleCamera}
          tricksDrawerToggled={sweetTricksVisible}
        />

        <AddSkateSpotDialog
          title={'New Spot'}
          isVisible={addSkateSpotDialogIsVisible}
          newSkateSpotPosition={newSkateSpotPosition}
          toggle={this.toggleNewSpotDialogue}
          // userLocation={userLocation}
        />

        <div className={"SweetTricks " + (sweetTricksVisible ? "is-visible" : "")}>
          <div className="SweetTricks__heading">
            <p>{currentSpotName}<br />
              <span>owned by:&nbsp;</span>
              <span>{" " + owner.name}</span>
            </p>
            <IconButton onClick={this.toggleTricksDrawer} >
              <Clear />
            </IconButton>
          </div>

          <GridList
            cellHeight={180}
            cols={2}
            style={styles.gridList}
            className="SweetTricks__grid"
          >
            { sortedTiles.map((tile, index) => {
              return (
                <GridListTile
                  key={uniqueId()}
                  cols={index === 0 ? 2 : 1}
                  title={tile.name}
                  style={{textAlign: "left"}}
                  subtitle={<span>points: <b>{tile.points}</b></span>}
                  actionicon={
                  <IconButton onClick={() => this.addPoint(tile)}>
                      <Clear color="white" />
                  </IconButton>
                  }
                >
                  <img src={tile.img} />
                </GridListTile>
              )
            }) }
          </GridList>
        </div>
      </div>
    );
  }
}

export default App;
