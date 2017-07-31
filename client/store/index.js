import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';

const searchFields = {
  title: '',
  limit: 20,
};

const initState = {
  filterQuery: '',
  filteredProducts: [],
  searchInProgress: false,
  searchError: null,
  searchQuery: '',
  products: [],
  searchFields,
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
    case 'SEARCH_START':
      return Object.assign({}, state, {
        searchInProgress: true,
        searchFields: action.payload.searchFields,
      });
    case 'SEARCH_COMPLETE':
      return Object.assign({}, state, {
        searchInProgress: false,
        products: action.payload.products,
        filterQuery: '',
        filteredProducts: action.payload.products,
      });
    case 'SEARCH_ERROR':
      return Object.assign({}, state, {
        searchInProgress: false,
        searchError: action.payload.searchError,
      });
    default:
      return state;
  }
}

const middleware = applyMiddleware(thunkMiddleware, logger);

const store = createStore(exampleAppReducer, middleware);

export default store;
