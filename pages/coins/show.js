import React, { Component } from "react";
import { Context } from "../../components/Context";
import {
  Card,
  Grid,
  Button,
  Divider,
  Menu,
  Header,
  Icon,
  Image,
} from "semantic-ui-react";
import Layout from "../../components/Layout";
import MintForm from "../../components/MintForm";
import BurnForm from "../../components/BurnForm";
import TransferForm from "../../components/TransferForm";
import WithdrawForm from "../../components/WithdrawForm";
import Coin from "../../ethereum/coin";
import { Link } from "../../routes";
import web3 from "../../ethereum/web3";
import ContributeForm from "../../components/ContributeForm";
import helper from "../../scripts/helper";

class CoinShow extends Component {
  state = { activeItem: "Buy" };
  static contextType = Context;

  handleItemClick = async (e, { name }) => {
    this.setState({ activeItem: name });
    this.renderForm(name);
  };

  claim = async () => {
    const { account } = this.context;
    const coin = await Coin(this.props.address);
    try {
      await coin.methods.claim().send({ from: account });
    } catch (error) {
      console.error(error);
    }
    console.log("claim");
  };

  sponsoredBurn = async () => {
    const { account } = this.context;
    const coin = await Coin(this.props.address);
    try {
      await coin.methods
        .sponsoredBurn(web3.utils.toWei("100000", "ether"))
        .send({ from: account });
    } catch (error) {
      console.error(error);
    }
    console.log("sponsoredBurn");
  };

  static async getInitialProps(props) {
    // get coin instance
    const coin = await Coin(props.query.address);
    // get summary
    const summary = await coin.methods.getSummary().call();
    // get price
    const price = await coin.methods
      .getContinuousMintReward(web3.utils.toWei("1", "ether"))
      .call();
    // get reserve
    const reserve = await coin.methods.reserveBalance().call();
    // get supply
    const supply = await coin.methods.continuousSupply().call();
    // get proposal count
    const proposalCount = await coin.methods.getProposalsCount().call();

    // // const start =
    // //   reserve ** (price / supply / ((500000 / 1000000) * 100) - 1) - 1;
    // // const rtr = start - 1;
    const a = web3.utils.fromWei(reserve, "ether") * Math.exp(1);
    const b =
      web3.utils.fromWei(price, "ether") / web3.utils.fromWei(supply, "ether");
    const c = Math.log(b);
    const d = 500000 / 1000000 - 1;
    const e = a ** (c / d);
    const f = e - 1;
    // const f = e - 1;
    console.log("a", a);
    console.log("b", b);
    console.log("c", c);
    console.log("d", d);
    console.log("e", e);
    console.log("f", f);

    // const rtr =
    //   reserve ** (Math.log(price / supply) / ((500000 / 1000000) * 100) - 1) -
    //   1;
    // // console.log(start);
    // // console.log("start");
    // // console.log(rtr);
    // // console.log("rtr");
    console.log("reserve", reserve);
    console.log("supply", supply);
    console.log("price", price);
    console.log("ratio", 500000 / 1000000);
    console.log("Math.log(price / supply)", Math.log(price / supply));
    console.log(
      "reserve ** (Math.log(price / supply)",
      reserve ** Math.log(price / supply)
    );
    console.log(
      "reserve ** (Math.log(price / supply) / ((500000 / 1000000) ",
      reserve ** Math.log(price / supply) / (500000 / 1000000 - 1)
    );
    console.log(
      "(reserve ** Math.log(price / supply) / (500000 / 1000000 - 1)) - 1",
      reserve *
        Math.exp(1) ** (Math.log(price / supply) / (500000 / 1000000 - 1)) -
        1
    );
    const answer =
      reserve * Math.exp(1) ** (Math.log(price / supply) / (0.5 - 1)) - 1;
    const finalAnswer = web3.utils.fromWei(answer.toString(), "ether");
    console.log("finalAnswer", finalAnswer);

    return {
      supply: web3.utils.fromWei(supply, "ether"),
      reserve: web3.utils.fromWei(reserve, "ether"),
      date: new Date().toString(),
      price: web3.utils.fromWei(price, "ether"),
      // price: d,
      address: props.query.address,
      name: summary[0],
      symbol: summary[1],
      description: summary[3],
      beneficiaryRewardRatio: summary[4],
      beneficiary: summary[5].toLowerCase(),
      beneficiaryRewards: web3.utils.fromWei(summary[6], "ether"),
      treasury: summary[7],
      ipfsHash: summary[8],
      holders: summary[9],
      proposalCount: proposalCount,
    };
  }

  renderForm(name) {
    switch (name) {
      case "Buy": {
        return (
          <MintForm
            address={this.props.address}
            label="ETH"
            color="green"
            activeItem={name}
            symbol={this.props.symbol}
          />
        );
        break;
      }
      case "Sell": {
        return (
          <BurnForm
            address={this.props.address}
            label={this.props.symbol}
            color="red"
            activeItem={name}
            symbol={this.props.symbol}
          />
        );
        break;
      }
      case "Transfer": {
        return (
          <TransferForm
            address={this.props.address}
            label={this.props.symbol}
            activeItem={name}
            symbol={this.props.symbol}
          />
        );
        break;
      }
      default: {
        console.log("default");
        break;
      }
    }
    return;
  }

