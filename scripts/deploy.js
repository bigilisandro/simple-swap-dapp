const { ethers } = require("hardhat")

async function main() {
  const [deployer] = await ethers.getSigners()

  console.log("Deploying contracts with the account:", deployer.address)
  console.log("Account balance:", (await ethers.provider.getBalance(deployer.address)).toString())

  // Deploy mock tokens for testing
  const MockToken = await ethers.getContractFactory("MockERC20")

  console.log("Deploying Token A...")
  const tokenA = await MockToken.deploy("Token A", "TKA", ethers.parseEther("1000000"))
  await tokenA.waitForDeployment()
  console.log("Token A deployed to:", await tokenA.getAddress())

  console.log("Deploying Token B...")
  const tokenB = await MockToken.deploy("Token B", "TKB", ethers.parseEther("1000000"))
  await tokenB.waitForDeployment()
  console.log("Token B deployed to:", await tokenB.getAddress())

  // Deploy SimpleSwap
  console.log("Deploying SimpleSwap...")
  const SimpleSwap = await ethers.getContractFactory("SimpleSwap")
  const simpleSwap = await SimpleSwap.deploy(
    await tokenA.getAddress(),
    await tokenB.getAddress(),
    ethers.parseEther("2"), // 1 tokenA = 2 tokenB
  )
  await simpleSwap.waitForDeployment()

  console.log("SimpleSwap deployed to:", await simpleSwap.getAddress())

  // Add initial liquidity
  console.log("Adding initial liquidity...")
  await tokenA.transfer(await simpleSwap.getAddress(), ethers.parseEther("10000"))
  await tokenB.transfer(await simpleSwap.getAddress(), ethers.parseEther("20000"))
  console.log("Initial liquidity added to SimpleSwap")

  // Verification info
  console.log("\n=== Deployment Summary ===")
  console.log("Token A:", await tokenA.getAddress())
  console.log("Token B:", await tokenB.getAddress())
  console.log("SimpleSwap:", await simpleSwap.getAddress())
  console.log("Initial Price: 1 TKA = 2 TKB")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
