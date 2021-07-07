// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/access/Ownable.sol";
// import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../curves/BancorBondingCurve.sol";
import "../lib/ValidGasPrice.sol";
import "hardhat/console.sol";

abstract contract ContinuousToken is
    // Ownable,
    ERC20,
    BancorBondingCurve,
    ValidGasPrice
{
    using SafeMath for uint256;

    event Minted(address sender, uint256 amount, uint256 deposit);
    event Burned(address sender, uint256 amount, uint256 refund);

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _initialSupply,
        uint32 _reserveRatio
    ) payable ERC20(_name, _symbol) BancorBondingCurve(_reserveRatio) {
        _mint(msg.sender, _initialSupply);
    }

    function continuousSupply() public override view returns (uint256) {
        return totalSupply(); // Continuous Token total supply
    }

    function sponsoredBurn(uint256 _amount) public {
        _burn(msg.sender, _amount);
        emit Burned(msg.sender, _amount, 0);
    }

    function sponsoredBurnFrom(address _from, uint256 _amount) public {
        _burn(_from, _amount);
        emit Burned(msg.sender, _amount, 0);
    }

    function _continuousMint(uint256 _deposit)
        internal
        validGasPrice
        // updateAccount(msg.sender)
        returns (uint256)
    {
        require(_deposit > 0, "Deposit must be non-zero.");

        uint256 rewardAmount = getContinuousMintReward(_deposit);
        _mint(msg.sender, rewardAmount);
        emit Minted(msg.sender, rewardAmount, _deposit);

        // dividen tracker add account  
        // addAccount(msg.sender, uint256(0), uint256(0));

        return rewardAmount;
    }

    function _continuousBurn(uint256 _amount)
        internal
        validGasPrice
        // updateAccount(msg.sender)
        returns (uint256)
    {
        require(_amount > 0, "Amount must be non-zero.");
        require(
            balanceOf(msg.sender) >= _amount,
            "Insufficient tokens to burn."
        );

        uint256 refundAmount = getContinuousBurnRefund(_amount);
        _burn(msg.sender, _amount);
        emit Burned(msg.sender, _amount, refundAmount);

        // dividen tracker add account
        // addAccount(msg.sender, uint256(0), uint256(0));

        return refundAmount;
    }

    // dividen tracker
    // uint256 constant pointMultiplier = 10**18;

    // struct Account {
    //     uint256 balance;
    //     uint256 lastDividendPoints;
    //     bool used;
    // }

    // mapping(address => Account) accounts;
    // // uint256 totalSupply;
    // uint256 totalDividendPoints;
    // uint256 unclaimedDividends;
    
    // modifier updateAccount(address _account) {
    //     uint256 owing = dividendsOwing(_account);
    //     if(owing > 0) {
    //         unclaimedDividends -= owing;
    //         accounts[_account].balance += owing;
    //         accounts[_account].lastDividendPoints = totalDividendPoints;
    //         console.log("updateAccount: totalDividendPoints", totalDividendPoints);
    //         console.log("updateAccount: unclaimedDividends", unclaimedDividends);
    //         console.log("updateAccount: accounts[_account].balance", accounts[_account].balance);
    //         console.log("updateAccount: accounts[_account].lastDividendPoints", accounts[_account].lastDividendPoints);
    //     }
    //     _;
    // }

    // function dividendsOwing(address _account) internal view returns(uint256) {
    //     uint256 newDividendPoints = totalDividendPoints - accounts[_account].lastDividendPoints;
    //     console.log("dividendsOwing: newDividendPoints", newDividendPoints);
    //     // console.log("dividendsOwing: (accounts[_account].balance * newDividendPoints) / pointMultiplier", (accounts[_account].balance * newDividendPoints) / pointMultiplier);
    //     console.log("dividendsOwing: (balanceOf(_account) * newDividendPoints) / pointMultiplier", (balanceOf(_account) * newDividendPoints) / pointMultiplier);
    //     // return (accounts[_account].balance * newDividendPoints) / pointMultiplier;
    //     return (balanceOf(_account) * newDividendPoints) / pointMultiplier;
    // }

    // function disburse(uint256 _amount) public {
    //     totalDividendPoints += (_amount * pointMultiplier / totalSupply());
    //     // totalSupply += amount;
    //     unclaimedDividends += _amount;
    //     console.log("totalSupply()", totalSupply());
    //     console.log("totalDividendPoints", totalDividendPoints);
    //     console.log("unclaimedDividends", unclaimedDividends);
    // }

    // function addAccount(address _account, uint256 _balance, uint256 _lastDividendPoints) public {
    //     require(!accounts[_account].used);
    //     Account memory newAccount = Account({
    //         balance: _balance,
    //         lastDividendPoints: _lastDividendPoints,
    //         used: true
    //     });
    //     accounts[_account] = newAccount;
    //     console.log("addAccount: accounts[_account].balance", accounts[_account].balance);
    // }

    // // dividen claimer
    // function claim() public payable updateAccount(msg.sender) {
    //     require(accounts[msg.sender].balance > 0, "no dividen in your balance");
    //     require(balanceOf(msg.sender) > 0, "you need to own coins to earn dividens from the treasury");
    //     // uint256 amount = (dividen * balanceOf(msg.sender)) / totalSupply();
    //     uint256 amount = accounts[msg.sender].balance;
    //     console.log("claim: amount", amount);
    //     console.log("claim: before accounts[msg.sender].balance", accounts[msg.sender].balance);
    //     // payable(msg.sender).transfer(amount);
    //     accounts[msg.sender].balance = accounts[msg.sender].balance - amount;
    //     console.log("claim: after accounts[msg.sender].balance", accounts[msg.sender].balance);
    // }

    // function getAccountDividen() public view returns (uint256) {
    //     console.log("getAccountDividen: accounts[msg.sender].balance", accounts[msg.sender].balance);
    //     console.log("getAccountDividen: unclaimedDividends", unclaimedDividends);
    //     return accounts[msg.sender].balance;
    // }
}