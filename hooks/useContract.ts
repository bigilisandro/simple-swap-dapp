"use client"

import { useState } from "react"

const CONTRACT_ADDRESS = "0x49F6fBbf46405536EB6a05fc4B21b874B9a879dE"

// SimpleSwap ABI (basic functions)
const CONTRACT_ABI = [
  {
    inputs: [{ internalType: "uint256", name: "amountA", type: "uint256" }],
    name: "swapAForB",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "amountB", type: "uint256" }],
    name: "swapBForA",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "getPriceAForB",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "amount", type: "uint256" }],
    name: "getPriceBForA",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOfA",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOfB",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
]

export function useContract() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getContract = async () => {
    if (!window.ethereum) {
      throw new Error("No ethereum provider found")
    }

    const { ethers } = await import("ethers")
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
  }

  const getReadOnlyContract = async () => {
    if (!window.ethereum) {
      throw new Error("No ethereum provider found")
    }

    const { ethers } = await import("ethers")
    const provider = new ethers.BrowserProvider(window.ethereum)
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)
  }

  const swapAForB = async (amount: string) => {
    setLoading(true)
    setError(null)

    try {
      const contract = await getContract()
      const { ethers } = await import("ethers")
      const amountWei = ethers.parseEther(amount)

      const tx = await contract.swapAForB(amountWei)
      await tx.wait()

      return tx.hash
    } catch (err: any) {
      setError(err.message || "Failed to swap tokens")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const swapBForA = async (amount: string) => {
    setLoading(true)
    setError(null)

    try {
      const contract = await getContract()
      const { ethers } = await import("ethers")
      const amountWei = ethers.parseEther(amount)

      const tx = await contract.swapBForA(amountWei)
      await tx.wait()

      return tx.hash
    } catch (err: any) {
      setError(err.message || "Failed to swap tokens")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const getPrice = async (amount: string, fromToken: "A" | "B") => {
    try {
      const contract = await getReadOnlyContract()
      const { ethers } = await import("ethers")
      const amountWei = ethers.parseEther(amount)

      let price
      if (fromToken === "A") {
        price = await contract.getPriceAForB(amountWei)
      } else {
        price = await contract.getPriceBForA(amountWei)
      }

      return ethers.formatEther(price)
    } catch (err: any) {
      console.error("Error getting price:", err)
      return "0"
    }
  }

  const getTokenABalance = async (address: string) => {
    try {
      const contract = await getReadOnlyContract()
      const { ethers } = await import("ethers")
      const balance = await contract.balanceOfA(address)
      return ethers.formatEther(balance)
    } catch (err: any) {
      console.error("Error getting Token A balance:", err)
      return "0"
    }
  }

  const getTokenBBalance = async (address: string) => {
    try {
      const contract = await getReadOnlyContract()
      const { ethers } = await import("ethers")
      const balance = await contract.balanceOfB(address)
      return ethers.formatEther(balance)
    } catch (err: any) {
      console.error("Error getting Token B balance:", err)
      return "0"
    }
  }

  return {
    swapAForB,
    swapBForA,
    getPrice,
    getTokenABalance,
    getTokenBBalance,
    loading,
    error,
  }
}
