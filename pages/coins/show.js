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
import Linkify from "linkifyjs/react";
// import * as linkify from "linkifyjs";
import "linkifyjs/plugins/hashtag"; // optional
import RewardForm from "../../components/RewardForm";
import DescriptionForm from "../../components/DescriptionForm";
import DividenForm from "../../components/DividenForm";
// import "linkifyjs/plugins/mention"; // causes text did not match server error
// import "linkifyjs/plugins/ticket"; //

class CoinShow extends Component {
  state = {
    dividen: 0,
    activeItem: "Buy",
    dividenActiveItem: "inactive",
    withdrawActiveItem: "inactive",
    beneficiaryActiveItem: "inactive",
    descriptionActiveItem: "inactive",
  };
  static contextType = Context;

  handleItemClick = async (e, { name }) => {
    this.setState({ activeItem: name });
    this.renderForm(name);
  };

  // claim = async () => {
  //   const { account } = this.context;
  //   const coin = await Coin(this.props.address);
  //   try {
  //     await coin.methods.claim().send({ from: account });
  //   } catch (error) {
  //     console.error(error);
  //   }
  //   console.log("claim");
  // };

  // sponsoredBurn = async () => {
  //   const { account } = this.context;
  //   const coin = await Coin(this.props.address);
  //   try {
  //     await coin.methods
  //       .sponsoredBurn(web3.utils.toWei("100000", "ether"))
  //       .send({ from: account });
  //   } catch (error) {
  //     console.error(error);
  //   }
  //   console.log("sponsoredBurn");
  // };

  static async getInitialProps(props) {
    // get coin instance
    const coin = await Coin(props.query.address);
    // get summary
    const summary = await coin.methods.getSummary().call();
    // get price
    const price = await coin.methods
      .getContinuousMintReward(web3.utils.toWei("1", "ether"))
      .call();
    // get it
    const burn = await coin.methods
      .getContinuousBurnRefund(web3.utils.toWei("1", "ether"))
      .call();
    // get reserve
    const reserve = await coin.methods.reserveBalance().call();
    // get supply
    const supply = await coin.methods.continuousSupply().call();
    // get proposal count
    const proposalCount = await coin.methods.getProposalsCount().call();
    // get dividen
    const dividen = await coin.methods.dividen().call();

    // // const start =
    // //   reserve ** (price / supply / ((500000 / 1000000) * 100) - 1) - 1;
    // // const rtr = start - 1;
    // const a = web3.utils.fromWei(reserve, "ether") * Math.exp(1);
    // const b =
    //   web3.utils.fromWei(price, "ether") / web3.utils.fromWei(supply, "ether");
    // const c = Math.log(b);
    // const d = 500000 / 1000000 - 1;
    // const e = a ** (c / d);
    // const f = e - 1;
    // // const f = e - 1;
    // console.log("a", a);
    // console.log("b", b);
    // console.log("c", c);
    // console.log("d", d);
    // console.log("e", e);
    // console.log("f", f);

    // // const rtr =
    // //   reserve ** (Math.log(price / supply) / ((500000 / 1000000) * 100) - 1) -
    // //   1;
    // // // console.log(start);
    // // // console.log("start");
    // // // console.log(rtr);
    // // // console.log("rtr");
    // console.log("reserve", reserve);
    // console.log("supply", supply);
    // console.log("price", web3.utils.fromWei(price, "ether"));
    // console.log("burn", web3.utils.fromWei(burn, "ether"));
    // console.log("ratio", 500000 / 1000000);
    // console.log("Math.log(price / supply)", Math.log(price / supply));
    // console.log(
    //   "reserve ** (Math.log(price / supply)",
    //   reserve ** Math.log(price / supply)
    // );
    // console.log(
    //   "reserve ** (Math.log(price / supply) / ((500000 / 1000000) ",
    //   reserve ** Math.log(price / supply) / (500000 / 1000000 - 1)
    // );
    // console.log(
    //   "(reserve ** Math.log(price / supply) / (500000 / 1000000 - 1)) - 1",
    //   reserve *
    //     Math.exp(1) ** (Math.log(price / supply) / (500000 / 1000000 - 1)) -
    //     1
    // );
    // const answer =
    //   reserve * Math.exp(1) ** (Math.log(price / supply) / (0.5 - 1)) - 1;
    // const finalAnswer = web3.utils.fromWei(answer.toString(), "ether");
    // console.log("finalAnswer", finalAnswer);

    return {
      supply: web3.utils.fromWei(supply, "ether"),
      reserve: web3.utils.fromWei(reserve, "ether"),
      date: new Date().toString(),
      price: web3.utils.fromWei(price, "ether"),
      address: props.query.address,
      name: summary[0],
      symbol: summary[1],
      description: web3.utils.hexToUtf8(summary[3]),
      beneficiaryRewardRatio: summary[4],
      beneficiary: summary[5],
      beneficiaryRewards: web3.utils.fromWei(summary[6], "ether"),
      treasury: web3.utils.fromWei(summary[7], "ether"),
      ipfsHash: summary[8],
      holders: summary[9],
      proposalCount: proposalCount,
    };
  }

