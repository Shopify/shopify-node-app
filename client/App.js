import * as React from 'react';
import {
  Page,
  Layout,
  Card,
  ResourceList,
  TextField,
  Select,
  FormLayout,
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
      searchQuery,
      searchInProgress,
    } = this.props;
    const apiKey = window.apiKey;
    const shopOrigin = window.shopOrigin;
    let productList = (<ResourceList
      items={filteredProducts}
      renderItem={renderProduct}
    />);

    if (searchInProgress) {
      productList = "Searching...";
    }

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
                    value={searchQuery}
                    onChange={newQuery => dispatch(searchAction({ title: newQuery, limit: searchFields.limit }))}
                  />
                  <Select
                    label="Search limit"
                    options={['10', '20', '50']}
                    value={searchFields.limit}
                    onChange={newLimit => dispatch(searchAction({ title: searchFields.title, limit: newLimit }))}
                  />
                  <TextField
                    label="Filter by product title"
                    value={filterQuery}
                    onChange={newQuery => dispatch(filterAction(newQuery))}
                  />
                </FormLayout.Group>
              </FormLayout>
            </Layout.Section>

            <Layout.Section>
              <Card>
                {productList}
              </Card>
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

function mapStateToProps({ filterQuery, filteredProducts, searchFields, searchQuery, searchInProgress }) {
  return {
    filterQuery,
    filteredProducts,
    searchFields,
    searchQuery,
    searchInProgress
  };
}

export default connect(mapStateToProps)(App);
