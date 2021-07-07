import React, { Component } from "react";
import { Button, Form, Input, Message } from "semantic-ui-react";
import Coin from "../../../ethereum/coin";
import web3 from "../../../ethereum/web3";
import { Link, Router } from "../../../routes";
import Layout from "../../../components/Layout";

class NewRequest extends Component {
  static async getInitialProps(props) {
    const { address } = props.query;
    return { address };
  }

  state = {
    value: "",
    description: "",
    recipient: "",
    errorMessage: "",
    loading: false,
  };

  onSubmit = async (event) => {
    event.preventDefault();
    const coin = await Coin(this.props.address);
    const { description, value } = this.state;
    this.setState({ loading: true, errorMessage: "" });
    try {
      const accounts = await web3.eth.getAccounts();
      await coin.methods
        .createRequest(description, web3.utils.toWei(value, "ether"))
        .send({ from: accounts[0] });
      Router.pushRoute(`/coins/${this.props.address}/requests`);
    } catch (error) {
      this.setState({ errorMessage: error.message });
    }
    this.setState({ loading: false, value: "" });
  };

  render() {
    return (
      <Layout>
        <Link route={`/coins/${this.props.address}/requests`}>
          <a>Back</a>
        </Link>
        <h3>Create Request</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Description</label>
            <Input
              value={this.state.description}
              onChange={(event) =>
                this.setState({ description: event.target.value })
              }
            />
          </Form.Field>
          <Form.Field>
            <label>Value in Ether</label>
            <Input
              value={this.state.value}
              onChange={(event) => this.setState({ value: event.target.value })}
            />
          </Form.Field>
          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button content="Create" loading={this.state.loading} primary />
        </Form>
      </Layout>
    );
  }
}

export default NewRequest;
