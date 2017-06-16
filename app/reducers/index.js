const initState = {
  query: '',
  products: [
    {title: 'Awesome concrete box'},
    {title: 'Hard rubber boots'},
  ],
}

const exampleAppReducer = (state = initState, action) => {
  switch (action.type) {
    case 'SEARCH':
      return Object.assign(state, {query: action.query});
      // TODO: enable object splat operator
      // return {
      //   ...state,
      //   query: action.query
      // }
    default:
      return state;
  }
}

export default exampleAppReducer;
