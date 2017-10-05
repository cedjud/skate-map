// Import dependecies
import React, { Component } from 'react';
import uniqueId from 'lodash/uniqueId';

// Import Material-UI components
import { GridList, GridTile } from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';

// Import material icons
import ContentClear from 'material-ui/svg-icons/content/clear';
import ActionPanTool from 'material-ui/svg-icons/action/pan-tool';

import {
    googleMapURL,
    containerElementStyles,
} from './google-map-settings.js';

// Import our components
import SkateMap from './components/SkateMap';


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
    }
  }


  toggleSweetTricks = (value) => this.setState({
    currentSpotName: 'Sweet Spot #' + value,
    sweetTricksVisible: !this.state.sweetTricksVisible
  })

  addPoint = (updatedTile) => {
    let updatedTiles = [...this.state.tilesData];

    updatedTiles = updatedTiles.map( tile => {
      if (tile === updatedTile) {
        return {
          ...tile,
          points: tile.points + 1,
        }
      } else {
        return tile
      }
    })


    this.setState({
      tilesData: updatedTiles
    })
  }


  render() {
    const {
      currentSpotName,
      sweetTricksVisible,
      tilesData
     } = this.state;

     let sortedTiles = [...tilesData];

     sortedTiles.sort(function(a, b){
       return b.points - a.points
     })

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
        />

        <div className={"SweetTricks " + (sweetTricksVisible ? "is-visible" : "")}>
          <div className="SweetTricks__heading">
            <p>{currentSpotName}<br /><span>
                owned by:</span> <span>{" " + owner.name}
            </span>
          </p>
            <IconButton
              onClick={this.toggleSweetTricks}
              >
              <ContentClear />
            </IconButton>
          </div>
          <GridList
            cellHeight={180}
            cols={2}
            style={styles.gridList}
            className="SweetTricks__grid"
          >
            {sortedTiles.map((tile, index) => (
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
                    <ActionPanTool color="white" />
                  </IconButton>
                }
              >
                <img src={tile.img} />
              </GridTile>
            ))}
          </GridList>
        </div>
      </div>
    );
  }
}

export default App;
