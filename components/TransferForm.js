import React, { Component } from "react";
import { Context } from "./Context";
import { Input, Message, Form, Button, Menu } from "semantic-ui-react";
import Coin from "../ethereum/coin";
import web3 from "../ethereum/web3";
import { Router } from "../routes";
import helper from "../scripts/helper";

class TransferForm extends Component {
  state = {
    value: "",
    recipient: "",
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
      await coin.methods
        .transfer(
          this.state.recipient,
          web3.utils.toWei(this.state.value, "ether")
        )
        .send({ from: accounts[0] });
      Router.replaceRoute(`/coins/${this.props.address}`);
    } catch (error) {
      this.setState({ errorMessage: error.message });
    }
    this.setState({ loading: false, value: "", recipient: "" });
  };

  // get max coin balance
  onClick = async (event) => {
    event.preventDefault();
    try {
      const accounts = await web3.eth.getAccounts();
      const coin = Coin(this.props.address);
      const coinBalance = await coin.methods.balanceOf(accounts[0]).call();
      this.setState({
        value: web3.utils.fromWei(coinBalance, "ether"),
      });
    } catch (error) {
      console.error(error);
    }
  };

  onRecipient = async (event) => {
    this.setState({ recipient: event.target.value });
  };

  onChange = async (event) => {
    this.setState({ value: event.target.value });
    try {
      if (event.target.value <= 0) {
        return;
      }
      // this.setMessage(web3.utils.toWei(event.target.value, "ether"));
    } catch (error) {
      this.setState({ errorMessage: error.message });
    }
  };

  // async setMessage(coinBalance) {
  //   const coin = Coin(this.props.address);
  //   try {
  //     var price;
  //     await coin.methods
  //       .getContinuousBurnRefund(coinBalance)
  //       .call()
  //       .then((value) => (price = value));
  //     this.setState({
  //       message: `${web3.utils.fromWei(price, "ether")} ETH`,
  //     });
  //   } catch (error) {
  //     this.setState({ errorMessage: error.message });
  //   }
  // }

  render() {
    const { connected } = this.context;
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        {/* <Message info hidden={!this.state.value}>
          {this.state.message}
        </Message> */}
        <Form.Field>
          <Input
            placeholder={helper.beneficiary}
            value={this.state.recipient}
            onChange={this.onRecipient}
            label="Recipient"
            labelPosition="right"
          />
        </Form.Field>
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
          primary
          loading={this.state.loading}
          content={this.props.activeItem}
          disabled={!connected}
        />
      </Form>
    );
  }
}

export default TransferForm;
