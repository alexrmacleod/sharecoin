require('dotenv').config();
const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const compiledFactory = require("../artifacts/contracts/token/CoinFactory.sol/CoinFactory.json");

// const provider = new HDWalletProvider(
//   process.env.MNENOMIC,
//   "https://rinkeby.infura.io/v3/" + process.env.INFURA_API_KEY
// );

// // hardhat localhost
const privateKeys = [
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80",
  "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d",
];
const provider = new HDWalletProvider("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80", "http://localhost:8545");

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();
  console.log(accounts);
  console.log("attempting to deploy from account", accounts[2]);

  const result = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data: compiledFactory.bytecode })
    .send({ gas: "10000000", from: accounts[2] });

  console.log("contract deployed to", result.options.address);
};

deploy();