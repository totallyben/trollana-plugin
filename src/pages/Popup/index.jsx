import React from 'react';
import { createRoot } from 'react-dom/client';

import { Provider } from 'react-redux';
import store from '../../redux/store';
import Popup from './popup';
import { Header, Footer } from "../../components/Popup";

import '../../lang';
import './index.css';

// import { setupSentry } from '../../sentry';

// setupSentry();

const container = document.getElementById('popup');
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <Header />
    <Popup />
    <Footer />
  </Provider>
);
