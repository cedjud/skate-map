import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

// Import icons
import AddLocation from 'material-ui-icons/AddLocation';
import MyLocation from 'material-ui-icons/MyLocation';
import AddAPhoto from 'material-ui-icons/AddAPhoto';
import CameraAlt from 'material-ui-icons/CameraAlt';

// Import Material-UI components
import BottomNavigation, { BottomNavigationButton } from 'material-ui/BottomNavigation';

const styles = {
  root: {
    position: 'fixed',
    bottom: 0,
    width: '100%',
  },
};

class AppBottomNavigation extends Component {
  constructor(props){
    super(props);
    this.state = {
      value: 0,
    }
  }

  handleChange = (event, value) => {

    const {
      setUserLocation,
      toggleCamera,
      addSkateSpot,
    } = this.props;

    switch (value) {
      case 'setUserLocation':
        setUserLocation(value);
        break;

      case 'toggleCamera':
        toggleCamera();
        break;

      case 'addSpot':
        addSkateSpot();
        break;

      default:
        this.setState({
          value: value,
        })
    }
  }

  render(){
    const classes = this.props.classes;
    const { value } = this.state;

    return (
      <BottomNavigation
        value={0}
        onChange={this.handleChange}
        className={classes.root}
      >
        <BottomNavigationButton
          showLabel={false}
          value="addSkateSpot"
          icon={<AddLocation />}
        />
        <BottomNavigationButton
          showLabel={false}
          icon={<MyLocation />}
          value="setUserLocation"
        />
        <BottomNavigationButton
          showLabel={false}
          value="toggleCamera"
          icon={<CameraAlt />} />
        <input type="file" accept="video/*;capture=camcorder" />
      </BottomNavigation>
    )
  }
}

AppBottomNavigation.propTypes = {
  classes: PropTypes.object.isRequired,
};


export default withStyles(styles)(AppBottomNavigation);
