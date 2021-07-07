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
    address public treasury;
    uint256 public dividen;
    uint256 constant public scale = 10**18;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _initialSupply,
        uint32 _reserveRatio,
        string memory _description,
        uint32 _beneficiaryRewardRatio,
        address _beneficiary, // init msg.sender
        uint256 _value, // init msg.value
        string _ipfsHash
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
        reserve =  _value;// 10**18; // this used to be msg.value is it ok to start a bonding curve with fake ether?
        description = _description;
        beneficiaryRewardRatio = _beneficiaryRewardRatio;
        beneficiary = _beneficiary;
        ipfsHash = _ipfsHash;
        transferOwnership(_beneficiary);
    }

    function mint() public payable {
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
    }

    function reserveBalance() public override view returns (uint256) {
        return reserve;
    }

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
            string
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
            dividen,
            ipfsHash
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

    // request functions

    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint timestamp;
    }

    Request[] public requests;

    // address public manager;
    // uint public minimumContribution;
    // mapping(address => bool) public approvers;
    // uint public approversCount;

    // modifier restricted() {
    //     require(msg.sender == manager);
    //     _;
    // }

    function createRequest(string memory _description, uint _value) public {
        Request memory newRequest = Request({
           description: _description,
           value: _value,
           recipient: msg.sender,
           complete: false,
           timestamp: block.timestamp
        });
        requests.push(newRequest);
    }

    function approveRequest(uint _index) public payable onlyOwner {
        Request storage request = requests[_index];
        require(!request.complete);
        payable(request.recipient).transfer(request.value);
        request.complete = true;
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }

    // treasury
    struct Dividen {
        uint amount;
        uint count;
        bool used;
    }
    uint dividenCount;
    mapping(address => Dividen) dividens;

    function contribute() public payable {
        require(msg.value > 0);
        dividen += msg.value;
        dividenCount++;
    }

    function claim() public payable {
        console.log("dividen", dividen);
        console.log("dividenCount", dividenCount);
        if (!dividens[msg.sender].used) {
            uint amount = dividen * balanceOf(msg.sender) / totalSupply() - scale;
            console.log("amount", amount);
            Dividen memory newDividen = Dividen({
                amount: amount,
                count: 1,
                used: true
            });
            dividens[msg.sender] = newDividen;
            payable(msg.sender).transfer(amount);
            console.log("1", amount);
        } else if (dividens[msg.sender].used && dividens[msg.sender].count < dividenCount) {
            uint amount = dividen * balanceOf(msg.sender) / totalSupply() - scale;
            console.log("amount", amount);
            dividens[msg.sender].amount += amount - dividens[msg.sender].amount;
            dividens[msg.sender].count++;
            payable(msg.sender).transfer(amount - dividens[msg.sender].amount);
            console.log("2 dividens[msg.sender].amount", dividens[msg.sender].amount);
            console.log("2 dividens[msg.sender].count", dividens[msg.sender].count);
            console.log("2 amount - dividens[msg.sender].amount", amount - dividens[msg.sender].amount);
        }
    }

}