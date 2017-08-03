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
    case 'FILTER':
      return {
        ...state,
        filterQuery: action.payload.filterQuery,
        products: state.products,
        filteredProducts: state.products.filter(product => {
          return product.title.indexOf(action.payload.filterQuery) !== -1;
        }),
      }
    case 'CHANGE_QUERY':
      return {
        ...state,
        searchFields: {
          ...state.searchFields,
          title: action.payload.query,
        }
      }
    case 'CHANGE_LIMIT':
      return {
        ...state,
        searchFields: {
          ...state.searchFields,
          limit: action.payload.limit,
        }
      }
    case 'SEARCH_START':
      return {
        ...state,
        searchInProgress: true,
        searchFields: action.payload.searchFields,
      }
    case 'SEARCH_COMPLETE':
      return {
        ...state,
        searchInProgress: false,
        products: action.payload.products,
        filterQuery: '',
        filteredProducts: action.payload.products,
      }
    case 'SEARCH_ERROR':
      return {
        ...state,
        searchInProgress: false,
        searchError: action.payload.searchError,
      }
    default:
      return state;
  }
}

const middleware = applyMiddleware(thunkMiddleware, logger);

const store = createStore(exampleAppReducer, middleware);

export default store;
