import {createStore} from 'redux';

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

export default store;
