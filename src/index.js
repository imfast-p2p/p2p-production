import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import "./Components/i18n";
import { withTranslation } from 'react-i18next';
import i18n from "i18next";
import * as serviceWorker from "./serviceWorker";
import { subscribeUser } from "./Subscription";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'mdbootstrap/css/bootstrap.min.css';

import { applyPolyfills, defineCustomElements }
  from '@deckdeckgo/qrcode/dist/loader';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
//serviceWorker.register();
//subscribeUser();


applyPolyfills().then(() => {
  defineCustomElements(window);
});