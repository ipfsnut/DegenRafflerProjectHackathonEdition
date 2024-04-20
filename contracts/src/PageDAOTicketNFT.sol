// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "../.deps/npm/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../.deps/npm/@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "../.deps/npm/@openzeppelin/contracts/access/Ownable.sol";
import "../.deps/npm/@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract PageDAOTicketNFT is ERC721, ERC721Burnable, Ownable {
    uint256 public currentTokenId = 0;
    string public defaultURI;

    mapping(uint256 => string) public tokenURIs;
    mapping(uint256 => bool) public lockedTokenURIs;

    uint256 public collectedDEGEN;

    // $DEGEN token contract address
    address constant DEGEN_TOKEN_ADDRESS = 0x888F05D02ea7B42f32f103C089c1750170830642;

    // Mapping to track addresses that have minted a free NFT
    mapping(address => bool) public hasMintedFree;

    constructor(string memory _defaultURI, address initialOwner) ERC721("PageDAO Ticket NFT", "TICK1") Ownable(initialOwner) {
        defaultURI = _defaultURI;
    }

    function mintFree(address to) public {
        require(!hasMintedFree[msg.sender], "You have already minted a free NFT");
        _mint(to, currentTokenId);
        currentTokenId++;
        hasMintedFree[msg.sender] = true;
    }

    function mintWithDEGEN(address to) public {
        // Charge 100 $DEGEN tokens for the mint
        require(IERC20(DEGEN_TOKEN_ADDRESS).transferFrom(msg.sender, address(this), 100 * 10**18), "Failed to transfer $DEGEN");

        _mint(to, currentTokenId);
        currentTokenId++;

        // Update the collected $DEGEN amount
        collectedDEGEN += 100 * 10**18;
    }

    function setTokenURI(uint256 tokenId, string memory _tokenURI) public onlyOwner {
        require(!lockedTokenURIs[tokenId], "Token URI is locked");
        tokenURIs[tokenId] = _tokenURI;
    }

    function lockTokenURI(uint256 tokenId) public onlyOwner {
        lockedTokenURIs[tokenId] = true;
    }

    function setDefaultTokenURI(string memory _tokenURI) public onlyOwner {
        defaultURI = _tokenURI;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        if (bytes(tokenURIs[tokenId]).length > 0) {
            return tokenURIs[tokenId];
        } else {
            return defaultURI;
        }
    }

    function withdrawDEGEN() public onlyOwner {
        uint256 amount = collectedDEGEN;
        require(amount > 0, "No $DEGEN to withdraw");
        require(IERC20(DEGEN_TOKEN_ADDRESS).transfer(msg.sender, amount), "Failed to transfer $DEGEN");
        collectedDEGEN = 0;
    }
}
