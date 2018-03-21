import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import store, { history } from './store';
import App from './components/app';
import firebase from 'firebase';

import 'sanitize.css/sanitize.css';
import './index.css';

var config = {
    apiKey: "AIzaSyBKkfgY2u_oEEkFw6dwyl7E2wOs3lQqER8",
    authDomain: "portfolio-9d56b.firebaseapp.com",
    databaseURL: "https://portfolio-9d56b.firebaseio.com/",
    storageBucket: "bucket.appspot.com"
  };
firebase.initializeApp(config);

var rootRef = firebase.database().ref();

//var ref = firebase.app().database().ref();
rootRef.once('value')
 .then(function (snap) {
 console.log('snap.val()', snap.val());
 });


var ref = firebase.database().ref('/some/path');
var obj = {someAttribute: true};
ref.push(obj);   // Creates a new ref with a new "push key"
ref.set(obj);    // Overwrites the path
ref.update(obj); // Updates only the specified attributes 



const target = document.querySelector('#root');

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div>
        <App />
      </div>
    </ConnectedRouter>
  </Provider>,
  target
);
