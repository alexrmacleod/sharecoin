// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./ContinuousToken.sol";
// import "hardhat/console.sol";

// Need additional attributes for creator / caretaker address and fees
// creatorAddress
// mintCreatorFee
// burnCreatorFee
// caretakerAddress
// caretakerFee
// mintCaretakerFee
// burnCaretakerFee
// TODO: Define ERC20ContinuousTokenWithFees

contract ERC20ContinuousToken is Ownable, ContinuousToken {
    ERC20 public reserveToken;

    string public coinName;
    string public coinSymbol;
    string public description;
    uint32 public beneficiaryRewardRatio;
    address public beneficiary;
    uint256 public beneficiaryRewards;
    uint256 public beneficiaryReward;
    string public ipfsHash;
    // address public treasury;
    // uint256 public dividen;
    uint256 constant public scale = 10**18;
    // uint public holders;

    constructor(
        string memory _name,
        string memory _symbol,
        uint256 _initialSupply,
        uint32 _reserveRatio,
        ERC20 _reserveToken,
        
        string memory _description,
        uint32 _beneficiaryRewardRatio,
        address _beneficiary, // init msg.sender
        // uint256 _value, // init msg.value
        string memory _ipfsHash
    )
        ContinuousToken(
            _name,
            _symbol,
            _initialSupply,
            _reserveRatio
        )
    {
        reserveToken = _reserveToken;
        coinName = _name;
        coinSymbol = _symbol;
        // reserve = 10**18;// _value; // this used to be msg.value is it ok to start a bonding curve with fake ether?
        description = _description;
        beneficiaryRewardRatio = _beneficiaryRewardRatio;
        beneficiary = _beneficiary;
        ipfsHash = _ipfsHash;
        transferOwnership(_beneficiary);
    }

    // function() internal {
    //     revert("Cannot call fallback function.");
    // }

    function mint(uint256 _amount) public payable {
        // count holders
        // if(balanceOf(msg.sender) <= 0) {
        //     holders += 1;
        // }

        // beneficiary cut
        // beneficiaryReward = msg.value * beneficiaryRewardRatio / 1000000;
        // beneficiaryRewards += beneficiaryReward;
        // uint256 purchaseAmount = msg.value - beneficiaryReward;

        _continuousMint(_amount);
        require(
            reserveToken.transferFrom(msg.sender, address(this), _amount),
            "mint() ERC20.transferFrom failed."
        );
    }

    function burn(uint256 _amount) public payable {
        // decrement holders
        // if(balanceOf(msg.sender) <= 0) {
        //     holders -= 1;
        // }
        
        uint256 returnAmount = _continuousBurn(_amount,0);
        require(
            reserveToken.transfer(msg.sender, returnAmount),
            "burn() ERC20.transfer failed."
        );
    }

    function reserveBalance() public override view returns (uint256) {
        return reserveToken.balanceOf(address(this));
    }

    // function getSummary()
    //     public
    //     view
    //     returns (
    //         string memory,
    //         string memory,
    //         uint,
    //         string memory,
    //         uint32,
    //         address,
    //         uint256,
    //         uint256,
    //         string memory,
    //         uint
    //     )
    // {
    //     return (
    //         coinName,
    //         coinSymbol,
    //         address(this).balance,
    //         description,
    //         beneficiaryRewardRatio,
    //         beneficiary,
    //         beneficiaryRewards,
    //         dividen,
    //         ipfsHash,
    //         holders
    //     );
    // }

    // only beneficiary can withdraw
    function withdraw(uint256 _amount) public payable onlyOwner {
        require(beneficiaryRewards > 0, "no rewards to withdraw");
        require(_amount > 0 && _amount <= beneficiaryRewards, "withdraw amount outside the range of beneficiary rewards");
        payable(msg.sender).transfer(_amount);
        beneficiaryRewards = beneficiaryRewards - _amount;
    }

    // Proposal functions

    // struct Proposal {
    //     string description;
    //     uint value;
    //     address recipient;
    //     bool complete;
    //     uint timestamp;
    // }

    // Proposal[] public proposals;

    // // address public manager;
    // // uint public minimumContribution;
    // // mapping(address => bool) public approvers;
    // // uint public approversCount;

    // // modifier restricted() {
    // //     require(msg.sender == manager);
    // //     _;
    // // }

    // function createProposal(string memory _description, uint _value) public {
    //     Proposal memory newProposal = Proposal({
    //        description: _description,
    //        value: _value,
    //        recipient: msg.sender,
    //        complete: false,
    //        timestamp: block.timestamp
    //     });
    //     proposals.push(newProposal);
    // }

    // function approveProposal(uint _index) public payable onlyOwner {
    //     Proposal storage proposal = proposals[_index];
    //     require(!proposal.complete);
    //     payable(proposal.recipient).transfer(proposal.value);
    //     proposal.complete = true;
    // }

    // function getProposalsCount() public view returns (uint) {
    //     return proposals.length;
    // }

    // // treasury
    // struct Dividen {
    //     uint amount;
    //     uint count;
    //     bool used;
    // }
    // uint dividenCount;
    // mapping(address => Dividen) dividens;

    // function contribute() public payable {
    //     require(msg.value > 0);
    //     dividen += msg.value;
    //     dividenCount++;
    // }
}
