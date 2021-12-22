// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NauticalMindsEp is ERC721 {

    constructor() ERC721("NauticalMindsEp", "NMEP"){}
}