import React, { Component } from "react";
import { Image, Button, Form, Input, Message, Label } from "semantic-ui-react";
import Layout from "../../components/Layout";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import { Router } from "../../routes";
import helper from "../../scripts/helper";
import ipfs from "../../ethereum/ipfs";
import "react-image-crop/dist/ReactCrop.css";
import ReactCrop from "react-image-crop";

class CoinNew extends Component {
  state = {
    name: "",
    symbol: "",
    description: "",
    beneficiaryRewardRatio: 10,
    beneficiary: "",
    value: "",
    errorMessage: "",
    loading: false,
    // file: null,
    buffer: null,
    ipfsHash: "QmaqtStzh9vaSeZvDNuMqpW3rPPCQDse9cxzXVUTwM4a6A",
    crop: {
      unit: "px",
      width: 50,
      height: 50,
      x: 25,
      y: 25,
    },
  };

  fileInputRef = React.createRef();

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({ loading: true, errorMessage: "" });
    try {
      console.log("here");
      const result = await ipfs.add(this.state.buffer);
      this.setState({ ipfsHash: result.path });
      console.log(result.path);
      // console.log(ipfs.cid);

      const accounts = await web3.eth.getAccounts();

      await factory.methods
        .createCoin(
          this.state.name,
          this.state.symbol,
          this.state.description,
          this.state.beneficiaryRewardRatio * 10000,
          this.state.beneficiary,
          helper.initialSupply,
          helper.reserveRatio,
          this.state.ipfsHash
        )
        .send({
          gas: helper.gas,
          from: accounts[0],
          value: web3.utils.toWei(this.state.value, "ether"),
        });
      Router.pushRoute("/");
    } catch (error) {
      this.setState({ errorMessage: error.message });
    }
    this.setState({ loading: false });
  };

  fileChange = (event) => {
    event.preventDefault();
    // onImageLoaded(event.target.files[0]);
    // this.setState({ file: event.target.files[0] }, () => {
    //   console.log("file chosen --->", this.state.file);
    // });
    // const file = event.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(event.target.files[0]);
    reader.onload = () => {
      this.setState({ buffer: Buffer(reader.result) });
      console.log("buffer --->", this.state.buffer);
    };
  };

  onChange = (crop) => {
    this.setState({ crop });
  };

  onImageLoaded = (image) => {
    console.log("on image load");
    this.setState({
      crop: {
        // unit: "px",
        width: 100,
        height: 100,
        x: image.width / 2 - 50,
        y: image.height / 2 - 50,
      },
    });

    return false; // Return false when setting crop state in here.
  };

  onCropChange = (crop, percentCrop) => this.setState({ crop: percentCrop });

  // CropDemo = (src) => {
  //   // const [crop, setCrop] = useState({ aspect: 16 / 9 });
  //   const { crop, setCrop } = this.state.aspect;
  //   console.log(this.state.aspect);

  //   return (
  //     <ReactCrop
  //       src={src}
  //       crop={crop}
  //       onChange={(newCrop) => this.setState({ crop: newCrop })}
  //     />
  //   );
  // };

  // fileUpload = (file) => {

  //   const url = "/some/path/to/post";
  //   const formData = new FormData();
  //   formData.append("file", file);
  //   const config = {
  //     headers: {
  //       "Content-type": "multipart/form-data",
  //     },
  //   };
  //   return put(url, formData, config);
  // };

  render() {
    return (
      <Layout>
        <h3>Create a Coin</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Group widths="equal">
            <Form.Field
              control={Input}
              label="Name"
              placeholder="Basic Continuous Token"
              value={this.state.name}
              onChange={(event) => this.setState({ name: event.target.value })}
            />
            <Form.Field
              control={Input}
              label="Symbol"
              placeholder="BCT"
              value={this.state.symbol}
              onChange={(event) =>
                this.setState({ symbol: event.target.value })
              }
            />
            {/* <Form.Field
              control={Input}
              maxLength="145"
              label="Description"
              placeholder="One Coin to rule them all"
              value={this.state.description}
              onChange={(event) =>
                this.setState({ description: event.target.value })
              }
            /> */}
          </Form.Group>
          <Form.Group widths="equal">
            <Form.TextArea
              // control={Input}
              maxLength="280"
              label="Description"
              placeholder="One Coin to rule them all"
              value={this.state.description}
              onChange={(event) =>
                this.setState({ description: event.target.value })
              }
            />
          </Form.Group>
          <Form.Group widths="equal">
            <Form.Field>
              <label>Beneficiary Reward Ratio</label>
              <Input
                fluid
                type="number"
                max={100}
                min={0}
                placeholder="10"
                label="%"
                labelPosition="right"
                value={this.state.beneficiaryRewardRatio}
                onChange={(event) =>
                  this.setState({ beneficiaryRewardRatio: event.target.value })
                }
              />
            </Form.Field>
            <Form.Field
              control={Input}
              label="Beneficiary Address"
              placeholder={helper.beneficiary}
              onChange={(event) =>
                this.setState({ symbol: event.target.value })
              }
              value={this.state.beneficiary}
              onChange={(event) =>
                this.setState({ beneficiary: event.target.value })
              }
            />
          </Form.Group>
          <Form.Field>
            <label>Value</label>
            <Input
              placeholder="1.00"
              label="ETH"
              labelPosition="right"
              value={this.state.value}
              onChange={(event) => this.setState({ value: event.target.value })}
            />
          </Form.Field>
          <Form.Field>
            <label>Coin image</label>
            <ReactCrop
              src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`}
              crop={this.state.crop}
              onChange={this.onChange}
              onImageLoaded={this.onImageLoaded}
              locked={true}
              style={{ borderRadius: "5px" }}
            />
            <Image
              hidden={!this.state.ipfsHash}
              src={`https://ipfs.io/ipfs/${this.state.ipfsHash}`}
              size="medium"
              rounded
            />
            <Button
              icon="upload"
              type="file"
              label={{ as: "a", basic: true, content: "Upload image" }}
              labelPosition="right"
              onClick={() => this.fileInputRef.current.click()}
            />
            <input
              ref={this.fileInputRef}
              type="file"
              hidden
              onChange={this.fileChange}
            />
          </Form.Field>
          <Message error header="Oops!" content={this.state.errorMessage} />
          <Button loading={this.state.loading} primary type="submit">
            Create
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default CoinNew;