  renderCards() {
    const {
      address,
      supply,
      reserve,
      name,
      symbol,
      balance,
      description,
      beneficiaryRewardRatio,
      beneficiary,
      beneficiaryRewards,
      treasury,
      ipfsHash,
      holders,
      proposalCount,
    } = this.props;

    const items = [
      // {
      //   image: `https://ipfs.io/ipfs/${ipfsHash}`,
      //   header: symbol,
      //   meta: name,
      //   description: description,
      // },
      {
        header: holders,
        meta: holders > 1 || holders < 1 ? "Holders" : "Holder",
        description: "The number of accounts that hold this coin.",
        stackable: "true",
      },
      {
        header: proposalCount,
        meta: "Improvement proposals",
        description:
          "Each proposal is active for 1 week. Only the coin beneficiary approves proposals.",
        stackable: "true",
      },
      {
        header: (beneficiaryRewardRatio / 1000000) * 100 + "%",
        meta: "Beneficiary Reward Ratio",
        description:
          "The founder of every coin can choose a beneficiary address to send a percentage of each coin purchase to",
        stackable: "true",
      },
      {
        header: beneficiary,
        meta: "Address of Beneficiary",
        description:
          "The proceeds from the beneficiary reward ratio can be withdrawn wtih this address",
        style: { overflowWrap: "break-word" },
        stackable: "true",
      },
      // {
      //   header: treasury,
      //   meta: "Treasury",
      //   description: "Contributed funds can be withdrawen by coin holders ",
      //   style: { overflowWrap: "break-word" },
      // },
      {
        header: address,
        meta: "Contract address",
        description:
          "This is the address of the coin. Add this address to your metamask to see balance",
        style: { overflowWrap: "break-word" },
        stackable: "true",
      },
      {
        header: reserve,
        meta: "Reserve",
        description: "The reserve in this coin",
        stackable: "true",
      },
      {
        header: supply,
        meta: "Supply",
        description: "The supply of this coin",
        stackable: "true",
      },
    ];
    return <Card.Group itemsPerRow={2} items={items} />;
  }

  render() {
    const { account } = this.context;
    const {
      treasury,
      reserve,
      symbol,
      name,
      ipfsHash,
      description,
      price,
      address,
      date,
      beneficiary,
      beneficiaryRewards,
    } = this.props;
    const { activeItem } = this.state;
    const contributeForm = <ContributeForm address={address} />;
    const withdrawForm = (
      <WithdrawForm
        address={address}
        beneficiary={beneficiary}
        beneficiaryRewards={beneficiaryRewards}
      />
    );
    const proposalButton = (
      <Link route={`/coins/${this.props.address}/proposals`}>
        <a>
          <Button content="View Proposals" primary />
        </a>
      </Link>
    );

    return (
      <Layout>
        <h3>{name}</h3>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>
              {/* <Image
                rounded
                bordered
                size="small"
                src={`https://ipfs.io/ipfs/${ipfsHash}`}
              /> */}
              <Card size="small" image={`https://ipfs.io/ipfs/${ipfsHash}`} />
              <Card
                header={symbol}
                meta={name}
                description={description}
                extra={proposalButton}
                fluid={true}
              />
              <Divider horizontal>
                <Header as="h4">
                  <Icon name="info" />
                  Coin details
                </Header>
              </Divider>
              <Grid.Column>{this.renderCards()}</Grid.Column>
            </Grid.Column>

            <Grid.Column width={6}>
              <Card fluid style={{ overflowWrap: "break-word" }}>
                <Card.Content>
                  <Card.Header>{price + " " + this.props.symbol}</Card.Header>
                  <Card.Meta>1 ether equals</Card.Meta>
                  <Card.Description>{date}</Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <Menu secondary>
                    <Menu.Item
                      color="green"
                      name="Buy"
                      active={activeItem === "Buy"}
                      onClick={this.handleItemClick}
                    />
                    <Menu.Item
                      color="red"
                      name="Sell"
                      active={activeItem === "Sell"}
                      onClick={this.handleItemClick}
                    />
                    <Menu.Item
                      name="Transfer"
                      active={activeItem === "Transfer"}
                      onClick={this.handleItemClick}
                    />
                  </Menu>
                  {this.renderForm(this.state.activeItem)}
                </Card.Content>
              </Card>
              <Card
                header={beneficiaryRewards + " ETH"}
                meta="Beneficiary Rewards"
                description="Rewards in ether from coin sales"
                fluid={true}
                extra={withdrawForm}
                style={{ overflowWrap: "break-word" }}
              />
              <Card
                header={treasury}
                meta="Treasury"
                description="Payout funds to all coin holders"
                fluid={true}
                extra={contributeForm}
                style={{ overflowWrap: "break-word" }}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default CoinShow;
