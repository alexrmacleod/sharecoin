import React, { Component } from "react";
import { Context } from "../components/Context";
import { Card, Button, Grid } from "semantic-ui-react";
import Layout from "../components/Layout";
import factory from "../ethereum/factory";
import { Link } from "../routes";

class Index extends Component {
  static contextType = Context;
  static async getInitialProps() {
    const coins = await factory.methods.getDeployedCoins().call();
    return { coins };
  }

  renderCoins() {
    const items = this.props.coins.map((address) => {
      return {
        header: address,
        description: (
          <Link route={`/coins/${address}`}>
            <a>View Coin</a>
          </Link>
        ),
        fluid: true,
      };
    });
    return <Card.Group items={items} />;
  }

  render() {
    const { connected } = this.context;
    return (
      <Layout>
        <div>
          <h3>Coins</h3>
          <Grid>
            <Grid.Row>
              <Grid.Column width={12}>{this.renderCoins()}</Grid.Column>
              <Grid.Column width={4}>
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
