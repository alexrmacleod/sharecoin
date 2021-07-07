import React, { Component } from "react";
import { Context } from "./Context";
import { Input, Message, Form, Button, Menu } from "semantic-ui-react";
import Coin from "../ethereum/coin";
import web3 from "../ethereum/web3";
import { Router } from "../routes";

class MintForm extends Component {
  state = {
    message: "",
    value: "",
    errorMessage: "",
    loading: false,
  };
  static contextType = Context;

  onSubmit = async (event) => {
    const coin = Coin(this.props.address);
    event.preventDefault();
    this.setState({ loading: true, errorMessage: "" });
    try {
      const accounts = await web3.eth.getAccounts();
      await coin.methods.mint().send({
        from: accounts[0],
        value: web3.utils.toWei(this.state.value, "ether"),
      });
      Router.replaceRoute(`/coins/${this.props.address}`);
    } catch (error) {
      this.setState({ errorMessage: error.message });
    }
    this.setState({ loading: false, value: "" });
  };

  onClick = async (event) => {
    event.preventDefault();
    try {
      const accounts = await web3.eth.getAccounts();
      const balance = await web3.eth.getBalance(accounts[0]);
      this.setState({ value: web3.utils.fromWei(balance, "ether") });
      this.setMessage(balance);
    } catch (error) {
      console.error(error);
    }
  };

  onChange = async (event) => {
    this.setState({ value: event.target.value });
    try {
      if (event.target.value <= 0) {
        return;
      }
      this.setMessage(web3.utils.toWei(event.target.value, "ether"));
    } catch (error) {
      this.setState({ errorMessage: error.message });
    }
  };

  async setMessage(balance) {
    const coin = Coin(this.props.address);
    try {
      const price = await coin.methods.getContinuousMintReward(balance).call();
      this.setState({
        message: `${web3.utils.fromWei(price, "ether")} ${this.props.symbol}`,
      });
    } catch (error) {
      this.setState({ errorMessage: error.message });
    }
  }

  render() {
    const { connected } = this.context;
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Message info hidden={!this.state.value}>
          {this.state.message}
        </Message>
        <Form.Field>
          <Input
            value={this.state.value}
            onChange={this.onChange}
            label={this.props.label}
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
          color={this.props.color}
          loading={this.state.loading}
          content={this.props.activeItem}
          disabled={!connected}
        />
      </Form>
    );
  }
}

export default MintForm;
