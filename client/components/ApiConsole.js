import React, { Component} from 'react';
import { connect } from 'react-redux';

import { Layout, Stack, Card, TextField, Button } from '@shopify/polaris';
import ObjectInspector from 'react-object-inspector';
import { updatePath, updateParams, sendRequest } from '../actions';

import VerbPicker from './VerbPicker';

class ApiConsole extends Component {
  render() {
    return (
      <Layout sectioned>
        { this.renderForm() }
        { this.renderResponse() }
      </Layout>
    )
  }

  renderForm() {
    const { dispatch, requestFields } = this.props;

    return (
      <div>
        <Layout.Section>
          <Stack>
            <VerbPicker verb={requestFields.verb} />
            <TextField
              value={requestFields.path}
              onChange={path => dispatch(updatePath(path))}
            />
            <Button primary onClick={() => dispatch(sendRequest(requestFields))}>
              Send
            </Button>
          </Stack>
        </Layout.Section>

        {this.renderParams()}
      </div>
    )
  }

  renderParams() {
    const { dispatch, requestFields } = this.props;

    if (requestFields.verb === 'GET') {
      return null;
    } else {
      return (
        <Layout.Section>
          <TextField
            label="Request Params"
            value={requestFields.params}
            onChange={params => dispatch(updateParams(params))}
            multiline={12}
          />
        </Layout.Section>
      );
    }
  }

  renderResponse() {
    const { requestInProgress, requestError, responseBody } = this.props;

    if (responseBody === '') {
      return null;
    }

    if (requestInProgress) {
      return (
        <Layout.Section>
          'requesting...';
        </Layout.Section>
      )
    }

    const data = JSON.parse(responseBody)

    return (
      <Layout.Section>
        <Card>
          <div style={{margin: '15px 15px'}}>
            <ObjectInspector data={data} initialExpandedPaths={['root', 'root.*']}/>
          </div>
        </Card>
      </Layout.Section>
    )
  }
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

export default connect(mapStateToProps)(ApiConsole);
