import React from 'react';
import { createRoot } from 'react-dom/client';

import { Provider } from 'react-redux';
import store from '../../redux/store';
import Options from './options';

import '../../lang';
import './index.css';

// import { setupSentry } from '../../sentry';

// setupSentry();

const container = document.getElementById('options');
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <Options />
  </Provider>
);
