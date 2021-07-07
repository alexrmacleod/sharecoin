import React, { Component } from "react";
import { Context } from "./Context";
import { Table, Button } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import Coin from "../ethereum/coin";
import { Router } from "../routes";

class RequestRow extends Component {
  state = { loading: false };
  static contextType = Context;

  onApprove = async () => {
    this.setState({ loading: true });
    const { id, request, beneficiary } = this.props;
    try {
      const coin = await Coin(this.props.address);
      const accounts = await web3.eth.getAccounts();
      await coin.methods.approveRequest(this.props.id).send({
        from: accounts[0],
        value: request.value,
      });
      this.setState({ loading: false });
    } catch (error) {
      this.setState({ loading: false });
    }
    Router.replaceRoute(`/coins/${this.props.address}/requests`);
  };

  // onFinalize = async () => {
  //   this.setState({ loadingFinalize: true });
  //   const coin = await coin(this.props.address);
  //   const accounts = await web3.eth.getAccounts();
  //   await coin.methods.finalizeRequest(this.props.id).send({
  //     from: accounts[0],
  //   });
  //   this.setState({ loadingFinalize: false });
  //   Router.replaceRoute(`/coins/${this.props.address}/requests`);
  // };

  render() {
    const { Row, Cell } = Table;
    const { id, request, beneficiary } = this.props;
    const { account } = this.context;
    const now = +new Date();
    const week = 604800;
    console.log("request.timestamp", request.timestamp);
    // const readyToFinalize = request.approvalCount > approversCount / 2;
    console.log("account", account);
    console.log("beneficiary", beneficiary);
    console.log("request.complete", request.complete);
    return (
      <Row
        disabled={request.complete || now > request.timestamp + week}
        positive={!request.complete || !now > request.timestamp + week}
      >
        <Cell>{id}</Cell>
        <Cell>{request.description}</Cell>
        <Cell>{web3.utils.fromWei(request.value, "ether")} ETH</Cell>
        <Cell>{request.recipient}</Cell>
        <Cell textAlign="center">
          {request.complete || now > request.timestamp + week ? null : (
            <Button
              disabled={account !== beneficiary}
              color="green"
              content="Approve"
              basic
              loading={this.state.loading}
              onClick={this.onApprove}
            />
          )}
        </Cell>
      </Row>
    );
  }
}

export default RequestRow;
