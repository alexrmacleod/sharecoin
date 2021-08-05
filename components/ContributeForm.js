import React, { Component } from "react";
import { Context } from "./Context";
import { Input, Message, Form, Button, Menu } from "semantic-ui-react";
import Coin from "../ethereum/coin";
import web3, { setWeb3, connected } from "../ethereum/web3";
import { Router } from "../routes";
import helper from "../scripts/helper";

class ContributeForm extends Component {
  state = {
    value: "",
    errorMessage: "",
    loading: false,
  };
  static contextType = Context;

  onClick = async (event) => {
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();
    const balance = await web3.eth.getBalance(accounts[0]);
    this.setState({
      value: web3.utils.fromWei(balance, "ether"),
    });
  };

  onSubmit = async (event) => {
    event.preventDefault();
    const coin = Coin(this.props.address);
    this.setState({ loading: true, errorMessage: "" });
    try {
      const accounts = await web3.eth.getAccounts();
      await coin.methods.contribute().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, "ether"),
      });
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
          content="Contribute"
          loading={this.state.loading}
          disabled={!connected}
        />
      </Form>
    );
  }
}

export default ContributeForm;
