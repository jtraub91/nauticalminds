// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract NauticalToken {    
    mapping(address => bool) private _isUser;

    uint256 public price = 1e15;
    address private _owner;
    
    constructor(){
        _owner = msg.sender;
    }
    function _setPrice(uint256 amount) public returns (uint256) {
        require(msg.sender == _owner);
        price = amount;
        return price;
    }
    function _balance() public view returns (uint256){
        require(msg.sender == _owner);
        return address(this).balance;
    }
    function _withdraw() public returns (uint256) {
        require(msg.sender == _owner);
        uint256 bal = address(this).balance;
        payable(_owner).transfer(bal);
        return bal;
    }
    function getAccess() public payable returns (bool){
        require(price < msg.value, "Not enough ether for cover");
        _isUser[msg.sender] = true;
        return _isUser[msg.sender];
    }
    function hasAccess() view public returns (bool){
        return _isUser[msg.sender];
    }
}