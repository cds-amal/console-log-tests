// SPDX-License-Identifier: MIT
pragma solidity >=0.4.25 <0.9.0;

import "@ganache/console.log/console.sol";

contract Telephone {
  uint public secret;

  constructor(uint _secret) payable { 
    console.log("CSTR::Simple\n\tsecret: %o", _secret); 
    secret = _secret;
  }

  function derivedSecret() public view returns (uint256) {
    uint256 besterer = 100 * secret + secret;
    console.log("The passphrase is: %o", secret);
    console.log("Leak it a hundred times, plus one more: %o", besterer);
    return besterer; 
  }
}
