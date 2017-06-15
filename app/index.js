import * as React from 'react';
import {
  Page,
  Layout,
  Card,
  ResourceList,
} from '@shopify/polaris';

const products = [
  {title: 'Awesome concrete box'},
  {title: 'Hard rubber boots'},
]

export default class App extends React.Component {
  render() {
    return (
      <Page
        title="My application"
        breadcrumbs={[
          {content: 'Home', url: '/foo'},
        ]}
        primaryAction={{content: 'Add something'}}
      >
        <Layout sectioned>
          <Card>
            <ResourceList
              items={products}
              renderItem={renderProduct}
            />
          </Card>
        </Layout>
      </Page>
    );
  }
}

function renderProduct({title}) {
  return <ResourceList.Item attributeOne={title} />
}
