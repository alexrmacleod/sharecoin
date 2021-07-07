const hre = require("hardhat");
const coinFactory = require("../artifacts/contracts/token/CoinFactory.sol/CoinFactory.json");
const helper = require("./helper");

async function main() {
  // web3 get accounts
  const accounts = await web3.eth.getAccounts();
  console.log(accounts);

  console.log("--------DEPLOY--------");

  // deploy coin factory
  const coinFactoryInstance = await new web3.eth.Contract(coinFactory.abi)
    .deploy({
      data: coinFactory.bytecode,
    })
    .send({
      gas: helper.gas,
      from: accounts[0],
      // value: web3.utils.toWei("0.01", "ether"), // set reserve in ETHContinuousToken
    });

  console.log("contract deployed:", coinFactoryInstance.options.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
