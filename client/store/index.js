import { createStore } from 'redux';

const products = [
  { title: 'Awesome concrete box' },
  { title: 'Hard rubber boots' },
];

const initState = {
  filterQuery: '',
  filteredProducts: products,
  products,
};

function exampleAppReducer(state = initState, action) {
  switch (action.type) {
    case 'SET':
      return {
        filterQuery: '',
        products: action.payload.products,
        filteredProducts: action.payload.products,
      };
    case 'FILTER':
      return Object.assign({}, state, {
        filterQuery: action.payload.filterQuery,
        products: state.products,
        filteredProducts: state.products.filter(product => {
          return product.title.indexOf(action.payload.filterQuery) !== -1;
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
