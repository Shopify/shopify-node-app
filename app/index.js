import * as React from 'react';
import {
  Page,
  Layout,
  Card,
  ResourceList,
  TextField,
} from '@shopify/polaris';
import {connect} from 'react-redux';

const App = ({query, filteredProducts, dispatch}) => {
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
            onChange={(newQuery) => dispatch(searchAction(newQuery))}
          />
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
  );
}

function renderProduct({title}) {
  return <ResourceList.Item attributeOne={title} />
}

function searchAction(query) {
  return {
    type: 'SEARCH',
    query
  };
}

const mapStateToProps = ({query, filteredProducts}) => {
  return {query, filteredProducts};
}

export default connect(mapStateToProps)(App);

