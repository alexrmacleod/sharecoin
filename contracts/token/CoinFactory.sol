// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ETHContinuousToken.sol";
import "./ERC20ContinuousToken.sol";
import "hardhat/console.sol";

contract CoinFactory {
    address[] public deployedCoins;

    function createCoin(
        string memory _name,
        string memory _symbol,
        string memory _description,
        uint32 _beneficiaryRewardRatio,
        address _beneficiary,
        uint256 _initialSupply,
        uint32 _reserveRatio,
        string memory _ipfsHash
    ) public payable {
        ETHContinuousToken newCoin = new ETHContinuousToken(
            _name,
            _symbol,
            _initialSupply,
            _reserveRatio,
            _description,
            _beneficiaryRewardRatio,
            _beneficiary,
            // msg.value,
            _ipfsHash
        );
        deployedCoins.push(address(newCoin));
    }

    // function createCoinERC20(
    //     string memory _name,
    //     string memory _symbol,
    //     string memory _description,
    //     uint32 _beneficiaryRewardRatio,
    //     ERC20 _reserveToken,
    //     address _beneficiary,
    //     uint256 _initialSupply,
    //     uint32 _reserveRatio,
    //     string memory _ipfsHash
    // ) public payable {
    //     console.log("here");
    //     ERC20ContinuousToken newCoin = new ERC20ContinuousToken(
    //         _name,
    //         _symbol,
    //         _initialSupply,
    //         _reserveRatio,
    //         _reserveToken,
    //         _description,
    //         _beneficiaryRewardRatio,
    //         _beneficiary,
    //         // msg.value,
    //         _ipfsHash
    //     );
    //     console.log("here1");
    //     deployedCoins.push(address(newCoin));
    //     console.log("here2");
    // }

    function getDeployedCoins() public view returns (address[] memory) {
        return deployedCoins;
    }
}
