import React, { Component } from "react";
import { Table, Button } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import Campaign from "../ethereum/campaign";
import { Router } from "../routes";

class RequestRow extends Component {
  state = {
    loadingApprove: false,
    loadingFinalize: false,
  };

  onApprove = async () => {
    this.setState({ loadingApprove: true });
    const campaign = await Campaign(this.props.address);
    const accounts = await web3.eth.getAccounts();
    await campaign.methods.approveRequest(this.props.id).send({
      from: accounts[0],
    });
    this.setState({ loadingApprove: false });
    Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
  };

  onFinalize = async () => {
    this.setState({ loadingFinalize: true });
    const campaign = await Campaign(this.props.address);
    const accounts = await web3.eth.getAccounts();
    await campaign.methods.finalizeRequest(this.props.id).send({
      from: accounts[0],
    });
    this.setState({ loadingFinalize: false });
    Router.replaceRoute(`/campaigns/${this.props.address}/requests`);
  };

  render() {
    const { Row, Cell } = Table;
    const { id, request, approversCount } = this.props;
    const readyToFinalize = request.approvalCount > approversCount / 2;
    return (
      <Row
        disabled={request.complete}
        positive={readyToFinalize && !request.comeplete}
      >
        <Cell>{id}</Cell>
        <Cell>{request.description}</Cell>
        <Cell>{web3.utils.fromWei(request.value, "ether")}</Cell>
        <Cell>{request.recipient}</Cell>
        <Cell>
          {request.approvalCount}/{approversCount}
        </Cell>
        <Cell>
          {request.complete ? null : (
            <Button
              color="green"
              content="Approve"
              basic
              loading={this.state.loadingApprove}
              onClick={this.onApprove}
            />
          )}
        </Cell>
        <Cell>
          {request.complete ? null : (
            <Button
              color="teal"
              content="Finalize"
              basic
              loading={this.state.loadingFinalize}
              onClick={this.onFinalize}
            />
          )}
        </Cell>
      </Row>
    );
  }
}

export default RequestRow;
