import React, { Component } from "react";
import { Button, Table } from "semantic-ui-react";
import { Link } from "../../../routes";
import Layout from "../../../components/Layout";
import Coin from "../../../ethereum/coin";
import ProposalRow from "../../../components/ProposalRow";

class ProposalIndex extends Component {
  static async getInitialProps(props) {
    const { address } = props.query;
    const coin = Coin(address);
    const proposalCount = await coin.methods.getProposalsCount().call();
    const beneficiary = await coin.methods.beneficiary().call();
    // const approversCount = await coin.methods.approversCount().call();
    const proposals = await Promise.all(
      Array(parseInt(proposalCount))
        .fill()
        .map((element, index) => {
          return coin.methods.proposals(index).call();
        })
    );
    return { address, proposals, proposalCount, beneficiary };
  }

  renderRows() {
    return this.props.proposals.map((proposal, index) => {
      return (
        <ProposalRow
          key={index}
          id={index}
          proposal={proposal}
          address={this.props.address}
          beneficiary={this.props.beneficiary.toLowerCase()}
        />
      );
    });
  }

  render() {
    const { Header, Row, HeaderCell, Body } = Table;
    return (
      <Layout>
        <h3>Proposals</h3>
        <div>Help this coin grow and create a proposal</div>
        <Link route={`/coins/${this.props.address}/proposals/new`}>
          <a>
            <Button
              primary
              content="Create Proposal"
              floated="right"
              icon="add"
              style={{ marginBottom: 10 }}
            />
          </a>
        </Link>
        <Table celled padded>
          <Header>
            <Row>
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Description</HeaderCell>
              <HeaderCell>Amount</HeaderCell>
              <HeaderCell>Recipient</HeaderCell>
              <HeaderCell>Approve</HeaderCell>
            </Row>
          </Header>
          <Body>{this.renderRows()}</Body>
        </Table>
        <div>Found {this.props.proposalCount} proposals</div>
      </Layout>
    );
  }
}

export default ProposalIndex;
