import React, { Component} from 'react';
import { connect } from 'react-redux';
import { Popover, ActionList, Button } from '@shopify/polaris';
import { updateVerb } from '../actions';


class VerbPicker extends Component {
  constructor(props) {
    super(props)
    this.state = {
      opened: false
    }
  }

  toggleOpened() {
    this.setState({ opened: !this.state.opened })
  }

  close() {
    this.setState({ opened: false })
  }

  onAction(verb) {
    this.props.dispatch(updateVerb(verb))
    this.close()
  }

  render() {
    const button = (
      <Button onClick={() => this.toggleOpened()}>
        {this.props.verb}
      </Button>
    )

    return (
      <Popover active={this.state.opened} activator={button} onClose={() => this.close()}>
        <ActionList
          items={['GET', 'POST', 'PUT', 'DELETE'].map(verb => {
            return { content: verb, onAction: () => this.onAction(verb) }
          })}
        />
      </Popover>
    )
  }
}

export default connect()(VerbPicker);
