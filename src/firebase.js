import firebase from 'firebase';

const config = {
  apiKey: "AIzaSyCzgpJxOkHxWpwL8KEBYi_WR0XShP22H7k",
  authDomain: "skate-map-13873.firebaseapp.com",
  databaseURL: "https://skate-map-13873.firebaseio.com",
  projectId: "skate-map-13873",
  storageBucket: "skate-map-13873.appspot.com",
  messagingSenderId: "675673815197"
};

firebase.initializeApp(config);
export default firebase;
