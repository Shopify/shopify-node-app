import { createStore } from 'redux';

const products = [
  { title: 'Awesome concrete box' },
  { title: 'Hard rubber boots' },
];

const initState = {
  query: '',
  filteredProducts: products,
  products,
};

function exampleAppReducer(state = initState, action) {
  switch (action.type) {
    case 'SET':
      return {
        query: '',
        products: action.payload.products,
        filteredProducts: action.payload.products,
      };
    case 'SEARCH':
      return Object.assign({}, state, {
        query: action.payload.query,
        products: state.products,
        filteredProducts: state.products.filter(product => {
          return product.title.indexOf(action.payload.query) !== -1;
        }),
      });
    default:
      return state;
  }
}

const store = createStore(
  exampleAppReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
