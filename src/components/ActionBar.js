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
        <Button onClick={this.props.login}>Sign In</Button>
        <Button onClick={this.props.addSkateSpot}>Add Spot</Button>
        <Button onClick={this.props.setUserLocation}>My Location</Button>
        <Button onClick={this.props.toggleCamera}>Record</Button>
      </div>
    )
  }
}

export default ActionBar;
