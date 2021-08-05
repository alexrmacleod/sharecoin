// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
// const hre = require("hardhat");
const ethContinuousToken = require("../artifacts/contracts/token/ETHContinuousToken.sol/ETHContinuousToken.json");
const coinFactory = require("../artifacts/contracts/token/CoinFactory.sol/CoinFactory.json");
// const paymentSplitter = require("../artifacts/@openzeppelin/contracts/finance/PaymentSplitter.sol/PaymentSplitter.json");

const helper = require("./helper");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // * Return = _supply * ((1 + _depositAmount / _reserveBalance) ^ (_reserveRatio / MAX_RESERVE_RATIO) - 1)
  // var r = helper.initialSupply * ((1 + 1 / 1) ^ (helper.reserveRatio / MAX_RESERVE_RATIO - 1));

  // web3
  console.log("--------BALACE--------");
  const accounts = await web3.eth.getAccounts();
  var balance1 = await web3.eth.getBalance(accounts[0]);
  var balance2 = await web3.eth.getBalance(accounts[1]);
  console.log("account1:", accounts[0]);
  console.log("balance1:", web3.utils.fromWei(balance1, "ether"));
  console.log("account2:", accounts[1]);
  console.log("balance2:", web3.utils.fromWei(balance2, "ether"));

  console.log("--------DEPLOY--------");

  const coinFactoryInstance = await new web3.eth.Contract(coinFactory.abi)
    .deploy({
      data: coinFactory.bytecode,
    })
    .send({
      gas: helper.gas,
      from: accounts[0],
      // value: web3.utils.toWei("0.01", "ether"), // set reserve in ETHContinuousToken
    });

  // deploy
  // const contract = await new web3.eth.Contract(ethContinuousToken.abi)
  //   .deploy({
  //     data: ethContinuousToken.bytecode,
  //     arguments: [
  //       helper.name,
  //       helper.symbol,
  //       // helper.decimals,
  //       helper.initialSupply,
  //       helper.reserveRatio,
  //       helper.description,
  //       helper.beneficiaryRewardRatio,
  //     ],
  //   })
  //   .send({
  //     gas: helper.gas,
  //     from: accounts[0],
  //     value: web3.utils.toWei("0.01", "ether"), // set reserve in ETHContinuousToken
  //   });

  console.log("contract deployed:", coinFactoryInstance.options.address);
  // console.log("contract deployed:", contract.options.address);

  console.log("--------CREATE COIN--------");
  await coinFactoryInstance.methods
    .createCoin(
      helper.name,
      helper.symbol,
      helper.description,
      helper.beneficiaryRewardRatio,
      // helper.decimals,
      accounts[0],
      helper.initialSupply,
      helper.reserveRatio,
      helper.ipfsHash
    )
    .send({
      gas: helper.gas,
      from: accounts[0],
      value: web3.utils.toWei("0.0000001", "ether"), // set reserve in ETHContinuousToken
    });
  // .then((value) => console.log("coin created:", value));

  console.log("--------GET COINS--------");
  var deployedCoins;
  await coinFactoryInstance.methods
    .getDeployedCoins()
    .call()
    .then((value) => {
      console.log("getDeployedCoins:", value);
      deployedCoins = value;
    });

  console.log("--------COIN INSTANCE--------");
  const [address] = deployedCoins;
  const contract = new web3.eth.Contract(ethContinuousToken.abi, address);
  await contract.methods
    .getSummary()
    .call()
    .then((value) => console.log(value));
  // .then((value) => console.log(web3.utils.fromWei(value, "ether")));

  // see all methods
  const methods = await contract.methods;
  console.log(methods);

  // await balance();
  // await mint(accounts[1]);
  // await mint(accounts[2]);
  // await contribute();
  // await contribute();
  // // await getAccountDividen(accounts[0]);
  // // await getAccountDividen(accounts[1]);
  // await claim(accounts[1]);
  // await claim(accounts[2]);
  // await contribute();
  // await contribute();
  // await claim(accounts[1]);
  // await claim(accounts[2]);
  // await claim(accounts[1]);
  // await claim(accounts[2]);
  // await claim(accounts[1]);
  // await claim(accounts[2]);
  // await balance();
  // // await getAccountDividen(accounts[0]);
  // // await getAccountDividen(accounts[1]);

  // await balance();
  // await price();
  // await contractState();
  // await mint(accounts[1]);
  // await beneficiaryRewards();
  // await price();
  // await contractState();
  // await mint(accounts[1]);
  // await beneficiaryRewards();
  // await price();
  // await contractState();
  // await mint(accounts[1]);
  // await beneficiaryRewards();
  // await balance();
  // await withdraw();
  // await balance();

  await balance();
  await contribute();
  await mint(accounts[1]);
  await mint(accounts[2]);
  await contribute();
  await mint(accounts[1]);
  await mint(accounts[1]);
  await mint(accounts[1]);
  await getDividen(accounts[1]);
  await getDividen(accounts[2]);
  await mint(accounts[1]);
  await mint(accounts[1]);
  await mint(accounts[1]);
  await release(accounts[1]);
  await release(accounts[2]);
  await contribute();
  await getDividen(accounts[1]);
  await getDividen(accounts[2]);
  await mint(accounts[1]);
  await mint(accounts[2]);
  await release(accounts[1]);
  await release(accounts[2]);
  await burn(accounts[1]);
  await burn(accounts[2]);
  await getDividen(accounts[1]);
  await getDividen(accounts[2]);

  // await contribute();
  // await burn(accounts[1]);
  // await release(accounts[3]);
  // await release(accounts[4]);
  // // await release(accounts[1]);
  // await release(accounts[2]);
  // // await mint(accounts[6]);
  // // await release(accounts[6]);
  // // await release(accounts[4]);
  // await balance();
  // // await release(accounts[1]);
  // // await release(accounts[2]);
  // // await release(accounts[3]);
  // // await release(accounts[4]);
  await balance();
  // // console.log("holders", holders);

  // console.log("--------SPLITTER--------");
  // const holders = await contract.methods.getHolders().call();
  // const details = await holders.map(async (address) => {
  //   // balance
  //   const balance = await contract.methods.balanceOf(address).call();
  //   return balance;
  // });
  // const balances = await Promise.all(details);

  // // console.log("splitter", splitter);
  // console.log("holders", holders);
  // console.log("balances", balances);

  // const splitterAddress = await contract.methods.splitterAddress().call();
  // contract.log("splitterAddress", splitterAddress);
  // // const splitterInstance = await new web3.eth.Contract(paymentSplitter.abi)
  // //   .deploy({
  // //     data: paymentSplitter.bytecode,
  // //     // arguments: [holders, balances],
  // //   })
  // //   .send({
  // //     gas: helper.gas,
  // //     from: accounts[0],
  // //     value: web3.utils.toWei("100", "ether"), // set reserve in ETHContinuousToken
  // //   });
  // const splitterInstance = await new web3.eth.Contract(
  //   paymentSplitter.abi,
  //   splitterAddress
  // ).send({
  //   gas: helper.gas,
  //   from: accounts[0],
  //   value: web3.utils.toWei("100", "ether"), // set reserve in ETHContinuousToken
  // });

  // // console.log("splitter deployed:", splitterInstance.options.address);
  // // console.log(splitterInstance);

  // await splitterInstance.methods.release(accounts[1]).send({
  //   gas: helper.gas,
  //   from: accounts[1],
  // });

  // await splitterInstance.methods.release(accounts[2]).send({
  //   gas: helper.gas,
  //   from: accounts[2],
  // });

  // await balance();

  async function beneficiaryRewards() {
    console.log("--------REWARDS--------");
    await contract.methods
      .beneficiaryRewards() // inside ERC20.sol
      .call()
      .then((value) =>
        console.log("beneficiaryRewards:", web3.utils.fromWei(value))
      );
  }

  // async function withdraw() {
  //   console.log("--------WITHDRAW--------");
  //   await contract.methods
  //     .owner()
  //     .call()
  //     .then((value) => console.log("owner", value));
  //   await contract.methods.withdraw(web3.utils.toWei("300", "ether")).send({
  //     gas: helper.gas,
  //     from: accounts[0],
  //     // value: web3.utils.toWei("0.01", "ether"),
  //   });
  // }

  async function balance() {
    console.log("--------BALACE--------");
    balance1 = await web3.eth.getBalance(accounts[1]);
    balance2 = await web3.eth.getBalance(accounts[2]);
    balance3 = await web3.eth.getBalance(accounts[3]);
    balance4 = await web3.eth.getBalance(accounts[4]);
    balance6 = await web3.eth.getBalance(accounts[6]);
    console.log("account1:", accounts[1]);
    console.log("balance1:", web3.utils.fromWei(balance1, "ether"));
    console.log("account2:", accounts[2]);
    console.log("balance2:", web3.utils.fromWei(balance2, "ether"));
    console.log("account3:", accounts[3]);
    console.log("balance3:", web3.utils.fromWei(balance3, "ether"));
    console.log("account4:", accounts[4]);
    console.log("balance4:", web3.utils.fromWei(balance4, "ether"));
    console.log("account6:", accounts[6]);
    console.log("balance6:", web3.utils.fromWei(balance6, "ether"));
  }

  async function price() {
    console.log("--------PRICE---------");
    // continious token price = reserve token balance / continious token supply * reserve ratio
    var supply;
    await contract.methods
      .continuousSupply()
      .call()
      .then((value) => (supply = value));
    var reserve;
    await contract.methods
      .reserveBalance()
      .call()
      .then((value) => (reserve = web3.utils.fromWei(value, "ether")));
    var price = reserve / (supply * (helper.reserveRatio / 1000000));
    console.log("price: ", price);
  }

  async function contractState() {
    // state
    console.log("--------CONTRACT STATE--------");
    await contract.methods
      .totalSupply() // inside ERC20.sol
      .call()
      .then((value) => console.log("supply bct:", value));
    await contract.methods
      .reserveBalance()
      .call()
      .then((value) =>
        console.log("reserve eth:", web3.utils.fromWei(value, "ether"))
      );
    await contract.methods
      .reserveRatio()
      .call()
      .then((value) => console.log("reserveRatio:", value));
    await contract.methods
      .getContinuousMintReward(web3.utils.toWei("0.001", "ether"))
      .call()
      .then((value) =>
        console.log(
          "0.001 eth gets:",
          web3.utils.fromWei(value, "ether"),
          "bct"
        )
      );
    await contract.methods
      .getContinuousMintReward(web3.utils.toWei("0.01", "ether"))
      .call()
      .then((value) =>
        console.log("0.01 eth gets:", web3.utils.fromWei(value, "ether"), "bct")
      );
    await contract.methods
      .getContinuousMintReward(web3.utils.toWei("1", "ether"))
      .call()
      .then((value) =>
        console.log("1 eth gets:", web3.utils.fromWei(value, "ether"), "bct")
      );
    // console.log("0.000044998987545559 BCT");
    await contract.methods
      .getContinuousMintReward(web3.utils.toWei("1000", "ether"))
      .call()
      .then((value) =>
        console.log("1k eth gets:", web3.utils.fromWei(value, "ether"), "bct")
      );
  }

  async function mint(account) {
    // mint
    console.log("--------MINT--------");
    await contract.methods.mint().send({
      gas: helper.gas,
      from: account,
      value: web3.utils.toWei(helper.mint, "ether"),
    });
    const balance = await contract.methods.balanceOf(account).call();
    console.log("balance", balance);
  }

  async function burn(account) {
    const balance = await contract.methods.balanceOf(account).call();
    const holders = await contract.methods.getHolders().call();
    console.log("holders", holders);
    console.log("balance", balance);
    console.log("holders.indexOf(account)", holders.indexOf(account));
    const divBalance = balance / 2;
    // mint
    console.log("--------BURN--------");
    await contract.methods.burn(divBalance, holders.indexOf(account)).send({
      gas: helper.gas,
      from: account,
    });
    const contribution = await contract.methods.contribution().call();
    console.log("contribution", contribution);
  }

  // async function disburse() {
  //   // mint
  //   console.log("--------DISBURSE--------");
  //   await contract.methods.disburse(web3.utils.toWei("10", "ether")).send({
  //     gas: helper.gas,
  //     from: accounts[0],
  //   });
  // }

  async function contribute() {
    // mint
    console.log("--------CONTRIBUTE--------");
    await contract.methods.contribute().send({
      gas: helper.gas,
      from: accounts[5],
      value: web3.utils.toWei("818", "ether"),
    });
  }

  async function release(account) {
    // release
    console.log("--------RELEASE--------");
    await contract.methods.release(account).send({
      gas: helper.gas,
      from: account,
    });
    const contribution = await contract.methods.contribution().call();
    console.log("contribution", contribution);
    console.log("account", account);
  }

  async function getDividen(account) {
    // getDividen
    console.log("--------DIVIDEN--------");
    const dividen = await contract.methods.getDividen(account).call();
    console.log("dividen ", dividen);
    console.log("account", account);
  }

  // async function getAccountDividen(account) {
  //   console.log("--------DIVIDEN--------");
  //   await contract.methods.getAccountDividen().send({
  //     gas: helper.gas,
  //     from: account,
  //   });
  // }

  // ethers.js
  // const accounts = await ethers.getSigners();
  // var balance1 = await ethers.provider.getBalance(accounts[0].address);
  // var balance2 = await ethers.provider.getBalance(accounts[1].address);
  // console.log("account1:", accounts[0].address);
  // console.log("balance1:", ethers.utils.formatEther(balance1.toString()));
  // console.log("account2:", accounts[1].address);
  // console.log("balance2:", ethers.utils.formatEther(balance2.toString()));

  // const factory = await ethers.getContractFactory("ETHContinuousToken");
  // const contract = await factory.deploy(
  //   "Basic Continuous Token",
  //   18,
  //   "1",
  //   "1000000",
  //   200000
  // );

  // console.log("ETHContinuousToken deployed to:", contract.address);
  // balance1 = await ethers.provider.getBalance(accounts[0].address);
  // balance2 = await ethers.provider.getBalance(accounts[1].address);
  // console.log("account1:", accounts[0].address);
  // console.log("balance1:", ethers.utils.formatEther(balance1.toString()));
  // console.log("account2:", accounts[1].address);
  // console.log("balance2:", ethers.utils.formatEther(balance2.toString()));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
