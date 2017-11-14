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

    return (
      <div className="ActionBar">

        { !this.props.userIsSignedIn ?
          <Button onClick={this.props.login}>Sign In</Button> :
          <Button onClick={this.props.logout}>Sign Out</Button>
        }

        { !this.props.createNewSpot &&
          <Button onClick={this.props.setUserLocation}>My Location</Button>
        }

        { this.props.userIsSignedIn &&
          !this.props.createSpot &&
          <Button onClick={this.props.addSkateSpot}>Add Spot</Button>
        }

        { this.props.userIsSignedIn &&
          this.props.createSpot &&
          <Button onClick={this.props.saveNewSpot}>Confirm Location</Button>
        }

        { this.props.userIsSignedIn &&
          !this.props.createNewSpot &&
          this.props.spotSelected &&
          <Button onClick={this.props.toggleCamera}>Record</Button>
        }
      </div>
    )
  }
}

export default ActionBar;
