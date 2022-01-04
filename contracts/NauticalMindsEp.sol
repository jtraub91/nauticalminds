// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NauticalMindsEp is ERC721, Ownable {
    
    uint256 public PRICE = 1e15;    // 0.0015 ether
    uint256 public totalMintedCopies = 0;

    string private _baseUri = "ipfs://QmbMJCJgN5WABDvVkuMJmMzPBF4wGBjme5igck1qCpdvd3";

    constructor() ERC721("NauticalMindsEp", "NMEP") {}

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseUri;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return _baseURI();
    }

    function _setTokenPrice(uint256 price) public onlyOwner returns (uint256) {
        PRICE = price;
        return price;
    }

    function _withdraw(uint256 amount) public onlyOwner returns (uint256) {
        require(msg.sender == owner());
        payable(owner()).transfer(amount);
        return amount;
    }
    function _balance() public view onlyOwner returns (uint256) {
        uint256 bal = address(this).balance;
        return bal;
    }

    function mintEp() public payable returns (uint256){
        /**
         *  Mint (and receive) a fresh copy
         */
        require(PRICE < msg.value, "Value sent must exceed PRICE");

        uint256 tokenId = totalMintedCopies + 1;
        _safeMint(msg.sender, tokenId);
        totalMintedCopies = tokenId;
        return tokenId;
    }
    
    function burnEp(uint256 tokenId) public returns (uint256) {
        /**
         *  Burn your copy
         */
        require(_exists(tokenId), "Token does not exist");
        require(_msgSender() == ownerOf(tokenId), "Must be token owner to burn token");
        _burn(tokenId);
        return tokenId;
    }
}