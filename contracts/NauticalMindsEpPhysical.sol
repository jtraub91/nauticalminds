// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NauticalMindsEpPhysical is ERC1155 {

    string private _uri = "ipfs://QmbMJCJgN5WABDvVkuMJmMzPBF4wGBjme5igck1qCpdvd3";

    constructor() ERC1155(_uri) {}
}
