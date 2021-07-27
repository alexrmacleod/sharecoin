// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./ContinuousToken.sol";
import "hardhat/console.sol";

contract ETHContinuousToken is Ownable, ContinuousToken {
    string public coinName;
    string public coinSymbol;
    uint256 internal reserve;
    string public description;
    uint32 public beneficiaryRewardRatio;
    address public beneficiary;
    uint256 public beneficiaryRewards;
    uint256 public beneficiaryReward;
    string public ipfsHash;
    // address public treasury;
    uint256 public treasury;
    uint256 constant public scale = 10**18;
    uint public holders;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _initialSupply,
        uint32 _reserveRatio,
        string memory _description,
        uint32 _beneficiaryRewardRatio,
        address _beneficiary, // init msg.sender
        // uint256 _value, // init msg.value
        string memory _ipfsHash
    )
        payable
        ContinuousToken(
            _name,
            _symbol,
            _initialSupply,
            _reserveRatio
        )
    {
        coinName = _name;
        coinSymbol = _symbol;
        reserve = 10**18;// _value; // this used to be msg.value is it ok to start a bonding curve with fake ether?
        description = _description;
        beneficiaryRewardRatio = _beneficiaryRewardRatio;
        beneficiary = _beneficiary;
        ipfsHash = _ipfsHash;
        transferOwnership(_beneficiary);
    }

    function mint() public payable {
        // count holders
        if(balanceOf(msg.sender) <= 0) {
            holders += 1;
        }

        beneficiaryReward = msg.value * beneficiaryRewardRatio / 1000000;
        beneficiaryRewards += beneficiaryReward;
        uint256 purchaseAmount = msg.value - beneficiaryReward;
        _continuousMint(purchaseAmount);
        reserve = reserve += purchaseAmount;
    }

    function burn(uint256 _amount) public payable {
        uint256 refundAmount = _continuousBurn(_amount);
        reserve = reserve - refundAmount;
        payable(msg.sender).transfer(refundAmount);

        // decrement holders
        if(balanceOf(msg.sender) <= 0) {
            holders -= 1;
        }
    }

    function reserveBalance() public override view returns (uint256) {
        return reserve;
    }

    // function price() public view returns (uint32) {
    //     // generalLog(x)
    //     // generalExp(x,x)
    //     return (reserve * generalExp(generalLog(getContinuousMintReward(scale)/totalSupply()),scale)/beneficiaryRewardRatio-1) -1;
    // }

    // get summary 

    function getSummary()
        public
        view
        returns (
            string memory,
            string memory,
            uint,
            string memory,
            uint32,
            address,
            uint256,
            uint256,
            string memory,
            uint
        )
    {
        return (
            coinName,
            coinSymbol,
            address(this).balance,
            description,
            beneficiaryRewardRatio,
            beneficiary,
            beneficiaryRewards,
            treasury,
            ipfsHash,
            holders
        );
    }

    // anyone can fund the treasury only coin holders have a claim on the deposits

    // function contribute() public payable {
    //     require(msg.value > minimumContribution);

    //     approvers[msg.sender] = true;
    //     approversCount++;
    // }

    // only beneficiary can withdraw
    function withdraw(uint256 _amount) public payable onlyOwner {
        require(beneficiaryRewards > 0, "no rewards to withdraw");
        require(_amount > 0 && _amount <= beneficiaryRewards, "withdraw amount outside the range of beneficiary rewards");
        payable(msg.sender).transfer(_amount);
        beneficiaryRewards = beneficiaryRewards - _amount;
    }

    // Proposal functions

    struct Proposal {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint timestamp;
    }

    Proposal[] public proposals;

    // address public manager;
    // uint public minimumContribution;
    // mapping(address => bool) public approvers;
    // uint public approversCount;

    // modifier restricted() {
    //     require(msg.sender == manager);
    //     _;
    // }

    function createProposal(string memory _description, uint _value) public {
        Proposal memory newProposal = Proposal({
           description: _description,
           value: _value,
           recipient: msg.sender,
           complete: false,
           timestamp: block.timestamp
        });
        proposals.push(newProposal);
    }

    function approveProposal(uint _index) public payable onlyOwner {
        Proposal storage proposal = proposals[_index];
        require(!proposal.complete);
        payable(proposal.recipient).transfer(proposal.value);
        proposal.complete = true;
    }

    function getProposalsCount() public view returns (uint) {
        return proposals.length;
    }

    function updateBeneficiaryRewardRatio(uint32 _beneficiaryRewardRatio) public onlyOwner {
        beneficiaryRewardRatio = _beneficiaryRewardRatio;
    }

    function updateDescription(string memory _description) public onlyOwner {
        description = _description;
    }

    // treasury
    struct Dividen {
        uint amount;
        uint timestamp;
        bool claimed;
    }

    mapping(address => Dividen) dividens;

    function contribute() public payable {
        require(msg.value > 0);
        treasury += msg.value;
    }

    function dividen() public view returns (uint256) {
        return treasury * balanceOf(msg.sender) / totalSupply();
    }

    function claim(uint256 _amount) public payable {
        require(balanceOf(msg.sender) > 0, "you need to own this coin to earn dividens");
        uint amount = treasury * balanceOf(msg.sender) / totalSupply();
        require(_amount <= amount, "amount is too large");
        if (_amount < amount) {
            payable(msg.sender).transfer(_amount);
        } else {
            payable(msg.sender).transfer(amount);
        }

        // Dividen memory newDividen = Dividen({
        //     amount: amount,
        //     timestamp: block.timestamp,
        //     claimed: true
        // });

        // dividens[msg.sender] = newDividen;
    }
}