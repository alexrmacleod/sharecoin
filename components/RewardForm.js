import React, { Component } from "react";
import { Context } from "./Context";
import { Input, Message, Form, Button, Menu } from "semantic-ui-react";
import Coin from "../ethereum/coin";
import web3, { setWeb3, connected } from "../ethereum/web3";
import { Router } from "../routes";
import helper from "../scripts/helper";

class RewardForm extends Component {
  state = {
    value: null,
    errorMessage: "",
    loading: false,
  };
  static contextType = Context;

  onClick = async (event) => {
    event.preventDefault();
    this.setState({
      value: 100,
    });
  };

  onSubmit = async (event) => {
    event.preventDefault();
    const coin = Coin(this.props.address);
    this.setState({ loading: true, errorMessage: "" });
    try {
      const accounts = await web3.eth.getAccounts();
      await coin.methods
        .updateBeneficiaryRewardRatio(this.state.value * 10000)
        .send({
          gas: helper.gas,
          from: accounts[0],
        });
      // switch form back to inactive
      this.props.onClick("inactive");
      // refresh
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
            fluid
            type="number"
            max={100}
            min={0}
            placeholder={this.props.beneficiaryRewardRatio / 10000}
            label="%"
            labelPosition="right"
            value={
              this.state.value !== null
                ? this.state.value
                : this.props.beneficiaryRewardRatio / 10000
            }
            onChange={(event) =>
              this.setState({
                value: event.target.value,
              })
            }
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
          content="Update"
          loading={this.state.loading}
          disabled={!connected}
        />
      </Form>
    );
  }
}

export default RewardForm;
