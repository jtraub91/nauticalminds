// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NauticalMindsEp is ERC721, Ownable {
    
    uint256 public PRICE = 1e15;    // 0.0015 ether
    uint256 public totalCopiesSold = 0;

    mapping(uint8 => string) trackUris;

    constructor() ERC721("NauticalMindsEp", "NMEP") {}

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        // NMEP does not have unique tokenURI's
        // all "tokens" or copies of NMEP point to the same URI, 
        //   containing the ipfs content identifier for the folder of 
        //   mp3 files for NauticalMindsEP. 
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return _baseURI();
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return "ipfs://fjjgkldgkljdgjldmsdbgjksklfjslvmskvxg";
    }

    function _setTokenPrice(uint256 price) public onlyOwner returns (uint256) {
        PRICE = price;
        return price;
    }

    function _withdraw(uint256 amount) public onlyOwner {


        
    }
    function _balance() public view onlyOwner returns (uint256) {
        uint256 contractBalance = address(this).balance;
        return contractBalance;
    }

    function mintEp() public payable returns (uint256){
        /**
         *  Mint (and receive) a fresh copy
         */
        require(PRICE < msg.value, "Value sent must exceed PRICE");

        uint256 tokenId = totalCopiesSold + 1;
        _safeMint(msg.sender, tokenId);
        totalCopiesSold = tokenId;
        return tokenId;
    }
    
    function burnEp(uint256 tokenId) public returns (uint256) {
        /**
         *  Burn your copy
         */
        require(_exists(tokenId), "Token does not exist");
        require(msg.sender == ownerOf(tokenId), "Must be token owner to burn token");
        _burn(tokenId);
        return tokenId;
    }
}