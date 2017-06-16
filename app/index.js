import * as React from 'react';
import {
  Page,
  Layout,
  Card,
  ResourceList,
  TextField,
} from '@shopify/polaris';
import {connect} from 'react-redux';

const App = ({query, products, onSearchChange}) => {
  return (
    <Page
      title="My application"
      breadcrumbs={[
        {content: 'Home', url: '/foo'},
      ]}
      primaryAction={{content: 'Add something'}}
    >
      <Layout sectioned>
        <Layout.Section>
          <TextField
            label="Search products"
            value={query}
            onChange={(query) => onSearchChange(query)}
          />
        </Layout.Section>

        <Layout.Section>
          <Card>
            <ResourceList
              items={products}
              renderItem={renderProduct}
            />
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

function renderProduct({title}) {
  return <ResourceList.Item attributeOne={title} />
}

function searchAction(query) {
  return {
    type: 'QUERY',
    query
  };
}

const mapStateToProps = (state) => {
  return {
    query: state.query,
    products: state.products.filter((product) => (product.title.indexOf(state.query) !== -1))
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSearchChange: (query) => {
      dispatch(searchAction(query))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);

