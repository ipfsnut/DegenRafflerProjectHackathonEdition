// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract PageDAOTicketNFT is ERC721, ERC721Burnable, Ownable {
    uint256 public currentTokenId = 0;
    string public defaultURI;
    mapping(uint256 => string) public tokenURIs;
    mapping(uint256 => bool) public lockedTokenURIs;
    mapping(address => bool) public hasMintedFree;

    uint256 public collectedDEGEN = 0;
    IERC20 public immutable degenToken;
    address public immutable degenRecipient;

    constructor(string memory _defaultURI, address initialOwner, address _degenRecipient) ERC721("PageDAOTicketNFT", "PDAO") Ownable(initialOwner) {
        defaultURI = _defaultURI;
        degenToken = IERC20(0x888F05D02ea7B42f32f103C089c1750170830642);
        degenRecipient = _degenRecipient;
    }

    function mintFree(address to) external {
        require(!hasMintedFree[msg.sender], "You have already minted a free NFT");
        _safeMint(to, currentTokenId);
        currentTokenId++;
        hasMintedFree[msg.sender] = true;
    }

    function mintWithDEGEN(address to, uint256 degenAmount) external {
        require(degenAmount >= 100 * 10 ** 18, "Minimum DEGEN amount is 100");
        require(degenToken.transferFrom(msg.sender, address(this), degenAmount), "DEGEN transfer failed");
        _safeMint(to, currentTokenId);
        currentTokenId++;
        collectedDEGEN += degenAmount;
    }

    function approveDEGEN(uint256 degenAmount) external {
        require(degenToken.approve(address(this), degenAmount), "DEGEN approval failed");
    }

    function mint(address to) external onlyOwner {
        _safeMint(to, currentTokenId);
        currentTokenId++;
    }

    function setDefaultTokenURI(string memory _tokenURI) external onlyOwner {
        defaultURI = _tokenURI;
    }

    function setTokenURI(uint256 tokenId, string memory _tokenURI) external onlyOwner {
        tokenURIs[tokenId] = _tokenURI;
    }

    function lockTokenURI(uint256 tokenId) external onlyOwner {
        lockedTokenURIs[tokenId] = true;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        if (lockedTokenURIs[tokenId]) {
            return tokenURIs[tokenId];
        } else {
            return defaultURI;
        }
    }

    function withdrawDEGEN() external onlyOwner {
        uint256 balance = collectedDEGEN;
        require(balance > 0, "No DEGEN to withdraw");
        collectedDEGEN = 0;
        degenToken.transfer(degenRecipient, balance);
    }
}
