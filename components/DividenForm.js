import React, { Component } from "react";
import { Context } from "./Context";
import { Input, Message, Form, Button, Menu } from "semantic-ui-react";
import Coin from "../ethereum/coin";
import web3 from "../ethereum/web3";
import { Router } from "../routes";
import helper from "../scripts/helper";

class DividenForm extends Component {
  state = {
    errorMessage: "",
    loading: false,
  };
  static contextType = Context;

  onSubmit = async (event) => {
    event.preventDefault();
    const coin = Coin(this.props.address);
    this.setState({ loading: true, errorMessage: "" });
    try {
      const accounts = await web3.eth.getAccounts();
      await coin.methods.release(accounts[0]).send({
        gas: helper.gas,
        from: accounts[0],
      });
      this.props.onClick("inactive");
      Router.replaceRoute(`/coins/${this.props.address}`);
    } catch (error) {
      this.setState({ errorMessage: error.message });
    }
    this.setState({ loading: false });
  };

  render() {
    const { account, connected } = this.context;
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Message error header="Oops!" content={this.state.errorMessage} />
        <Button
          primary
          content="Release"
          loading={this.state.loading}
          disabled={!connected || this.props.dividen <= 0}
        />
      </Form>
    );
  }
}

export default DividenForm;
