import React, { Component } from "react";
import { Context } from "./Context";
import { Table, Button } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import Coin from "../ethereum/coin";
import { Router } from "../routes";

class ProposalRow extends Component {
  state = { loading: false };
  static contextType = Context;

  onApprove = async () => {
    this.setState({ loading: true });
    const { id, proposal, beneficiary } = this.props;
    try {
      const coin = await Coin(this.props.address);
      const accounts = await web3.eth.getAccounts();
      await coin.methods.approveProposal(this.props.id).send({
        from: accounts[0],
        value: proposal.value,
      });
      this.setState({ loading: false });
    } catch (error) {
      this.setState({ loading: false });
    }
    Router.replaceRoute(`/coins/${this.props.address}/proposals`);
  };

  // onFinalize = async () => {
  //   this.setState({ loadingFinalize: true });
  //   const coin = await coin(this.props.address);
  //   const accounts = await web3.eth.getAccounts();
  //   await coin.methods.finalizeProposal(this.props.id).send({
  //     from: accounts[0],
  //   });
  //   this.setState({ loadingFinalize: false });
  //   Router.replaceRoute(`/coins/${this.props.address}/proposals`);
  // };

  render() {
    const { Row, Cell } = Table;
    const { id, proposal, beneficiary } = this.props;
    const { account } = this.context;
    const now = +new Date();
    const week = 604800;
    console.log("proposal.timestamp", proposal.timestamp);
    // const readyToFinalize = proposal.approvalCount > approversCount / 2;
    console.log("account", account);
    console.log("beneficiary", beneficiary);
    console.log("proposal.complete", proposal.complete);
    return (
      <Row
        disabled={proposal.complete || now > proposal.timestamp + week}
        positive={!proposal.complete || !now > proposal.timestamp + week}
      >
        <Cell>{id}</Cell>
        <Cell>{proposal.description}</Cell>
        <Cell>{web3.utils.fromWei(proposal.value, "ether")} ETH</Cell>
        <Cell>{proposal.recipient}</Cell>
        <Cell textAlign="center">
          {proposal.complete || now > proposal.timestamp + week ? null : (
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

export default ProposalRow;
