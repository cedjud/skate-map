import React from 'react';
import ReactDOM from 'react-dom';
import uniqueId from 'lodash/uniqueId';

import './index.css';

import App from './App';
import registerServiceWorker from './registerServiceWorker';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import photo1 from './images/photo1.jpeg';
import photo2 from './images/photo2.jpeg';
import photo3 from './images/photo3.jpeg';
import photo4 from './images/photo4.jpeg';
import photo5 from './images/photo5.jpeg';

const skateSpotsData = [
  // {
  //   id: uniqueId(),
  //   name: `Spot # ${this.id}`,
  //   fixed: true,
  //   position: {
  //     lat: 40.70065,
  //     lng: -73.9292556
  //   }
  // },
  // {
  //   id: uniqueId(),
  //   name: `Spot # ${this.id}`,
  //   fixed: true,
  //   position: {
  //     lat: 40.6998477,
  //     lng: -73.9210112
  //   }
  // },
  // {
  //   id: uniqueId(),
  //   name: `Spot # ${this.id}`,
  //   fixed: true,
  //   position: {
  //     lat: 40.6954066,
  //     lng: -73.9240412
  //   }
  // },
]

const tilesData = [
  {
    img: photo1,
    name: 'Breakfast',
    points: 3,
  },
  {
    img: photo2,
    name: 'Tasty burger',
    points: 2,
  },
  {
    img: photo3,
    name: 'Camera',
    points: 1,
  },
  {
    img: photo4,
    name: 'Morning',
    points: 1,
  },
  {
    img: photo5,
    name: 'Hats',
    points: 1,
  },
  {
    img: photo1,
    name: 'Honey',
    points: 0,
  },
  {
    img: photo2,
    name: 'Vegetables',
    points: 0,
  },
  {
    img: photo3,
    name: 'Water plant',
    points: 0,
  },
];

ReactDOM.render(
  <MuiThemeProvider>
    <App
      tilesData={tilesData}
      skateSpotsData={skateSpotsData}
    />
  </MuiThemeProvider>,
  document.getElementById('root')
);
registerServiceWorker();
