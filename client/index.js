import * as React from 'react';
import {render} from 'react-dom';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import {AppContainer} from 'react-hot-loader';
import App from '../app';

const products = [
  {title: 'Awesome concrete box'},
  {title: 'Hard rubber boots'},
]

const initState = {
  query: '',
  products: products,
  filteredProducts: products
}

const exampleAppReducer = (state = initState, action) => {
  switch (action.type) {
    case 'SEARCH':
      return Object.assign(
        {},
        state,
        {query: action.query,
        products: state.products,
        filteredProducts: state.products.filter((product) => (product.title.indexOf(action.query) !== -1))}
      );
    default:
      return state;
  }
}

const store = createStore(
  exampleAppReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

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

