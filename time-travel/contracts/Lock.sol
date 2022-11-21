// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.25 <0.9.0;

// Import this file to use console.log
import "@ganache/console.log/console.sol";

contract Lock {
    uint public unlockTime;
    address payable public owner;

    event Withdrawal(uint amount, uint when);

    constructor(uint _unlockTime) payable {
        require(
            block.timestamp < _unlockTime,
            "Unlock time should be in the future"
        );

        console.log("\n====\nNew Lock: value: %o expires: %o\n====\n", msg.value, _unlockTime);
        unlockTime = _unlockTime;
        owner = payable(msg.sender);
    }

    function withdraw() public {
        // Uncomment this line to print a log in your terminal
        // console.log("Unlock time is %o and block timestamp is %o", unlockTime, block.timestamp);
        // NOTE: on failures, this message will be logged twice
        // 1st time for when the evm fails
        // maybe 2nd time for when truffle/web3/ethers replays the txn (call)
        // to capture the revert string. IFF the failure reason doesn't OOG
        // prior to this
        //
        // Consider writing validations (contract invariants) prior to require statements?
        console.log(
          "withdraw: Unlock-time criteria: %o", 
          block.timestamp, 
          unlockTime, 
          block.timestamp >= unlockTime
        );
        require(block.timestamp >= unlockTime, "You can't withdraw yet");

        console.log(
          "withdraw: ownership criteria: %o",
          msg.sender == owner
        );
        require(msg.sender == owner, "You aren't the owner");

        // should only happen on non reversions
        emit Withdrawal(address(this).balance, block.timestamp);

        // could OOG and this will not be printed!
        console.log(
          "withdraw:\n  WEI: (%o)\n    @: %o\n   to: %o ", 
          address(this).balance,
          block.timestamp, 
          msg.sender
        );

        owner.transfer(address(this).balance);
    }
}
