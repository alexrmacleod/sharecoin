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

    address[] public holders;
    uint256 public contribution;

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

    // function sponsoredBurnFrom(address _from, uint256 _amount) public {
    //     _burn(_from, _amount);
    //     emit Burned(msg.sender, _amount, 0);
    // }

    function _continuousMint(uint256 _deposit)
        internal
        validGasPrice
        // updateAccount(msg.sender)
        returns (uint256)
    {
        require(_deposit > 0, "Deposit must be non-zero.");

        uint256 rewardAmount = getContinuousMintReward(_deposit);

        // push to holders and payment splitter
        if (balanceOf(msg.sender) <= 0) {
            // add account to holders array
            holders.push(address(msg.sender));
            // add account to payment splitter
            _addPayee(msg.sender,rewardAmount);
        } else {
            // increase account in payment splitter
            _increasePayee(msg.sender,rewardAmount); 
        }

        _mint(msg.sender, rewardAmount);
        emit Minted(msg.sender, rewardAmount, _deposit);


        return rewardAmount;
    }

    function _continuousBurn(uint256 _amount, uint _index)
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

        // decrement holderCount
        if(balanceOf(msg.sender) <= 0) {
            // remove account from holders array
            popHolders(_index);
            // remove account from payment splitter
            _popPayee(msg.sender, _amount, _index);
        } else {
            // decrement account in paymnet splitter
            _decreasePayee(msg.sender,_amount);
        }

        return refundAmount;
    }

    // function getHoldersCount() public view returns(uint holderCount) {
    //     return holders.length;
    // }

    function getHolders() public view returns (address[] memory) {
        return holders;
    }

    function popHolders(uint index) internal {
        require(index < holders.length, "ETHContinuousToken: index is above array length");
        holders[index] = holders[holders.length-1];
        holders.pop();
    }

    // contribution
    function contribute() public payable {
        require(msg.value > 0);
        contribution += msg.value;
    }

    // payment splitter

    event PayeeAdded(address account, uint256 shares);
    event PayeePopped(address account, uint256 shares);
    event PayeeIncreased(address account, uint256 shares);
    event PayeeDecreased(address account, uint256 shares);
    event PaymentReleased(address to, uint256 amount);
    event PaymentReceived(address from, uint256 amount);

    uint256 private _totalShares;
    uint256 private _totalReleased;

    mapping(address => uint256) private _shares;
    mapping(address => uint256) private _released;
    address[] public _payees;

    function getPayees() public view returns (address[] memory) {
        return _payees;
    }

    /**
     * @dev Creates an instance of `PaymentSplitter` where each account in `payees` is assigned the number of shares at
     * the matching position in the `shares` array.
     *
     * All addresses in `payees` must be non-zero. Both arrays must have the same non-zero length, and there must be no
     * duplicates in `payees`.
     */
    // constructor (address[] memory payees, uint256[] memory shares_) payable {
    //     // solhint-disable-next-line max-line-length
    //     require(payees.length == shares_.length, "PaymentSplitter: payees and shares length mismatch");
    //     require(payees.length > 0, "PaymentSplitter: no payees");

    //     for (uint256 i = 0; i < payees.length; i++) {
    //         _addPayee(payees[i], shares_[i]);
    //     }
    // }

    /**
     * @dev The Ether received will be logged with {PaymentReceived} events. Note that these events are not fully
     * reliable: it's possible for a contract to receive Ether without triggering this function. This only affects the
     * reliability of the events, and not the actual splitting of Ether.
     *
     * To learn more about this see the Solidity documentation for
     * https://solidity.readthedocs.io/en/latest/contracts.html#fallback-function[fallback
     * functions].
     */
    // receive () external payable virtual {
    //     emit PaymentReceived(_msgSender(), msg.value);
    // }

    // /**
    //  * @dev Getter for the total shares held by payees.
    //  */
    // function totalShares() public view returns (uint256) {
    //     return _totalShares;
    // }

    // /**
    //  * @dev Getter for the total amount of Ether already released.
    //  */
    function totalReleased() public view returns (uint256) {
        return _totalReleased;
    }

    // /**
    //  * @dev Getter for the amount of shares held by an account.
    //  */
    function shares(address account) public view returns (uint256) {
        return _shares[account];
    }

    // /**
    //  * @dev Getter for the amount of Ether already released to a payee.
    //  */
    function released(address account) public view returns (uint256) {
        return _released[account];
    }

    // /**
    //  * @dev Getter for the address of the payee number `index`.
    //  */
    // function payee(uint256 index) public view returns (address) {
    //     return _payees[index];
    // }

    /**
     * @dev Triggers a transfer to `account` of the amount of Ether they are owed, according to their percentage of the
     * total shares and their previous withdrawals.
     */
    function release(address payable account) public payable {
        require(_shares[account] > 0, "PaymentSplitter: account has no shares");

        uint256 totalReceived = contribution + _totalReleased;
        uint256 payment = totalReceived * _shares[account] / _totalShares - _released[account];

        require(payment != 0, "PaymentSplitter: account is not due payment");

        _released[account] = _released[account] + payment;
        _totalReleased = _totalReleased + payment;

        contribution = contribution - payment;
        // contribution -= payment;
        payable(account).transfer(payment);
        emit PaymentReleased(account, payment);
    }
    /**
     * @dev Getter for the contribution of the payee.
     */
    function getDividen(address account) public view returns(uint256) {
        if (_shares[account] <= 0) {
            return 0;
        } else {
            uint256 totalReceived = contribution + _totalReleased;
            // console.log("totalReceived",totalReceived);
            // console.log("_shares[account]",_shares[account]);
            // console.log("_totalShares",_totalShares);
            // console.log("_released[account]",_released[account]);
            uint256 payment = totalReceived * _shares[account] / _totalShares - _released[account];
            // console.log("payment",payment);
            return payment;
        }
    }
    /**
     * @dev Add a new payee to the contract.
     * @param account The address of the payee to add.
     * @param shares_ The number of shares owned by the payee.
     */
    function _addPayee(address account, uint256 shares_) internal {
        require(account != address(0), "PaymentSplitter: account is the zero address");
        require(shares_ > 0, "PaymentSplitter: shares are 0");
        require(_shares[account] == 0, "PaymentSplitter: account already has shares");

        _payees.push(account);
        _shares[account] = shares_;
        _totalShares = _totalShares + shares_;

        emit PayeeAdded(account, shares_);
    }

    function _popPayee(address account, uint256 shares_, uint index) internal {
        require(account != address(0), "PaymentSplitter: account is the zero address");
        // require(shares_ <= 0, "PaymentSplitter: shares are 0");
        // require(_shares[account] == 0, "PaymentSplitter: account already has shares");
        require(index < _payees.length, "PaymentSplitter: index is above array length");
        _shares[account] = _shares[account] - shares_;
        _totalShares = _totalShares - shares_;
        _payees[index] = _payees[_payees.length-1];
        _payees.pop();
        emit PayeePopped(account, shares_);
    }

    function _increasePayee(address account, uint256 shares_) internal {
        require(account != address(0), "PaymentSplitter: account is the zero address");
        require(shares_ > 0, "PaymentSplitter: shares are 0");
        require(_shares[account] > 0, "PaymentSplitter: account must have shares");

        _shares[account] = _shares[account] + shares_;
        _totalShares = _totalShares + shares_;
        emit PayeeIncreased(account, shares_);
    }

    function _decreasePayee(address account, uint256 shares_) internal {
        require(account != address(0), "PaymentSplitter: account is the zero address");
        require(shares_ > 0, "PaymentSplitter: shares are 0");
        require(_shares[account] > 0, "PaymentSplitter: account must have shares");

        _shares[account] = _shares[account] - shares_;
        _totalShares = _totalShares - shares_;
        emit PayeeDecreased(account, shares_);
    }

}