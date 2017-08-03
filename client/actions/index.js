export function changeQueryAction(query) {
  return {
    type: 'CHANGE_QUERY',
    payload: {
      query
    }
  }
}

export function changeLimitAction(limit) {
  return {
    type: 'CHANGE_LIMIT',
    payload: {
      limit
    }
  }
}

export function searchAction(searchFields) {
  const userId = window.userId;
  const { title, limit } = searchFields;
  let params = `limit=${limit}&userId=${userId}`;
  if (title.length) {
    params += `&title=${title}`;
  }

  return (dispatch) => {
    dispatch(searchStartAction(searchFields));
    return fetch(`/api/products.json?${params}`)
      .then(response => response.json())
      .then(({ products }) => {
        return dispatch(searchCompleteAction(products));
      })
      .catch(error => {
        dispatch(searchErrorAction(error));
      });
  };
}

function searchCompleteAction(products) {
  return {
    type: 'SEARCH_COMPLETE',
    payload: {
      products,
    },
  };
}

function searchStartAction(searchFields) {
  return {
    type: 'SEARCH_START',
    payload: {
      searchFields,
    },
  };
}

function searchErrorAction(searchError) {
  return {
    type: 'SEARCH_ERROR',
    payload: {
      searchError,
    },
  };
}

export function filterAction(filterQuery) {
  return {
    type: 'FILTER',
    payload: { filterQuery },
  };
}
