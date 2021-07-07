import web3 from "./web3.js";
import CoinFactory from "../artifacts/contracts/token/CoinFactory.sol/CoinFactory.json";

const address = {
  // localhost: "0x5FbDB2315678afecb367f032d93F642f64180aa3", // local without mnemonic
  localhost: "0x07eb6853aF0ff65dfee058F41D6CCD4f1384f09f", // local mnemonic
  rinkeby: "0x59a53dbaf94c433d7dd06052606b5efa8286ebf4",
};

// console.log("window.ethereum.isMetaMask", window.ethereum.isMetaMask);

const instance = new web3.eth.Contract(CoinFactory.abi, address.localhost);

export default instance;
