const { expect } = require("chai")
const { ethers } = require("hardhat")

describe("SimpleSwap Contract Tests", () => {
  let SimpleSwap, simpleSwap
  let MockERC20, tokenA, tokenB
  let owner, addr1, addr2
  const initialPrice = ethers.parseEther("2") // 1 tokenA = 2 tokenB

  beforeEach(async () => {
    // Get signers
    ;[owner, addr1, addr2] = await ethers.getSigners()

    // Deploy mock ERC20 tokens
    MockERC20 = await ethers.getContractFactory("MockERC20")
    tokenA = await MockERC20.deploy("Token A", "TKA", ethers.parseEther("1000000"))
    tokenB = await MockERC20.deploy("Token B", "TKB", ethers.parseEther("1000000"))

    // Deploy SimpleSwap contract
    SimpleSwap = await ethers.getContractFactory("SimpleSwap")
    simpleSwap = await SimpleSwap.deploy(await tokenA.getAddress(), await tokenB.getAddress(), initialPrice)

    // Transfer tokens to the contract for liquidity
    await tokenA.transfer(await simpleSwap.getAddress(), ethers.parseEther("10000"))
    await tokenB.transfer(await simpleSwap.getAddress(), ethers.parseEther("20000"))

    // Give some tokens to test addresses
    await tokenA.transfer(addr1.address, ethers.parseEther("1000"))
    await tokenB.transfer(addr1.address, ethers.parseEther("1000"))
  })

  describe("Deployment", () => {
    it("Should set the right owner", async () => {
      expect(await simpleSwap.owner()).to.equal(owner.address)
    })

    it("Should set correct token addresses", async () => {
      expect(await simpleSwap.tokenA()).to.equal(await tokenA.getAddress())
      expect(await simpleSwap.tokenB()).to.equal(await tokenB.getAddress())
    })

    it("Should set initial price correctly", async () => {
      expect(await simpleSwap.getPrice()).to.equal(initialPrice)
    })

    it("Should have correct initial reserves", async () => {
      const contractAddress = await simpleSwap.getAddress()
      expect(await tokenA.balanceOf(contractAddress)).to.equal(ethers.parseEther("10000"))
      expect(await tokenB.balanceOf(contractAddress)).to.equal(ethers.parseEther("20000"))
    })
  })

  describe("Price Management", () => {
    it("Should return current price", async () => {
      const price = await simpleSwap.getPrice()
      expect(price).to.equal(initialPrice)
    })

    it("Should allow owner to update price", async () => {
      const newPrice = ethers.parseEther("3")
      await simpleSwap.updatePrice(newPrice)
      expect(await simpleSwap.getPrice()).to.equal(newPrice)
    })

    it("Should not allow non-owner to update price", async () => {
      const newPrice = ethers.parseEther("3")
      await expect(simpleSwap.connect(addr1).updatePrice(newPrice)).to.be.revertedWith("Not the owner")
    })

    it("Should emit PriceUpdated event", async () => {
      const newPrice = ethers.parseEther("3")
      await expect(simpleSwap.updatePrice(newPrice)).to.emit(simpleSwap, "PriceUpdated").withArgs(newPrice)
    })
  })

  describe("Token Swapping", () => {
    beforeEach(async () => {
      // Approve tokens for swapping
      await tokenA.connect(addr1).approve(await simpleSwap.getAddress(), ethers.parseEther("1000"))
      await tokenB.connect(addr1).approve(await simpleSwap.getAddress(), ethers.parseEther("1000"))
    })

    it("Should swap Token A for Token B", async () => {
      const swapAmount = ethers.parseEther("10")
      const expectedOutput = (swapAmount * initialPrice) / ethers.parseEther("1")

      const initialBalanceA = await tokenA.balanceOf(addr1.address)
      const initialBalanceB = await tokenB.balanceOf(addr1.address)

      await simpleSwap.connect(addr1).swapAForB(swapAmount)

      const finalBalanceA = await tokenA.balanceOf(addr1.address)
      const finalBalanceB = await tokenB.balanceOf(addr1.address)

      expect(initialBalanceA - finalBalanceA).to.equal(swapAmount)
      expect(finalBalanceB - initialBalanceB).to.equal(expectedOutput)
    })

    it("Should swap Token B for Token A", async () => {
      const swapAmount = ethers.parseEther("20")
      const expectedOutput = (swapAmount * ethers.parseEther("1")) / initialPrice

      const initialBalanceA = await tokenA.balanceOf(addr1.address)
      const initialBalanceB = await tokenB.balanceOf(addr1.address)

      await simpleSwap.connect(addr1).swapBForA(swapAmount)

      const finalBalanceA = await tokenA.balanceOf(addr1.address)
      const finalBalanceB = await tokenB.balanceOf(addr1.address)

      expect(initialBalanceB - finalBalanceB).to.equal(swapAmount)
      expect(finalBalanceA - initialBalanceA).to.equal(expectedOutput)
    })

    it("Should emit Swap event for A to B", async () => {
      const swapAmount = ethers.parseEther("10")
      const expectedOutput = (swapAmount * initialPrice) / ethers.parseEther("1")

      await expect(simpleSwap.connect(addr1).swapAForB(swapAmount))
        .to.emit(simpleSwap, "Swap")
        .withArgs(addr1.address, await tokenA.getAddress(), await tokenB.getAddress(), swapAmount, expectedOutput)
    })

    it("Should emit Swap event for B to A", async () => {
      const swapAmount = ethers.parseEther("20")
      const expectedOutput = (swapAmount * ethers.parseEther("1")) / initialPrice

      await expect(simpleSwap.connect(addr1).swapBForA(swapAmount))
        .to.emit(simpleSwap, "Swap")
        .withArgs(addr1.address, await tokenB.getAddress(), await tokenA.getAddress(), swapAmount, expectedOutput)
    })

    it("Should fail when insufficient allowance", async () => {
      await tokenA.connect(addr1).approve(await simpleSwap.getAddress(), 0)
      await expect(simpleSwap.connect(addr1).swapAForB(ethers.parseEther("10"))).to.be.reverted
    })

    it("Should fail when insufficient balance", async () => {
      const largeAmount = ethers.parseEther("10000")
      await expect(simpleSwap.connect(addr1).swapAForB(largeAmount)).to.be.reverted
    })

    it("Should fail when insufficient contract liquidity", async () => {
      // Drain contract liquidity
      const contractBalance = await tokenB.balanceOf(await simpleSwap.getAddress())
      await simpleSwap.withdrawToken(await tokenB.getAddress(), contractBalance)

      await expect(simpleSwap.connect(addr1).swapAForB(ethers.parseEther("10"))).to.be.revertedWith(
        "Insufficient liquidity",
      )
    })
  })

  describe("Balance Queries", () => {
    it("Should return correct balance for Token A", async () => {
      const balance = await tokenA.balanceOf(addr1.address)
      expect(balance).to.equal(ethers.parseEther("1000"))
    })

    it("Should return correct balance for Token B", async () => {
      const balance = await tokenB.balanceOf(addr1.address)
      expect(balance).to.equal(ethers.parseEther("1000"))
    })

    it("Should return zero balance for address with no tokens", async () => {
      const balance = await tokenA.balanceOf(addr2.address)
      expect(balance).to.equal(0)
    })
  })

  describe("Admin Functions", () => {
    it("Should allow owner to withdraw tokens", async () => {
      const withdrawAmount = ethers.parseEther("100")
      const initialBalance = await tokenA.balanceOf(owner.address)

      await simpleSwap.withdrawToken(await tokenA.getAddress(), withdrawAmount)

      const finalBalance = await tokenA.balanceOf(owner.address)
      expect(finalBalance - initialBalance).to.equal(withdrawAmount)
    })

    it("Should not allow non-owner to withdraw tokens", async () => {
      const withdrawAmount = ethers.parseEther("100")
      await expect(
        simpleSwap.connect(addr1).withdrawToken(await tokenA.getAddress(), withdrawAmount),
      ).to.be.revertedWith("Not the owner")
    })

    it("Should allow owner to withdraw ETH", async () => {
      // Send some ETH to the contract
      await owner.sendTransaction({
        to: await simpleSwap.getAddress(),
        value: ethers.parseEther("1"),
      })

      const initialBalance = await ethers.provider.getBalance(owner.address)
      const tx = await simpleSwap.withdrawETH()
      const receipt = await tx.wait()
      const gasUsed = receipt.gasUsed * receipt.gasPrice

      const finalBalance = await ethers.provider.getBalance(owner.address)
      expect(finalBalance + gasUsed - initialBalance).to.equal(ethers.parseEther("1"))
    })

    it("Should not allow non-owner to withdraw ETH", async () => {
      await expect(simpleSwap.connect(addr1).withdrawETH()).to.be.revertedWith("Not the owner")
    })
  })

  describe("Edge Cases", () => {
    it("Should handle zero amount swaps", async () => {
      await expect(simpleSwap.connect(addr1).swapAForB(0)).to.be.revertedWith("Amount must be greater than 0")
    })

    it("Should handle price updates to zero", async () => {
      await expect(simpleSwap.updatePrice(0)).to.be.revertedWith("Price must be greater than 0")
    })

    it("Should handle multiple consecutive swaps", async () => {
      await tokenA.connect(addr1).approve(await simpleSwap.getAddress(), ethers.parseEther("1000"))

      for (let i = 0; i < 5; i++) {
        await simpleSwap.connect(addr1).swapAForB(ethers.parseEther("10"))
      }

      const finalBalance = await tokenA.balanceOf(addr1.address)
      expect(finalBalance).to.equal(ethers.parseEther("950")) // 1000 - (5 * 10)
    })
  })
})