  // client side web3 user data fetch
  async componentDidMount() {
    // get coin instance
    const coin = await Coin(this.props.address);
    // get dividen
    const accounts = await web3.eth.getAccounts();
    const dividen = await coin.methods.dividen().call({ from: accounts[0] });
    this.setState({ dividen: web3.utils.fromWei(dividen, "ether") });
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

  renderDescriptionForm(status) {
    switch (status) {
      case "inactive": {
        return (
          <a onClick={() => this.setState({ descriptionActiveItem: "active" })}>
            <Icon name="edit" />
            Edit
          </a>
        );
        break;
      }
      case "active": {
        return (
          <DescriptionForm
            address={this.props.address}
            description={this.props.description}
            onClick={(value) => this.setState({ descriptionActiveItem: value })}
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

  renderDividenForm(status) {
    switch (status) {
      case "inactive": {
        return (
          <a onClick={() => this.setState({ dividenActiveItem: "active" })}>
            <Icon name="edit" />
            Claim
          </a>
        );
      }
      case "active": {
        return (
          <DividenForm
            address={this.props.address}
            dividen={this.state.dividen}
            onClick={(value) => this.setState({ dividenActiveItem: value })}
          />
        );
      }
      default: {
        console.log("default");
        break;
      }
    }
    return;
  }

  renderWithdrawForm(status) {
    switch (status) {
      case "inactive": {
        return (
          <a onClick={() => this.setState({ withdrawActiveItem: "active" })}>
            <Icon name="edit" />
            Withdraw
          </a>
        );
      }
      case "active": {
        return (
          <WithdrawForm
            address={this.props.address}
            beneficiary={this.props.beneficiary}
            beneficiaryRewards={this.props.beneficiaryRewards}
            onClick={(value) => this.setState({ withdrawActiveItem: value })}
          />
        );
      }
      default: {
        console.log("default");
        break;
      }
    }
    return;
  }

  renderBeneficiaryForm(status) {
    switch (status) {
      case "inactive": {
        return (
          <a onClick={() => this.setState({ beneficiaryActiveItem: "active" })}>
            <Icon name="edit" />
            Edit
          </a>
        );
      }
      case "active": {
        return (
          <RewardForm
            address={this.props.address}
            beneficiaryRewardRatio={this.props.beneficiaryRewardRatio}
            onClick={(value) => this.setState({ beneficiaryActiveItem: value })}
          />
        );
      }
      default: {
        console.log("default");
        break;
      }
    }
    return;
  }

  renderCards() {
    const { connected, account } = this.context;
    const {
      address,
      supply,
      reserve,
      beneficiaryRewardRatio,
      beneficiary,
      beneficiaryRewards,
      holders,
      proposalCount,
    } = this.props;

    // const withdrawForm = (
    //   <WithdrawForm
    //     address={address}
    //     beneficiary={beneficiary}
    //     beneficiaryRewards={beneficiaryRewards}
    //   />
    // );

    const viewProposal = (
      <Link route={`/coins/${address}/proposals`}>
        <a>
          <Icon name="eye" />
          View{" "}
          {proposalCount > 1 || proposalCount < 1 ? "Proposals" : "Proposal"}
        </a>
      </Link>
    );

    const items = [
      {
        header: holders,
        meta: holders > 1 || holders < 1 ? "Holders" : "Holder",
        description: "The number of accounts that hold this coin.",
        stackable: "true",
      },
      {
        header: proposalCount,
        meta: proposalCount > 1 || proposalCount < 1 ? "Proposals" : "Proposal",
        description: "The number of proposals to improve the coin.",
        stackable: "true",
        extra: viewProposal,
      },
      {
        header: (beneficiaryRewardRatio / 1000000) * 100 + "%",
        meta: "Beneficiary Reward Ratio",
        description:
          "The founder of every coin can choose a beneficiary address to send a percentage of each coin purchase to",
        stackable: "true",
        extra:
          !connected || account !== beneficiary.toLowerCase()
            ? null
            : this.renderBeneficiaryForm(this.state.beneficiaryActiveItem),
      },
      {
        header: beneficiaryRewards + " ETH",
        meta: "Beneficiary Rewards",
        description: "Rewards in ether from coin sales.",
        fluid: true,
        style: { overflowWrap: "break-word" },
        extra:
          !connected || account !== beneficiary.toLowerCase()
            ? null
            : this.renderWithdrawForm(this.state.withdrawActiveItem),
      },
      {
        header: this.state.dividen + " ETH",
        meta: "Dividens",
        description: "Your share of the contributed funds in the treasury.",
        style: { overflowWrap: "break-word" },
        extra:
          !connected || this.state.dividen === null || this.state.dividen <= 0
            ? null
            : this.renderDividenForm(this.state.dividenActiveItem),
      },
      {
        header: beneficiary,
        meta: "Address of Beneficiary",
        description:
          "The proceeds from the beneficiary reward ratio can be withdrawn wtih this address",
        style: { overflowWrap: "break-word" },
        stackable: "true",
      },
      {
        header: address,
        meta: "Contract Address",
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
    const { account, connected } = this.context;
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

    // const proposalButton = (
    //   <Link route={`/coins/${this.props.address}/proposals`}>
    //     <a>
    //       <Button content="View Proposals" floated="right" primary />
    //     </a>
    //   </Link>
    // );

    // const editDescription = (
    //   <a onClick={() => this.setState({ descriptionActiveItem: "active" })}>
    //     <Icon name="edit" />
    //     Edit
    //   </a>
    // );

    return (
      <Layout>
        <h3>{name}</h3>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>
              <Image
                rounded
                bordered
                size="small"
                src={`https://ipfs.io/ipfs/${ipfsHash}`}
              />
              {/* <Card size="small" image={`https://ipfs.io/ipfs/${ipfsHash}`} /> */}
              <Card fluid={true}>
                <Card.Content>
                  <Card.Header>{symbol}</Card.Header>
                  <Card.Meta>{name}</Card.Meta>
                  <Card.Description style={{ whiteSpace: "pre-line" }}>
                    <Linkify options={{ ignoreTags: ["style"] }}>
                      {description}
                    </Linkify>
                  </Card.Description>
                </Card.Content>
                {!connected ||
                account !== this.props.beneficiary.toLowerCase() ? null : (
                  <Card.Content extra>
                    {this.renderDescriptionForm(
                      this.state.descriptionActiveItem
                    )}
                  </Card.Content>
                )}
              </Card>
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
                  <Card.Meta>1 Ether Equals</Card.Meta>
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
              {/* <Card
                header={beneficiaryRewards + " ETH"}
                meta="Beneficiary Rewards"
                description="Rewards in ether from coin sales"
                fluid={true}
                extra={withdrawForm}
                style={{ overflowWrap: "break-word" }}
              /> */}
              <Card
                header={treasury + " ETH"}
                meta="Treasury"
                description="Contribute funds to all coin holders"
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
