import React, { Component } from "react";
import { Context } from "./Context";
import { Input, Message, Form, Button, Menu } from "semantic-ui-react";
import Coin from "../ethereum/coin";
import web3 from "../ethereum/web3";
import { Router } from "../routes";
import helper from "../scripts/helper";

class DividenForm extends Component {
  state = {
    value: "",
    errorMessage: "",
    loading: false,
  };
  static contextType = Context;

  onClick = async (event) => {
    event.preventDefault();

    this.setState({
      value: this.props.dividen,
    });
  };

  onSubmit = async (event) => {
    event.preventDefault();
    const coin = Coin(this.props.address);
    this.setState({ loading: true, errorMessage: "" });
    try {
      const accounts = await web3.eth.getAccounts();
      await coin.methods
        .claim(web3.utils.toWei(this.state.value, "ether"))
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
        <Form.Field>
          <Input
            value={this.state.value}
            onChange={(event) => this.setState({ value: event.target.value })}
            label="ETH"
            labelPosition="right"
          />
        </Form.Field>
        <Message error header="Oops!" content={this.state.errorMessage} />
        <Button
          type="button"
          content="Max"
          onClick={this.onClick}
          disabled={!connected}
        />
        <Button
          primary
          content="Claim"
          loading={this.state.loading}
          disabled={!connected || this.props.dividen <= 0}
        />
      </Form>
    );
  }
}

export default DividenForm;
