import React, { Component } from "react";
import {
  Image,
  Button,
  Form,
  Input,
  Message,
  Grid,
  Divider,
  Header,
  Icon,
} from "semantic-ui-react";
import Layout from "../../components/Layout";
import factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import { Router } from "../../routes";
import helper from "../../scripts/helper";
import ipfs from "../../ethereum/ipfs";
import "react-image-crop/dist/ReactCrop.css";
import ReactCrop from "react-image-crop";
import gravatar from "gravatar";

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
    blob: null,
    file: false,
    buffer: null,
    avatar: null,
    croppedImageUrl: null,
    ipfsHash: "",
  };

  fileInputRef = React.createRef();

  reader = async () => {
    const gravatarBlob = await fetch(this.state.avatar).then((r) => r.blob());
    const reader = new window.FileReader();
    return new Promise((resolve, reject) => {
      reader.readAsArrayBuffer(this.state.file ? this.blob : gravatarBlob);
      reader.onload = () => {
        this.setState({ buffer: Buffer(reader.result) });
        resolve(reader.result);
      };
      reader.onerror = () => {
        reject("oops, something went wrong with the file reader.");
      };
    });
  };

  onSubmit = async (event) => {
    event.preventDefault();
    this.setState({ loading: true, errorMessage: "" });

    try {
      // read and buffer blob
      const buffer = await this.reader();
      // ipfs
      const result = await ipfs.add(buffer);
      this.setState({ ipfsHash: result.path });
      // create coin
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
          // value: web3.utils.toWei(this.state.value, "ether"),
        });
      Router.pushRoute("/");
    } catch (error) {
      this.setState({ errorMessage: error.message });
    }
    this.setState({ loading: false });
  };

  // ipfs
  fileChange = (event) => {
    event.preventDefault();
    // get file and feed to crop
    this.setState({ file: URL.createObjectURL(event.target.files[0]) });
  };

  onImageLoaded = (image) => {
    this.imageRef = image;
    const crop = {
      unit: "px",
      width: 400,
      height: 400,
      x: image.width / 2 - 200,
      y: image.height / 2 - 200,
    };
    this.setState({ crop: crop });
    this.makeClientCrop(crop);
    return false; // return false when setting crop state in here.
  };

  onCropComplete = (crop) => {
    this.makeClientCrop(crop);
  };

  onCropChange = (crop, percentCrop) => {
    // could also use percentCrop
    // this.setState({ crop: percentCrop });
    this.setState({ crop });
  };

  async makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        crop,
        "newFile.jpeg"
      );
      this.setState({ croppedImageUrl });
    }
  }

  getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          //reject(new Error('Canvas is empty'));
          console.error("Canvas is empty");
          return;
        }
        this.blob = blob;
        blob.name = fileName;
        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = window.URL.createObjectURL(blob);
        resolve(this.fileUrl);
      }, "image/jpeg");
    });
  }

  componentDidMount() {
    this.setState({
      avatar: gravatar.url(
        this.state.name,
        { s: "400", r: "x", d: "retro" },
        true
      ),
    });
    this.fileChange = this.fileChange.bind(this);
  }

  render() {
    const styles = {
      textAlign: "center",
      marginTop: "14px",
      // width: "300px",
      // height: "300px",
      borderRadius: "5px",
    };

    return (
      <Layout>
        <h3>Create a Coin</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Grid>
            <Grid.Row>
              <Grid.Column width={12}>
                <Form.Group widths="equal">
                  <Form.Field
                    control={Input}
                    label="Name"
                    placeholder="Basic Continuous Token"
                    maxLength="25"
                    value={this.state.name}
                    onChange={(event) => {
                      this.setState({
                        avatar: gravatar.url(
                          event.target.value,
                          { s: "400", r: "x", d: "retro" },
                          true
                        ),
                      });
                      this.setState({ name: event.target.value });
                    }}
                  />
                  <Form.Field
                    control={Input}
                    label="Symbol"
                    placeholder="BCT"
                    minLength="3"
                    maxLength="4"
                    value={this.state.symbol}
                    onChange={(event) =>
                      this.setState({
                        symbol: event.target.value.toUpperCase(),
                      })
                    }
                  />
                </Form.Group>
                <Form.Group widths="equal">
                  <Form.TextArea
                    // control={Input}
                    maxLength="2300"
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
                        this.setState({
                          beneficiaryRewardRatio: event.target.value,
                        })
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
                    onChange={(event) =>
                      this.setState({ value: event.target.value })
                    }
                  />
                </Form.Field>
                <Message
                  error
                  header="Oops!"
                  content={this.state.errorMessage}
                />
                <Button loading={this.state.loading} primary type="submit">
                  Create
                </Button>
              </Grid.Column>
              <Grid.Column width={4}>
                <Form.Field>
                  <label>Coin image</label>
                  <Image
                    hidden={!!this.state.file}
                    src={this.state.avatar}
                    size="medium"
                    rounded
                  />
                  <Image
                    hidden={!this.state.croppedImageUrl}
                    src={this.state.croppedImageUrl}
                    size="medium"
                    rounded
                  />
                  <Button
                    icon="upload"
                    type="file"
                    label={{ as: "a", basic: true, content: "Upload image" }}
                    labelPosition="right"
                    onClick={() => this.fileInputRef.current.click()}
                    style={{ marginTop: "14px" }}
                  />
                  <input
                    ref={this.fileInputRef}
                    type="file"
                    hidden
                    onChange={this.fileChange}
                  />
                  <Message
                    info
                    hidden={!this.state.file}
                    header="400x400 pixels"
                    content="Recommended dimensions for coin images."
                  />
                </Form.Field>
              </Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column>
                <Divider horizontal hidden={!this.state.file}>
                  <Header as="h4" hidden={!this.state.file}>
                    <Icon name="edit" hidden={!this.state.file} />
                    Edit image
                  </Header>
                </Divider>
                {this.state.file ? (
                  <ReactCrop
                    src={this.state.file}
                    crop={this.state.crop}
                    onImageLoaded={this.onImageLoaded}
                    onComplete={this.onCropComplete}
                    onChange={this.onCropChange}
                    locked={true}
                    style={styles}
                  />
                ) : null}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Form>
      </Layout>
    );
  }
}

export default CoinNew;
