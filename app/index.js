import * as React from 'react';
import {
  Page,
  Button,
  Layout,
  Card,
  ResourceList,
  TextField,
} from '@shopify/polaris';
import {EmbeddedApp} from '@shopify/polaris/embedded';
import {connect} from 'react-redux';

const userId = window.userId;

class App extends React.Component {
  componentDidMount() {
    const {dispatch} = this.props;

    fetch(`/api/products.json?userId=${userId}`)
      .then((response) => response.json())
      .then(({products}) => {
        dispatch(setAction(products));
      });
  }

  doIllegalThing() {
    fetch(`/api/customers.json?userId=${userId}`)
      .then((response) => response.json())
      .then((result) => {
        console.log(result);
      });
  }

  render() {
    const {query, filteredProducts, dispatch} = this.props;
    const apiKey = window.apiKey
    const shopOrigin = window.shopOrigin

    return (
      <EmbeddedApp shopOrigin={shopOrigin} apiKey={apiKey}>
        <Page
          title="My application"
          breadcrumbs={[
            {content: 'Home', url: '/foo'},
          ]}
          primaryAction={{content: 'Add something'}}
        >
          <Layout sectioned>
            <Button onClick={this.doIllegalThing}>👹</Button>
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
      </EmbeddedApp>
    );
  }
}

function renderProduct({title}) {
  return <ResourceList.Item attributeOne={title} />
}

function searchAction(query) {
  return {
    type: 'SEARCH',
    payload: {query},
  };
}

function setAction(products) {
  return {
    type: 'SET',
    payload: {products},
  };
}

const mapStateToProps = ({query, filteredProducts}) => {
  return {query, filteredProducts};
}

export default connect(mapStateToProps)(App);
