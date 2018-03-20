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
        { this.renderWelcome() }
        { this.renderCurrentOrders() }
        { this.renderResponse() }
      </Layout>
    )
  }

  renderWelcome() {

    return (

      <div>
      <Card
        title="Clackeys App Interative Example v1"
        sectioned
      >
        <p>{"Play around below to see what's going on with your store!"}</p>
      </Card>
      </div>
    )
  }

  renderCurrentOrders() {
    const { dispatch, getCurrentOrders } = this.props;

    return (

      <div>
        <Layout.Section>
        This request will show you <strong>all</strong> of the stores current orders.
          <Stack>
            <VerbPicker verb={getCurrentOrders.verb} />
            <TextField
              value={getCurrentOrders.path}
              onChange={path => dispatch(updatePath(path))}
            />
            <Button primary onClick={() => dispatch(sendRequest(getCurrentOrders))}>
              Send
            </Button>
          </Stack>
        </Layout.Section>
      </div>
    )
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
  getCurrentOrders,
  requestInProgress,
  requestError,
  responseBody,
}) {
  return {
    requestFields,
    getCurrentOrders,
    requestInProgress,
    requestError,
    responseBody,
  };
}

export default connect(mapStateToProps)(ApiConsole);
