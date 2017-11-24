import React, { Component} from 'react';
import { connect } from 'react-redux';

import { Layout, Stack, TextField, Button } from '@shopify/polaris';
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
              onChange={path => dispatch(updatePath(requestFields.path))}
            />
            <Button primary onClick={() => dispatch(sendRequest(requestFields))}>
              Send
            </Button>
          </Stack>
        </Layout.Section>

        <Layout.Section>
          <TextField
            label="Request Params"
            value={requestFields.params}
            onChange={params => dispatch(updateParams(params))}
            multiline={12}
          />
        </Layout.Section>
      </div>
    )
  }

  renderResponse() {
    const { requestInProgress, requestError, responseBody } = this.props;
    const requestIndicatorJSX = 'requesting...';
    const responseBodyJSX = (
      <TextField
        label="Response"
        value={responseBody}
        multiline={30}
      />
    );

    return (
      <Layout.Section>
        {requestInProgress ? requestIndicatorJSX : responseBodyJSX}
        {requestError}
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
