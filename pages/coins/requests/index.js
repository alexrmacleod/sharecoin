import React, { Component } from "react";
import { Button, Table } from "semantic-ui-react";
import { Link } from "../../../routes";
import Layout from "../../../components/Layout";
import Coin from "../../../ethereum/coin";
import RequestRow from "../../../components/RequestRow";

class RequestIndex extends Component {
  static async getInitialProps(props) {
    const { address } = props.query;
    const coin = Coin(address);
    const requestCount = await coin.methods.getRequestsCount().call();
    const beneficiary = await coin.methods.beneficiary().call();
    // const approversCount = await coin.methods.approversCount().call();
    const requests = await Promise.all(
      Array(parseInt(requestCount))
        .fill()
        .map((element, index) => {
          return coin.methods.requests(index).call();
        })
    );
    return { address, requests, requestCount, beneficiary };
  }

  renderRows() {
    return this.props.requests.map((request, index) => {
      return (
        <RequestRow
          key={index}
          id={index}
          request={request}
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
        <h3>Requests</h3>
        <Link route={`/coins/${this.props.address}/requests/new`}>
          <a>
            <Button
              primary
              content="Add Requests"
              floated="right"
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
        <div>Found {this.props.requestCount} requests</div>
      </Layout>
    );
  }
}

export default RequestIndex;
