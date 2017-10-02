import React, { Component } from 'react';

import SkateMap from './components/SkateMap';
import uniqueId from 'lodash/uniqueId';

import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import ContentClear from 'material-ui/svg-icons/content/clear';
import ActionPanTool from 'material-ui/svg-icons/action/pan-tool';

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
      currentSpot: '',
      sweetTricksVisible: false,
      tilesData: this.props.tilesData,
    }
  }

  toggleSweetTricks = (value) => this.setState({
    currentSpot: 'Sweet Spot #' + value,
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
      currentSpot,
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
        <div className="SkateMap">
          <SkateMap
            googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyCahLFd-VW58iG7AxPhRTLNPcRGf9SeFPY"
            loadingElement={<div style={{ height: `100%` }} />}
            containerElement={<div style={{ height: `85vh` }} />}
            mapElement={<div style={{ height: `100%` }} />}
            isMarkerShown={true}
            handleClick={this.toggleSweetTricks}
          />
          <div className="SkateMap__prompt">
            <h2>Select a spot on the map brah</h2>
          </div>
        </div>

        <div className={"SweetTricks " + (sweetTricksVisible ? "is-visible" : "")}>
          <div className="SweetTricks__heading">
            <p>{currentSpot}<br /><span>
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
