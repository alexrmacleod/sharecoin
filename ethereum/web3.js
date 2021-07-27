import Web3 from "Web3";
let web3;

if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
  // console.log("web3Metamask");
  // we are in the browser and metamask is running.
  window.ethereum.request({ method: "eth_requestAccounts" });
  web3 = new Web3(ethereum);
} else {
  // console.log("web3Server");
  // we are on the server *OR* the user is not running metamask
  // localhost
  const provider = new Web3(
    new Web3.providers.HttpProvider("http://localhost:8545")
  );
  // const provider = new Web3(Web3.givenProvider || 'http://localhost:8545');
  // rinkeby
  // const provider = new Web3.providers.HttpProvider("https://rinkeby.infura.io/v3/" + process.env.INFURA_API_KEY);
  web3 = new Web3(provider);
}

export default web3;
