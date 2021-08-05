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
    released: 0,
    dividen: 0,
    activeItem: "Buy",
    detailActiveItem: "Details",
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

  handleDetailItemClick = async (e, { name }) => {
    this.setState({ detailActiveItem: name });
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
    // get holders
    const holders = await coin.methods.getHolders().call();
    // get payees
    const payees = await coin.methods.getPayees().call();
    // get totalReased
    const totalReleased = await coin.methods.totalReleased().call();
    console.log("totalReleased", totalReleased);
    console.log("holders", holders);
    console.log("payees", payees);
    // get holder balances
    const details = await payees.map(async (address) => {
      // balance
      const balance = await coin.methods.balanceOf(address).call();
      console.log("balance1", balance);
      // shares
      const shares = await coin.methods.shares(address).call();
      console.log("shares2", shares);
      // price
      const price = await coin.methods.getContinuousBurnRefund(balance).call();
      // dividen
      const dividen = await coin.methods.getDividen(address).call();
      // const dividen = "0";
      console.log("dividen", dividen);
      return {
        address: address,
        balance: web3.utils.fromWei(balance, "ether"),
        price: web3.utils.fromWei(price, "ether"),
        dividen: web3.utils.fromWei(dividen, "ether"),
      };
    });
    // holder promises
    // const balances = await Promise.all(details.balance);
    const promises = await Promise.all(details);
    // console.log(holderPromises);
    // get dividen
    // const dividen = await coin.methods.getDividen().call();

    // const dividen = await web3.eth.getBalance(props.query.address);
    // console.log("dividen", dividen);
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
      contribution: web3.utils.fromWei(summary[7], "ether"),
      ipfsHash: summary[8],
      holderCount: summary[9],
      proposalCount: proposalCount,
      holders: holders,
      promises: promises,
      payees: payees,
      totalReleased: web3.utils.fromWei(totalReleased, "ether"),
      componentDidUpdate: false,
      // dividen: web3.utils.fromWei(dividen, "ether"),
    };
  }

  updateDividen = async () => {
    const { connected, account } = this.context;
    if (!connected) {
      const coin = await Coin(this.props.address);
      const accounts = await web3.eth.getAccounts();
      console.log("accounts", accounts[0]);
      const shares = await coin.methods.shares(accounts[0]).call();
      console.log("shares", shares);
      const dividen = await coin.methods.getDividen(accounts[0]).call();
      console.log("dividen.state", dividen);
      this.setState({ dividen: web3.utils.fromWei(dividen, "ether") });
    }
  };

  async componentDidUpdate(prevProps) {
    //only run this when contribution is made
    if (this.props.contribution !== prevProps.contribution) {
      this.updateDividen();
    }
  }

  // client side web3 user data fetch
  async componentDidMount() {
    this.updateDividen();
  }

  renderHolders() {
    const { holders, payees, promises, symbol } = this.props;
    const items = holders.map((address, index) => {
      return (
        <Card fluid={true} key={index}>
          <Card.Content>
            <Card.Header>
              <a href={"https://etherscan.io/address/" + holders[index]}>
                {holders[index]}
              </a>
            </Card.Header>
            <Card.Meta>
              {Math.round(promises[index].balance * 100) / 100 +
                ` ` +
                symbol +
                ` ~ ` +
                Math.round(promises[index].price * 100) / 100 +
                ` ETH`}
            </Card.Meta>
          </Card.Content>
        </Card>
      );
    });
    return <Card.Group stackable={true}>{items}</Card.Group>;
  }

  renderDividens() {
    const { payees, promises, symbol } = this.props;
    // const { dividenPromises } = this.state;

    const items = payees.map((address, index) => {
      return (
        <Card fluid={true} key={index}>
          <Card.Content>
            <Card.Header>
              <a href={"https://etherscan.io/address/" + payees[index]}>
                {payees[index]}
              </a>
            </Card.Header>
            <Card.Meta>
              {Math.round(promises[index].balance * 100) / 100 +
                ` ` +
                symbol +
                ` ~ ` +
                Math.round(promises[index].dividen * 100) / 100 +
                ` ETH`}
            </Card.Meta>
          </Card.Content>
        </Card>
      );
    });
    return <Card.Group stackable={true}>{items}</Card.Group>;
  }

  renderDividenCards() {
    const { connected } = this.context;
    const { totalReleased } = this.props;
    const { dividen, released } = this.state;

    const items = [
      {
        header: dividen + " ETH",
        meta: "Dividens",
        description: "Your share of the contributed ether.",
        stackable: "true",
        extra:
          !connected || dividen === 0
            ? null
            : this.renderDividenForm(this.state.dividenActiveItem),
      },
      {
        header: Math.round(totalReleased * 100) / 100 + " ETH",
        meta: "Total released",
        description: "The total amount of ether already released.",
        stackable: "true",
      },
    ];
    return <Card.Group itemsPerRow={2} items={items} />;
  }

  renderDetail(name) {
    const { connected, account } = this.context;
    switch (name) {
      case "Details": {
        return <Grid.Column>{this.renderCards()}</Grid.Column>;
        break;
      }
      case "Holders": {
        return <Grid.Column>{this.renderHolders()}</Grid.Column>;
        break;
      }
      case "Dividens": {
        return (
          <Grid.Column>
            {this.renderDividenCards()}
            {this.renderDividens()}
          </Grid.Column>
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
            holders={this.props.holders}
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

  // renderDividenButton(status) {
  //   switch (status) {
  //     case "inactive": {
  //       return (
  //         <a onClick={() => this.setState({ descriptionActiveItem: "active" })}>
  //           <Icon name="edit" />
  //           Edit
  //         </a>
  //       );
  //       break;
  //     }
  //     case "active": {
  //       return (
  //         <DescriptionForm
  //           address={this.props.address}
  //           description={this.props.description}
  //           onClick={(value) => this.setState({ descriptionActiveItem: value })}
  //         />
  //       );
  //       break;
  //     }
  //     default: {
  //       console.log("default");
  //       break;
  //     }
  //   }
  //   return;
  // }

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
            onClick={(value) => {
              this.setState({ dividenActiveItem: value });
              // after release set dividen to 0
              this.setState({ dividen: 0 });
            }}
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
      symbol,
      address,
      supply,
      reserve,
      beneficiaryRewardRatio,
      beneficiary,
      beneficiaryRewards,
      holderCount,
      proposalCount,
    } = this.props;

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
        header: holderCount,
        meta: holderCount > 1 || holderCount < 1 ? "Holders" : "Holder",
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
        header: beneficiary,
        meta: "Beneficiary Address",
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
        header: reserve + " ETH",
        meta: "Reserve",
        description: "The reserve in this coin",
        stackable: "true",
      },
      {
        header: supply + " " + symbol,
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
      contribution,
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
    const { activeItem, detailActiveItem } = this.state;
    const contributeForm = (
      <ContributeForm
        holders={this.props.holders}
        balances={this.props.balances}
        address={address}
      />
    );

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
              {/* <Divider horizontal>
                <Header as="h4">
                  <Icon name="info" />
                  Coin details
                </Header>
              </Divider> */}

              <Menu secondary>
                <Menu.Item
                  name="Details"
                  active={detailActiveItem === "Details"}
                  onClick={this.handleDetailItemClick}
                />
                <Menu.Item
                  name="Holders"
                  active={detailActiveItem === "Holders"}
                  onClick={this.handleDetailItemClick}
                />
                <Menu.Item
                  name="Dividens"
                  active={detailActiveItem === "Dividens"}
                  onClick={this.handleDetailItemClick}
                />
              </Menu>
              {this.renderDetail(this.state.detailActiveItem)}
              {/* <Grid.Column>{this.renderCards()}</Grid.Column> */}
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
                header={Math.round(contribution * 100) / 100 + " ETH"}
                meta="Contribution"
                description="Contribute ether to coin holders proportional to the percentage of total coins they own."
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
