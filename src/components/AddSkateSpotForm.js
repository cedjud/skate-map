import React, { Component } from 'react';

import firebase from '../firebase.js';

import ReactLoading from 'react-loading';

import TextField from 'material-ui/TextField';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import AddAPhoto from 'material-ui-icons/AddAPhoto';
import Button from 'material-ui/Button';


import '../styles/AddSkateSpotForm.css';

class AddSkateSpotForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      name: '',
      description: '',
      imagePreview: null,
      uploading: false
    }
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  addImage = () => {
    this.spotImage.click();
  }

  handleFileInput = () => {
    const oFile = this.spotImage.files[0];
    const oFReader = new FileReader();

    oFReader.readAsDataURL(oFile);

    oFReader.onload = (oFREvent) => {
      this.setState({
        imagePreview: oFREvent.target.result
      })
    };
  }

  save = () => {
    if (this.spotImage.files.length > 0){
      this.setState({
        uploading: true
      })
      const spotImage = this.spotImage.files[0];

      const storageRef = firebase.storage().ref();
      const fileRef = storageRef.child('images/' + this.state.name + '/coverImage.jpg');

      const uploadTask = fileRef.put(spotImage);

      uploadTask.on('state_changed', (snapshot) => {
        console.log(snapshot.state);
      }, (error) => {
        console.log(error);
      }, (e) => {
        console.log('success');
        console.log(uploadTask.snapshot);
        this.setState({
          uploading: false
        })
      })
    } else {
      this.props.saveSpot({
        name: this.state.name,
        description: this.state.description,
      })
    }
  }

  render() {
    const {
      imagePreview,
      uploading
     } = this.state;

    return (
      <div className="AddSkateSpotForm">
        { uploading ?
          <div className="AddSkateSpotForm">
            <div className="AddSkateSpotForm__loader-container">
              <ReactLoading type="bubbles" color="#444" delay={0} />
            </div>
          </div> :
          <div>
            <div className="AddSkateSpotForm__image-container">
              <div className="AddSkateSpotForm__image">
                { !imagePreview ?
                  <div className="AddSkateSpotForm__image-button">
                    <IconButton onClick={this.addImage}>
                      <AddAPhoto />
                    </IconButton>
                  </div>
                  :
                  <img src={imagePreview} />
                }
              </div>
            </div>
            <TextField
              label="Name"
              fullWidth
              value={this.state.name}
              onChange={this.handleChange('name')}
            />
            <TextField
              label="Description"
              multiline
              fullWidth
              value={this.state.description}
              onChange={this.handleChange('description')}
            />
            <input
              id="spotImageInput"
              type="file"
              accept="video/*;capture=camcorder"
              ref={(input) => { this.spotImage = input }}
              onChange={this.handleFileInput}
              hidden
            />
            <div className="AddSkateSpotForm__buttons">
              <Button
                onClick={this.props.cancel}
              >
                Cancel
              </Button>
              <Button
                onClick={this.save}
              >
                Save
              </Button>
            </div>
          </div>
        }
      </div>
    )
  }
}

export default AddSkateSpotForm;
