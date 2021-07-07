import React, { Component } from "react";
import { Input, Message, Form, Button, Menu } from "semantic-ui-react";
import Coin from "../ethereum/coin";
import web3 from "../ethereum/web3";
import { Router } from "../routes";

class BurnForm extends Component {
  state = {
    value: "",
    errorMessage: "",
    loading: false,
    loadingMessage: false,
  };

  onSubmit = async (event) => {
    event.preventDefault();
    const coin = Coin(this.props.address);
    this.setState({ loading: true, errorMessage: "" });
    try {
      const accounts = await web3.eth.getAccounts();
      await coin.methods
        .burn(web3.utils.toWei(this.state.value, "ether"))
        .send({
          from: accounts[0],
        });
      Router.replaceRoute(`/coins/${this.props.address}`);
    } catch (error) {
      this.setState({ errorMessage: error.message });
    }
    this.setState({ loading: false, value: "" });
  };

  onChange = async (event) => {
    const coin = Coin(this.props.address);
    this.setState({ value: event.target.value });
    try {
      if (event.target.value <= 0) {
        return;
      }
      var price;
      await coin.methods
        .getContinuousBurnRefund(web3.utils.toWei(event.target.value, "ether"))
        .call()
        .then((value) => (price = value));
      this.setState({
        message: `${web3.utils.fromWei(price, "ether")} ETH`,
      });
    } catch (error) {}
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Message hidden={!this.state.value} info>
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
          color={this.props.color}
          loading={this.state.loading}
          content={this.props.activeItem}
        />
      </Form>
    );
  }
}

export default BurnForm;
