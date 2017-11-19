import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

// Import icons
// import AddLocation from 'material-ui-icons/AddLocation';
// import MyLocation from 'material-ui-icons/MyLocation';
// import CameraAlt from 'material-ui-icons/CameraAlt';

// Import Material-UI components
import Button from 'material-ui/Button';

import '../styles/ActionBar.css';

class ActionBar extends Component {
  render(){
    const {
      userIsSignedIn,
      createSpot,
      viewingSpot,
    } = this.props;

    return (
      <div className="ActionBar" style={this.props.style}>

        { !userIsSignedIn &&
          !viewingSpot &&
          <Button onClick={this.props.login}>Sign In</Button>
        }

        { userIsSignedIn &&
          !createSpot &&
          !viewingSpot &&
          <Button onClick={this.props.logout}>Sign Out</Button>
        }

        { !createSpot &&
          !viewingSpot &&
          <Button onClick={this.props.setUserLocation}>My Location</Button>
        }

        { userIsSignedIn &&
          !createSpot &&
          !viewingSpot &&
          <Button onClick={this.props.addSkateSpot}>Add Spot</Button>
        }

        {/*
        { userIsSignedIn &&
          createSpot &&
          <Button onClick={this.props.saveNewSpot}>Confirm Location</Button>
        }
        */}

        { userIsSignedIn &&
          createSpot &&
          !viewingSpot &&
          <Button onClick={this.props.addSpotInfo}>Add Spot Info</Button>
        }

        { userIsSignedIn &&
          !createSpot &&
          viewingSpot &&
          <Button onClick={this.props.toggleCamera}>Record</Button>
        }
      </div>
    )
  }
}

export default ActionBar;
