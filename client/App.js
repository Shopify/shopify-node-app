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
import {
  updateSearchTitle,
  updateSearchLimit,
  searchAction,
  filterAction,
} from './actions';
import { connect } from 'react-redux';

class App extends React.Component {
  componentDidMount() {
    const { dispatch, searchFields } = this.props;

    dispatch(searchAction(searchFields));
  }

  render() {
    const {
      dispatch,
      filterQuery,
      filteredProducts,
      searchFields,
      searchInProgress,
      searchError,
    } = this.props;
    const apiKey = window.apiKey;
    const shopOrigin = window.shopOrigin;
    const productListJSX = (
      <Card>
        <ResourceList items={filteredProducts} renderItem={renderProduct} />
      </Card>
    );
    const searchIndicatorJSX = 'Searching...';

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
                    labelHidden={true}
                    placeholder="Search product title"
                    value={searchFields.title}
                    onChange={title => dispatch(updateSearchTitle(title))}
                  />
                  <Select
                    label="Search limit"
                    labelHidden={true}
                    options={['10', '20', '50']}
                    value={searchFields.limit}
                    onChange={limit => dispatch(updateSearchLimit(limit))}
                  />
                  <Button
                    primary
                    onClick={() =>
                      dispatch(
                        searchAction({
                          title: searchFields.title,
                          limit: searchFields.limit,
                        })
                      )}
                  >
                    Search
                  </Button>
                </FormLayout.Group>

                <TextField
                  label="Filter by product title"
                  labelHidden={true}
                  placeholder="Filter by product title"
                  value={filterQuery}
                  onChange={newQuery => dispatch(filterAction(newQuery))}
                />
              </FormLayout>
            </Layout.Section>

            <Layout.Section>
              {searchInProgress ? searchIndicatorJSX : productListJSX}
              {searchError}
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

function mapStateToProps({
  filterQuery,
  filteredProducts,
  searchFields,
  searchInProgress,
  searchError,
}) {
  return {
    filterQuery,
    filteredProducts,
    searchFields,
    searchInProgress,
    searchError,
  };
}

export default connect(mapStateToProps)(App);
