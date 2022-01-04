// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract NauticalMindsToken is ERC20 {
    
    uint256 private _totalSupply = 2.1e13;
    
    constructor() ERC20("NauticalMindsToken", "NMT") {}
}