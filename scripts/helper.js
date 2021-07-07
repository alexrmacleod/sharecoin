const scale = 10 ** 18;
const helper = {
  name: "Basic Continuous Token",
  symbol: "BCT",
  decimals: 18,
  description: "One Coin to rule them all",
  beneficiaryRewardRatio: 100000, // reserve ratio, represented in ppm, 1-1000000, 500000 = 10% default
  beneficiary: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  beneficiaryRewards: 0,
  treasury: 0,
  initialSupply: scale.toString(), // no of tokens in ERC20.sol
  reserveRatio: 500000, // reserve ratio, represented in ppm, 1-1000000, 500000 = 50% = linear
  gas: "10000000",
  minReceived: 1,
  mint: "1",
};

module.exports = helper;
