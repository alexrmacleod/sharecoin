import React, { Component } from "react";
import { Context } from "../../components/Context";
import { Card, Grid, Button, Input, Menu } from "semantic-ui-react";
import Layout from "../../components/Layout";
import MintForm from "../../components/MintForm";
import BurnForm from "../../components/BurnForm";
import TransferForm from "../../components/TransferForm";
import WithdrawForm from "../../components/WithdrawForm";
import Coin from "../../ethereum/coin";
import { Link } from "../../routes";
import web3 from "../../ethereum/web3";
import ContributeForm from "../../components/ContributeForm";

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

    return {
      supply: web3.utils.fromWei(supply, "ether"),
      reserve: web3.utils.fromWei(reserve, "ether"),
      date: new Date().toString(),
      price: web3.utils.fromWei(price, "ether"),
      address: props.query.address,
      name: summary[0],
      symbol: summary[1],
      description: summary[3],
      beneficiaryRewardRatio: summary[4],
      beneficiary: summary[5].toLowerCase(),
      beneficiaryRewards: web3.utils.fromWei(summary[6], "ether"),
      treasury: summary[7],
      ipfsHash: summary[8],
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
    } = this.props;

    const items = [
      {
        header: symbol,
        meta: name,
        description: description,
        style: { overflowWrap: "break-word" },
      },
      {
        header: (beneficiaryRewardRatio / 1000000) * 100 + "%",
        meta: "Beneficiary Reward Ratio",
        description:
          "The founder of every coin can choose a beneficiary address to send a percentage of each coin purchase to",
      },
      // {
      //   header: web3.utils.fromWei(beneficiaryRewards, "ether") + " ETH",
      //   meta: "Beneficiary Rewards",
      //   description: "Rewards in ether from coin sales",
      // },
      {
        header: beneficiary,
        meta: "Address of Beneficiary",
        description:
          "The proceeds from the beneficiary reward ratio can be withdrawn wtih this address",
        style: { overflowWrap: "break-word" },
      },
      {
        header: treasury,
        meta: "Treasury",
        description: "Contributed funds can be withdrawen by coin holders ",
        style: { overflowWrap: "break-word" },
      },
      {
        header: reserve,
        meta: "Reserve",
        description: "The reserve in this coin",
      },
      {
        header: supply,
        meta: "Supply",
        description: "The supply of this coin",
      },
    ];
    return <Card.Group items={items} />;
  }

  render() {
    const { account } = this.context;
    const { reserve, price, address, date, beneficiary, beneficiaryRewards } =
      this.props;

    const { activeItem } = this.state;
    return (
      <Layout>
        <h3>{this.props.address}</h3>
        <Grid>
          <Grid.Row>
            <Grid.Column width={9}>{this.renderCards()}</Grid.Column>
            <Grid.Column width={7}>
              <Card
                header={price + " " + this.props.symbol}
                meta="1 ether equals"
                description={date}
                fluid={true}
              />
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
              <Card
                header={beneficiaryRewards + " ETH"}
                meta="Beneficiary Rewards"
                description="Rewards in ether from coin sales"
                fluid={true}
              />
              <WithdrawForm
                address={address}
                beneficiary={beneficiary}
                beneficiaryRewards={beneficiaryRewards}
              />
              <Grid.Row>
                <ContributeForm address={address} />
              </Grid.Row>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Link route={`/coins/${this.props.address}/requests`}>
                <a>
                  <Button content="View Requests" primary />
                </a>
              </Link>
              <Button
                content="sponsoredBrun"
                primary
                onClick={this.sponsoredBurn}
              />
              <Button content="claim" primary onClick={this.claim} />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Layout>
    );
  }
}

export default CoinShow;
