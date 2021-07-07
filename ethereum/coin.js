import web3 from "./web3.js";
import ETHContinuousToken from "../artifacts/contracts/token/ETHContinuousToken.sol/ETHContinuousToken.json";

const instance = (address) => {
  return new web3.eth.Contract(ETHContinuousToken.abi, address);
};

export default instance;
