import React, { Component } from "react";
import { Context } from "./Context";
import { Input, Message, Form, Button, Menu } from "semantic-ui-react";
import Coin from "../ethereum/coin";
import web3, { setWeb3, connected } from "../ethereum/web3";
import { Router } from "../routes";
import helper from "../scripts/helper";

class DescriptionForm extends Component {
  state = {
    value: null,
    errorMessage: "",
    loading: false,
  };
  static contextType = Context;

  onClick = async (event) => {
    event.preventDefault();
    this.setState({
      value: "",
    });
  };

  onSubmit = async (event) => {
    event.preventDefault();
    const coin = Coin(this.props.address);
    this.setState({ loading: true, errorMessage: "" });
    try {
      const accounts = await web3.eth.getAccounts();
      await coin.methods
        .updateDescription(web3.utils.utf8ToHex(this.state.value))
        .send({
          gas: helper.gas,
          from: accounts[0],
        });
      this.props.onClick("inactive");
      Router.replaceRoute(`/coins/${this.props.address}`);
    } catch (error) {
      this.setState({ errorMessage: error.message });
    }
    this.setState({ loading: false, value: "" });
  };

  render() {
    const { account, connected } = this.context;

    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Group widths="equal">
          <Form.TextArea
            maxLength="2300"
            // label="Description"
            placeholder="One Coin to rule them all"
            value={
              this.state.value !== null
                ? this.state.value
                : this.props.description
            }
            onChange={(event) =>
              this.setState({
                value: event.target.value,
              })
            }
          />
        </Form.Group>

        <Message error header="Oops!" content={this.state.errorMessage} />
        <Button
          type="button"
          content="Clear"
          onClick={this.onClick}
          disabled={!connected}
        />
        <Button
          primary
          content="Update"
          loading={this.state.loading}
          disabled={!connected}
        />
      </Form>
    );
  }
}

export default DescriptionForm;
