import * as React from 'react';
import {
  Page,
  Layout,
  Card,
  ResourceList,
  TextField,
  Select,
  FormLayout,
  Button,
} from '@shopify/polaris';
import { EmbeddedApp } from '@shopify/polaris/embedded';
import { connect } from 'react-redux';

const userId = window.userId;

class App extends React.Component {
  componentDidMount() {
    const {
      dispatch,
      searchFields
    } = this.props;

    dispatch(searchAction(searchFields));
  }

  render() {
    const {
      dispatch,
      filterQuery,
      filteredProducts,
      searchFields,
      searchInProgress,
    } = this.props;
    const apiKey = window.apiKey;
    const shopOrigin = window.shopOrigin;
    const productListJSX = (
      <Card>
        <ResourceList
          items={filteredProducts}
          renderItem={renderProduct}
        />
      </Card>
    );
    const searchIndicatorJSX = "Searching...";

    return (
      <EmbeddedApp shopOrigin={shopOrigin} apiKey={apiKey}>
        <Page
          title="My application"
          breadcrumbs={[{ content: 'Home', url: '/foo' }]}
          primaryAction={{ content: 'Add something' }}
        >
          <Layout sectioned>
            <Layout.Section>
              <FormLayout>
                <FormLayout.Group>
                  <TextField
                    label="Search product title"
                    value={searchFields.title}
                    onChange={newQuery => dispatch(changeQueryAction(newQuery))}
                  />
                  <Select
                    label="Search limit"
                    options={['10', '20', '50']}
                    value={searchFields.limit}
                    onChange={newLimit => dispatch(changeLimitAction(newLimit))}
                  />
                </FormLayout.Group>

                <Button primary onClick={() => dispatch(searchAction({ title: searchFields.title, limit: searchFields.limit }))}>Search</Button>

                <TextField
                  label="Filter by product title"
                  value={filterQuery}
                  onChange={newQuery => dispatch(filterAction(newQuery))}
                />
              </FormLayout>
            </Layout.Section>

            <Layout.Section>
              {searchInProgress ? searchIndicatorJSX : productListJSX}
            </Layout.Section>
          </Layout>
        </Page>
      </EmbeddedApp>
    );
  }
}

function renderProduct({ title }) {
  return <ResourceList.Item attributeOne={title} />;
}

function changeQueryAction(query) {
  return {
    type: 'CHANGE_QUERY',
    payload: {
      query
    }
  }
}

function changeLimitAction(limit) {
  return {
    type: 'CHANGE_LIMIT',
    payload: {
      limit
    }
  }
}

function searchAction(searchFields) {
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

function filterAction(filterQuery) {
  return {
    type: 'FILTER',
    payload: { filterQuery },
  };
}

function setAction(products) {
  return {
    type: 'SET',
    payload: { products },
  };
}

function mapStateToProps({ filterQuery, filteredProducts, searchFields, searchInProgress }) {
  return {
    filterQuery,
    filteredProducts,
    searchFields,
    searchInProgress
  };
}

export default connect(mapStateToProps)(App);
