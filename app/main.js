/* Client UI for kiosk monitors */
import React from 'react';
import ReactDOM from "react-dom";
import {KioskContainer} from './Kiosk.jsx';
import reducer from './reducer.js';
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import io from 'socket.io-client';
const $ = require('jquery');
require('bootstrap');

const store = createStore(reducer);
const socket = io(`${location.protocol}//${location.hostname}:8090`);
socket.on('state', state => {
  //console.log(JSON.stringify(state));
  store.dispatch({type: 'SET_STATE', state})
}
);

ReactDOM.render(
  <Provider store={store}>
    <KioskContainer />
  </Provider>,
  document.getElementById("app")
);
