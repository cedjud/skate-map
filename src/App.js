// Import dependecies
import React, { Component } from 'react';
import uniqueId from 'lodash/uniqueId';

// Import Material-UI components
import { GridList, GridListTile } from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';

import firebase from './firebase.js';
// Import material icons
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

// Import CSS
import './App.css';

const styles = {
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    // justifyContent: 'space-around',
    zIndex: 2,
  },
  gridList: {
    margin: '0px',
    width: '100%',
    height: '100%',
    overflowY: 'auto',
    alignContent: 'flex-start',
  },
};

/**
 * Class App - extends the React Component Class
 */
class App extends Component {

  /**
   * Create the App component and set the initial state
   *
   * @param {object} props - the props object passes
   */
  constructor(props){
    super(props);
    this.state = {
      currentSpot: {
        name: '',
        id: ''
      },
      sweetTricksVisible: false,
      userLocation: null,
      fetchingLocation: false,
      addSkateSpotDialogIsVisible: false,
      skateSpots: [],
      spotMedia: [],
    }
  }


  /**
   * Reavt lifecycle method called when the component mounts
   */
  componentDidMount(){
    const { spotMedia } = this.state;

    const skateSpotsRef = firebase.database().ref('spots');
    const dbMediaRef = firebase.database().ref('spotMedia');
    const imagesRef = firebase.storage().ref().child('spotMedia');

    skateSpotsRef.on('value', (snapshot) => {
      console.log('got new spots')
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

    // dbMediaRef.on('value', (snapshot) => {
    //   console.log('got new media');
    //   let media = snapshot.val();
    //   let newState = [...spotMedia];
    //   console.log(media);
    //   console.log(newState);
    //
    //   for (let content in media) {
    //     console.log(media[content].name);
    //
    //     imagesRef.child(media[content].name).getDownloadURL().then( url => {
    //       imagesRef.child(media[content].name).getMetadata().then( meta => {
    //         newState.push({
    //           img: url,
    //           name: media[content].name,
    //           points: 0,
    //           type: meta.contentType,
    //         })
    //       });
    //     }).catch(error => {
    //       console.log(error.code);
    //     });
    //
    //     this.setState({
    //       spotMedia: newState
    //     })
    //   }
    // });

    this.setUserLocation();
  }


  /**
   * Set map reference
   */
  onMapMounted = (ref) => {
    this.skateMap = ref;
  }


  /**
   * Toggle the tricks picture drawer
   *
   */
  toggleTricksDrawer = (value) => {
    const imagesRef = firebase.storage().ref().child('spotMedia');
    const spotsRef = firebase.database().ref('spots');
    // const currentSpotRed = spotsRef.child(value.id);
    // console.log(currentSpotRed);

    this.setState({
      currentSpot: {
        name: value.name,
        id: value.id
      },
      sweetTricksVisible: !this.state.sweetTricksVisible
    })
  }


  /**
   * Toggle the camera ?
   *
   */
  toggleCamera = () => {
    this.videoInput.click();
  }


  /**
   * Upvote a tile
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
    // const options = {
    //   enableHighAccuracy: true,
    //   timeout: 5000,
    //   maximumAge: 0
    // };

    // getCurrentPosition callback
    const setPosition = (pos) => {

      const position = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      };

      this.setState({
        userLocation: position,
      });

      this.skateMap && this.skateMap.panTo(position);
    }

    const getPositionError = (error) => {
      console.log(error);
    }

    if ("geolocation" in navigator) {
      console.log('geolocating...')
      navigator.geolocation.getCurrentPosition(setPosition, getPositionError);
    } else {
      console.log('not geodude :()')
    }
  }


  /**
   * Toggle the New Skate Spot dialoge
   *
   * @return void
   */
  addSkateSpot = () => {
    this.setState({
      newSkateSpotPosition: this.skateMap.getCenter().toJSON(),
      addSkateSpotDialogIsVisible: !this.state.addSkateSpotDialogIsVisible
    })
  }


  /**
   *
   */
  handleFileInput = (files) => {
    const { currentSpot } = this.state;
    const file = this.videoInput.files[0];
    // Create a root reference
    const storageRef = firebase.storage().ref();
    const fileRef = storageRef.child('spots/' + currentSpot.id + "/" + file.name);

    // fileRef.put(file).then(snapshot => {
    //   console.log('Uploaded a blob or file!');
    // });

    var uploadTask = fileRef.put(file);

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on('state_changed', function(snapshot){
      // Observe state change events such as progress, pause, and resume
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED: // or 'paused'
          console.log('Upload is paused');
          break;
        case firebase.storage.TaskState.RUNNING: // or 'running'
          console.log('Upload is running');
          break;
        default:
          break;
      }
    }, function(error) {
      // Handle unsuccessful uploads
    }, function() {
      // Handle successful uploads on complete
      // For instance, get the download URL: https://firebasestorage.googleapis.com/...
      // var downloadURL = uploadTask.snapshot.downloadURL;
      const dbMediaRef = firebase.database().ref('spots/' + currentSpot.id ).child('media').push().key;
      const media = {
        name: file.name,
        spotId: currentSpot.id,
        spotName: currentSpot.name
      }
      let updates = {};
      updates['spots/' + currentSpot.id + '/media/' + dbMediaRef] = media;
      // dbMediaRef.set({
      //   media: media
      // });
      firebase.database().ref().update(updates);
    });
  }


  /**
   * Render App Component
   *
   */
  render() {
    const {
      currentSpot,
      sweetTricksVisible,
      userLocation,
      addSkateSpotDialogIsVisible,
      newSkateSpotPosition,
      skateSpots,
      // spotMedia
    } = this.state;

    // let sortedTiles = [...tilesData];
    // let sortedTiles = [...spotMedia];
    // sortedTiles.sort((a, b) => {
    //   return b.points - a.points
    // });

    // let owner = sortedTiles.length > 0 ? sortedTiles[0] : "Not claimed";

    return (

      <div className="App">
        <input
          id="videoInput"
          type="file"
          accept="video/*;capture=camcorder"
          ref={(input) => { this.videoInput = input }}
          onChange={this.handleFileInput}
        />


        { userLocation ?
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
          /> :
          <p>Getting your location location...</p>
        }


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
          toggle={this.addSkateSpot}
        />


        <div className={"SweetTricks " + (sweetTricksVisible ? "is-visible" : "")}>
          <div className="SweetTricks__heading">
            <p>{currentSpot.name}<br />
              <span>owned by:&nbsp;</span>
              {/* <span>{" " + owner.name}</span> */}
            </p>
            <IconButton onClick={() => this.toggleTricksDrawer("")} >
              <Clear />
            </IconButton>
          </div>

          <GridList
            cellHeight={180}
            cols={2}
            style={styles.gridList}
            className="SweetTricks__grid"
          >
            {/* sortedTiles.map((tile, index) => {
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
                  {
                    tile.type === 'video/mp4' ?
                    <video src={tile.img} /> :
                    <img src={tile.img} alt="" />
                  }
                </GridListTile>
              )
            }) */}
          </GridList>
        </div>
      </div>
    );
  }
}

export default App;
