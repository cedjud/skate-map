import React, { Component } from 'react';

import TextField from 'material-ui/TextField';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import AddAPhoto from 'material-ui-icons/AddAPhoto';

import '../styles/AddSkateSpotForm.css';

class AddSkateSpotForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      imageAdded: false,
    }
  }
  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  render() {
    const { imageAdded } = this.state;

    return (
      <div className="AddSkateSpotForm">
        <div className="AddSkateSpotForm__image-container">
          <div className="AddSkateSpotForm__image">
            { !imageAdded ?
              <IconButton>
                <AddAPhoto />
              </IconButton>:
              null
            }
          </div>
        </div>
        <TextField
          label="Name"
          fullWidth
        />
        <TextField
          label="Description"
          multiline
          fullWidth
        />
        <input
          id="spotImageInput"
          type="file"
          accept="video/*;capture=camcorder"
          ref={(input) => { this.spotImage = input }}
          onChange={this.handleFileInput}
          hidden
        />
      </div>
    )
  }
}

export default AddSkateSpotForm;
