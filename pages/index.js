import React, { Component } from "react";
import { Context } from "../components/Context";
import { Card, Button, Grid, Image, Icon } from "semantic-ui-react";
import Layout from "../components/Layout";
import factory from "../ethereum/factory";
import { Link } from "../routes";
import Coin from "../ethereum/coin";
import web3 from "../ethereum/web3";

class Index extends Component {
  static contextType = Context;
  static async getInitialProps() {
    const coins = await factory.methods.getDeployedCoins().call();
    const promises = await coins.map(async (address) => {
      const coin = await Coin(address);
      // summary
      const summary = await coin.methods.getSummary().call();
      // price
      const priceWei = await coin.methods
        .getContinuousMintReward(web3.utils.toWei("1", "ether"))
        .call();
      const price = await web3.utils.fromWei(priceWei, "ether");
      return { summary, price };
    });
    const summarys = await Promise.all(promises);
    return { coins, summarys };
  }

  renderCoins() {
    const { coins, summarys } = this.props;
    const items = coins.map((address, index) => {
      return (
        <Card fluid={true} key={index}>
          <Card.Content>
            <Image
              rounded
              floated="right"
              size="mini"
              src={`https://ipfs.io/ipfs/${summarys[index].summary[8]}`}
            />
            <Card.Header>
              <Link route={`/coins/${address}`}>
                <a>{summarys[index].summary[0]}</a>
              </Link>
            </Card.Header>
            <Card.Meta>
              1 ETH ={" "}
              {Math.round(summarys[index].price * 100) / 100 +
                ` ` +
                summarys[index].summary[1]}
            </Card.Meta>
            <Card.Description>
              {summarys[index].summary[3].length > 127
                ? summarys[index].summary[3].substring(0, 127) + "..."
                : summarys[index].summary[3]}
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            <Icon name="user" />
            {summarys[index].summary[9]}{" "}
            {summarys[index].summary[9] > 1 || summarys[index].summary[9] < 1
              ? "Holders"
              : "Holder"}
          </Card.Content>
        </Card>
      );
    });
    return (
      <Card.Group itemsPerRow={2} stackable={true}>
        {items}
      </Card.Group>
    );
  }

  render() {
    const { connected } = this.context;
    return (
      <Layout>
        <div>
          <h3>Coins</h3>
          <Grid>
            <Grid.Row>
              <Grid.Column width={13}>{this.renderCoins()}</Grid.Column>
              <Grid.Column width={3}>
                <Link route="/coins/new">
                  <a>
                    <Button
                      disabled={!connected}
                      floated="right"
                      content="Create Coin"
                      icon="add"
                      primary
                    />
                  </a>
                </Link>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </Layout>
    );
  }
}

export default Index;
