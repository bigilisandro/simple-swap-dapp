// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract SimpleSwap {
    address public owner;
    address public tokenA;
    address public tokenB;
    uint256 private price; // Price of tokenA in terms of tokenB (scaled by 1e18)
    
    event Swap(address indexed user, address tokenIn, address tokenOut, uint256 amountIn, uint256 amountOut);
    event PriceUpdated(uint256 newPrice);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }
    
    constructor(address _tokenA, address _tokenB, uint256 _initialPrice) {
        require(_tokenA != address(0) && _tokenB != address(0), "Invalid token addresses");
        require(_initialPrice > 0, "Price must be greater than 0");
        
        owner = msg.sender;
        tokenA = _tokenA;
        tokenB = _tokenB;
        price = _initialPrice;
    }
    
    function swapAForB(uint256 amountA) external {
        require(amountA > 0, "Amount must be greater than 0");
        
        uint256 amountB = (amountA * price) / 1e18;
        require(IERC20(tokenB).balanceOf(address(this)) >= amountB, "Insufficient liquidity");
        
        require(IERC20(tokenA).transferFrom(msg.sender, address(this), amountA), "Transfer failed");
        require(IERC20(tokenB).transfer(msg.sender, amountB), "Transfer failed");
        
        emit Swap(msg.sender, tokenA, tokenB, amountA, amountB);
    }
    
    function swapBForA(uint256 amountB) external {
        require(amountB > 0, "Amount must be greater than 0");
        
        uint256 amountA = (amountB * 1e18) / price;
        require(IERC20(tokenA).balanceOf(address(this)) >= amountA, "Insufficient liquidity");
        
        require(IERC20(tokenB).transferFrom(msg.sender, address(this), amountB), "Transfer failed");
        require(IERC20(tokenA).transfer(msg.sender, amountA), "Transfer failed");
        
        emit Swap(msg.sender, tokenB, tokenA, amountB, amountA);
    }
    
    function getPrice() external view returns (uint256) {
        return price;
    }
    
    function getPriceAForB(uint256 amountA) external view returns (uint256) {
        return (amountA * price) / 1e18;
    }
    
    function getPriceBForA(uint256 amountB) external view returns (uint256) {
        return (amountB * 1e18) / price;
    }
    
    function balanceOfA(address account) external view returns (uint256) {
        return IERC20(tokenA).balanceOf(account);
    }
    
    function balanceOfB(address account) external view returns (uint256) {
        return IERC20(tokenB).balanceOf(account);
    }
    
    function updatePrice(uint256 _newPrice) external onlyOwner {
        require(_newPrice > 0, "Price must be greater than 0");
        price = _newPrice;
        emit PriceUpdated(_newPrice);
    }
    
    function withdrawETH() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }
    
    function withdrawToken(address token, uint256 amount) external onlyOwner {
        require(IERC20(token).transfer(owner, amount), "Transfer failed");
    }
    
    receive() external payable {}
}
