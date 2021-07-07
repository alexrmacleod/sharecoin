// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./ETHContinuousToken.sol";

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
            msg.value,
            _ipfsHash
        );
        deployedCoins.push(address(newCoin));
    }

    function getDeployedCoins() public view returns (address[] memory) {
        return deployedCoins;
    }
}
