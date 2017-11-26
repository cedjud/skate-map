import React, { Component } from 'react';
import uniqueId from 'lodash/uniqueId';

import firebase from '../firebase.js';

import ReactLoading from 'react-loading';

import TextField from 'material-ui/TextField';
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import AddAPhoto from 'material-ui-icons/AddAPhoto';
import ArrowUpward from 'material-ui-icons/ArrowUpward';
import ArrowDownward from 'material-ui-icons/ArrowDownward';
import Button from 'material-ui/Button';

import '../styles/CurrentSpot.css';

class CurrentSpot extends Component {
  constructor(props){
    super(props);
    this.state = {
      name: '',
      description: '',
      imagePreview: null,
      uploading: false,
      mediaFetched: false,
      coverUrl: null,
      spotMedia: false
    }
  }

  componentDidMount(){
    var storageRef = firebase.storage().ref();
    storageRef.child(this.props.spot.coverImageRef).getDownloadURL().then((url) => {
      this.setState({
        coverUrl: url,
      })
    }).catch((error) => {
      console.log(error)
    });
    this.getMedia();
  }

  componentWillReceiveProps(){
    console.log(this.props);
    this.getMedia();
  }



  getMedia = () => {
    const storageRef = firebase.storage().ref();
    const media = this.props.spot.media;
    const spotMediaWithPaths = []
    const spotMediaPromises = []

    for (let content in media) {
      let getMediaUrlPromise = storageRef.child(media[content].imagePath).getDownloadURL().then( url => {
        console.log(url);
        return storageRef.child(media[content].imagePath).getMetadata().then( meta => {
            return { ...media[content], mediaId: content, url: url, type: meta.contentType, };
        })
      }).catch(error => {
        console.log(error.code);
      });
      spotMediaPromises.push(getMediaUrlPromise);
    }

    Promise.all(spotMediaPromises).then(medias => {
      this.setState({
        mediaFetched: true,
        spotMedia: medias,
      })
    })
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  componentWillReceiveProps(nextProps){
    console.log(nextProps);
  }

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

  vote = (media, type) => {
    if (this.props.user){
      console.log(media.mediaId, type);
      console.log(this.props.user.uid);

      if (!media.score || !media.upVoters || !media.downVoters) {
        media.score = 0;
        media.upVoters = [];
        media.downVoters = [];
      }

      switch (type) {
        case "down":
          if (media.downVoters && media.downVoters.indexOf(this.props.user.uid) > -1){
            break;
          } else if (media.upVoters && media.upVoters.indexOf(this.props.user.uid) > -1 ){
            const index = media.upVoters.indexOf(this.props.user.uid);
            media.upVoters.splice( index, 1);
            media.score = media.score - 2;
            media.downVoters.push(this.props.user.uid);
          } else {
            media.score = media.score - 1;
            media.downVoters.push(this.props.user.uid);
          }
          break;
        case "up":
          if (media.upVoters && media.upVoters.indexOf(this.props.user.uid) > -1){
            break;
          } else if (media.downVoters && media.downVoters.indexOf(this.props.user.uid) > -1 ){
            const index = media.downVoters.indexOf(this.props.user.uid);
            media.downVoters.splice( index, 1);
            media.score = media.score + 2;
            media.upVoters.push(this.props.user.uid);
          } else {
            media.score = media.score + 1;
            media.upVoters.push(this.props.user.uid);
          }
          break;
        default:
          break;
      }

      let updates = {};
      updates['spots/' + this.props.spot.id + '/media/' + media.mediaId] = media;
      firebase.database().ref().update(updates);

      console.log(media)
    }
  }

  save = () => {
    const mediaPathName = this.state.name + Date.now();

    if (this.spotImage.files.length > 0){
      this.setState({
        uploading: true
      })
      const spotImage = this.spotImage.files[0];

      const storageRef = firebase.storage().ref();
      const fileRef = storageRef.child('images/' + mediaPathName + '/coverImage.jpg');

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

        this.props.saveSpot({
          name: this.state.name,
          description: this.state.description,
          mediaPathName: mediaPathName,
          coverImageRef: 'images/' + mediaPathName + '/coverImage.jpg',
        })
      })
    } else {
      this.props.saveSpot({
        name: this.state.name,
        description: this.state.description,
        mediaPathName: mediaPathName,
      })
    }
  }

  render() {
    const {
      imagePreview,
      uploading,
      mediaFetched,
      coverUrl,
      spotMedia
     } = this.state;

     const {
       name,
       description,
       media,
     } = this.props.spot;

     // const sortedSpotMedia = spotMedia.map( (mediaItem) )
     let sortedSpotMedia = [...spotMedia];
     sortedSpotMedia.sort((a,b) => {
       return b.score - a.score
     });

     console.log(sortedSpotMedia);

    return (
      <div className="CurrentSpot">
        {
          !mediaFetched ?
          <div className="CurrentSpot__loading-container">
            <ReactLoading
              type="spinningBubbles"
              color="#444"
              delay={0}
            />
          </div> :
          <div>
            <div className="CurrentSpot__image-container">
              <div className="CurrentSpot__image">
                <img src={coverUrl} />
              </div>
              <div className="CurrentSpot__info">
                <h1>{name}</h1>
                <p>{description}</p>
              </div>
            </div>
            <div className="CurrentSpot__media-wrapper">
             { sortedSpotMedia.map( (media) => {
               media.type ? console.log(media.type.indexOf('video')) : console.log('media');
                return (
                  <div key={uniqueId()} className="CurrentSpot__media-container">
                    <div className="CurrentSpot__media">
                      { media.type && media.type.indexOf('video') != -1 ?
                        <video
                          className="CurrentSpot__video"
                          src={media.url}
                          controls
                        /> :
                        <img src={media.url} />
                      }
                    </div>
                    {
                      this.props.user &&
                      <div className="CurrentSpot__actions">
                        <IconButton
                          color="contrast"
                          style={
                            media.downVoters &&
                            media.downVoters.indexOf(this.props.user.uid) > -1 ?
                            {
                              opacity: "1",
                              color: "#FF0000"
                            }:
                            {opacity: "0.6"}
                          }
                          onClick={() => this.vote(media, 'down')}
                        >
                          <ArrowDownward />
                        </IconButton>
                        <IconButton
                          color="contrast"
                          style={
                            media.upVoters &&
                            media.upVoters.indexOf(this.props.user.uid) > -1 ?
                            {
                              opacity: "1",
                              color: "#00FF00"
                            }:
                            {opacity: "0.6"}
                          }
                          onClick={() => this.vote(media, 'up')}
                        >
                          <ArrowUpward />
                        </IconButton>
                      </div>
                    }
                  </div>
                )
              })
            }
          </div>
        </div>
      }
      </div>
    )
  }
}

export default CurrentSpot;
