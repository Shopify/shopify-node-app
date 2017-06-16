import * as React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import {AppContainer} from 'react-hot-loader';
import exampleAppReducer from '../app/reducers';
import App from '../app';

const store = createStore(exampleAppReducer);

function renderApp() {
  render(
    <AppContainer>
      <Provider store={store}>
        <App />
      </Provider>
    </AppContainer>,
    document.getElementById('root')
  );
}

renderApp();

if (module.hot) {
  module.hot.accept('./index.js');
  module.hot.accept('../app', renderApp);
}

