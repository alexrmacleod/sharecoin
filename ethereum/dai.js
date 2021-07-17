import web3 from "./web3.js";
import ERC20 from "../artifacts/@openzeppelin/contracts/token/ERC20/ERC20.sol/ERC20.json";

const address = {
  dai: "0x6b175474e89094c44da98b954eedeac495271d0f",
  uscd: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
};

const instance = new web3.eth.Contract(ERC20.abi, address.dai);

export default instance;
