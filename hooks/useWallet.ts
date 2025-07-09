"use client"

import { useState, useEffect } from "react"

declare global {
  interface Window {
    ethereum?: any
  }
}

export function useWallet() {
  const [account, setAccount] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const checkConnection = async () => {
    if (typeof window !== "undefined" && window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        })
        if (accounts.length > 0) {
          setAccount(accounts[0])
          setIsConnected(true)
          await checkNetwork()
        }
      } catch (error) {
        console.error("Error checking connection:", error)
      }
    }
  }

  const checkNetwork = async () => {
    if (window.ethereum) {
      try {
        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        })
        // Sepolia chainId is 0xaa36a7
        if (chainId !== "0xaa36a7") {
          await switchToSepolia()
        }
      } catch (error) {
        console.error("Error checking network:", error)
      }
    }
  }

  const switchToSepolia = async () => {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0xaa36a7" }],
      })
    } catch (switchError: any) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0xaa36a7",
                chainName: "Sepolia Test Network",
                nativeCurrency: {
                  name: "SepoliaETH",
                  symbol: "SEP",
                  decimals: 18,
                },
                rpcUrls: ["https://sepolia.infura.io/v3/"],
                blockExplorerUrls: ["https://sepolia.etherscan.io/"],
              },
            ],
          })
        } catch (addError) {
          console.error("Error adding Sepolia network:", addError)
        }
      }
    }
  }

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!")
      return
    }

    setIsLoading(true)
    try {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      if (accounts.length > 0) {
        setAccount(accounts[0])
        setIsConnected(true)
        await checkNetwork()
      }
    } catch (error) {
      console.error("Error connecting wallet:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const disconnect = () => {
    setAccount(null)
    setIsConnected(false)
  }

  useEffect(() => {
    checkConnection()

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0])
          setIsConnected(true)
        } else {
          disconnect()
        }
      })

      window.ethereum.on("chainChanged", () => {
        window.location.reload()
      })
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners("accountsChanged")
        window.ethereum.removeAllListeners("chainChanged")
      }
    }
  }, [])

  return {
    account,
    isConnected,
    isLoading,
    connectWallet,
    disconnect,
  }
}
