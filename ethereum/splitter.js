import web3 from "./web3.js";
import PaymentSplitter from "../artifacts/@openzeppelin/contracts/finance/PaymentSplitter.sol/PaymentSplitter.json";

const instance = (address) => {
  return new web3.eth.Contract(PaymentSplitter.abi, address);
};

export default instance;
