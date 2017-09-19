import * as React from 'react';
import { connect } from 'react-redux';

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
  updateVerb,
  updatePath,
  updateParams,
  requestAction,
} from './actions';

class App extends React.Component {
  render() {
    const {
      dispatch,
      requestFields,
      requestInProgress,
      requestError,
      responseBody,
    } = this.props;

    const { apiKey, shopOrigin } = window;

    const requestIndicatorJSX = 'requesting...';
    const responseBodyJSX = (
      <TextField
        label="Response"
        value={responseBody}
        multiline={30}
      />
    );

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
                    label="HTTP Verb"
                    value={requestFields.verb}
                    onChange={verb => dispatch(updateVerb(verb))}
                  />
                  <TextField
                    label="Path"
                    value={requestFields.path}
                    onChange={path => dispatch(updatePath(path))}
                  />
                  <div style={{transform: 'translateY(12px)'}}>
                    <Button
                      primary
                      onClick={() =>
                        dispatch(
                          requestAction({
                            title: requestFields.title,
                            limit: requestFields.limit,
                          })
                        )}
                    >
                      Send
                    </Button>
                  </div>
                </FormLayout.Group>
              </FormLayout>
            </Layout.Section>

            <Layout.Section>
              <TextField
                label="Request Params"
                value={requestFields.params}
                onChange={params => dispatch(updateParams(params))}
                multiline={10}
              />
            </Layout.Section>

            <Layout.Section>
              {requestInProgress ? requestIndicatorJSX : responseBodyJSX}
              {requestError}
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
  requestFields,
  requestInProgress,
  requestError,
  responseBody,
}) {
  return {
    requestFields,
    requestInProgress,
    requestError,
    responseBody,
  };
}

export default connect(mapStateToProps)(App);
