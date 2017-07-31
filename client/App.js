import * as React from 'react';
import { Page, Layout, Card, ResourceList, TextField, Select, FormLayout } from '@shopify/polaris';
import { EmbeddedApp } from '@shopify/polaris/embedded';
import { connect } from 'react-redux';

const userId = window.userId;

class App extends React.Component {
  componentDidMount() {
    const { dispatch, productLimit } = this.props;

    fetch(`/api/products.json?limit=${productLimit}&userId=${userId}`)
      .then(response => response.json())
      .then(({ products }) => {
        return dispatch(setAction(products));
      })
      .catch(error => console.error(error));
  }

  render() {
    const { query, filteredProducts, dispatch, productLimit } = this.props;
    const apiKey = window.apiKey;
    const shopOrigin = window.shopOrigin;

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
                    label="Search products"
                    value={query}
                    onChange={newQuery => dispatch(searchAction(newQuery))}
                  />
                  <Select
                    label="Search limit"
                    options={['10', '20', '50']}
                    value={productLimit}
                  />
                </FormLayout.Group>
              </FormLayout>
            </Layout.Section>

            <Layout.Section>
              <Card>
                <ResourceList
                  items={filteredProducts}
                  renderItem={renderProduct}
                />
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

function searchAction(query) {
  return {
    type: 'SEARCH',
    payload: { query },
  };
}

function setAction(products) {
  return {
    type: 'SET',
    payload: { products },
  };
}

function mapStateToProps({ query, filteredProducts }) {
  return { query, filteredProducts };
}

export default connect(mapStateToProps)(App);
