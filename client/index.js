import * as React from 'react';
import {render} from 'react-dom';
import {AppContainer} from 'react-hot-loader';

function renderApp() {
  const App = require('../app').default;
  render(<AppContainer><App /></AppContainer>, document.getElementById('root'));
}

renderApp();

if (module.hot) {
  module.hot.accept('./index.js');
  module.hot.accept('../app', renderApp);
}

