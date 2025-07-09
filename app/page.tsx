"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Wallet, RefreshCw } from "lucide-react"
import { useWallet } from "@/hooks/useWallet"
import { useContract } from "@/hooks/useContract"
import { WalletConnection } from "@/components/wallet-connection"
import { TokenBalance } from "@/components/token-balance"
import { SwapForm } from "@/components/swap-form"
import { PriceDisplay } from "@/components/price-display"

export default function SwapInterface() {
  const { account, isConnected, connectWallet, disconnect } = useWallet()
  const { swapAForB, swapBForA, getPrice, getTokenABalance, getTokenBBalance, loading, error } = useContract()

  const [tokenABalance, setTokenABalance] = useState("0")
  const [tokenBBalance, setTokenBBalance] = useState("0")
  const [priceAToB, setPriceAToB] = useState("0")
  const [priceBToA, setPriceBToA] = useState("0")

  const refreshBalances = async () => {
    if (!isConnected || !account) return

    try {
      const [balanceA, balanceB] = await Promise.all([getTokenABalance(account), getTokenBBalance(account)])
      setTokenABalance(balanceA)
      setTokenBBalance(balanceB)
    } catch (err) {
      console.error("Error fetching balances:", err)
    }
  }

  const refreshPrices = async () => {
    try {
      const [priceA, priceB] = await Promise.all([
        getPrice("1", "A"), // 1 token A to B
        getPrice("1", "B"), // 1 token B to A
      ])
      setPriceAToB(priceA)
      setPriceBToA(priceB)
    } catch (err) {
      console.error("Error fetching prices:", err)
    }
  }

  useEffect(() => {
    if (isConnected) {
      refreshBalances()
      refreshPrices()
    }
  }, [isConnected, account])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">SimpleSwap</h1>
          <p className="text-gray-600">Swap tokens seamlessly on Sepolia network</p>
          <p className="text-sm text-gray-500 font-mono">Contract: 0x49F6fBbf46405536EB6a05fc4B21b874B9a879dE</p>
        </div>

        {/* Wallet Connection */}
        <WalletConnection
          isConnected={isConnected}
          account={account}
          onConnect={connectWallet}
          onDisconnect={disconnect}
        />

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Main Interface */}
        {isConnected ? (
          <div className="space-y-6">
            {/* Token Balances */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Your Balances
                  <Button variant="outline" size="sm" onClick={refreshBalances} disabled={loading}>
                    <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <TokenBalance tokenName="Token A" balance={tokenABalance} symbol="TKA" />
                <TokenBalance tokenName="Token B" balance={tokenBBalance} symbol="TKB" />
              </CardContent>
            </Card>

            {/* Price Display */}
            <PriceDisplay priceAToB={priceAToB} priceBToA={priceBToA} onRefresh={refreshPrices} loading={loading} />

            {/* Swap Interface */}
            <Card>
              <CardHeader>
                <CardTitle>Swap Tokens</CardTitle>
                <CardDescription>Exchange your tokens instantly</CardDescription>
              </CardHeader>
              <CardContent>
                <SwapForm
                  onSwapAForB={swapAForB}
                  onSwapBForA={swapBForA}
                  loading={loading}
                  onSuccess={refreshBalances}
                />
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Wallet className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Connect Your Wallet</h3>
              <p className="text-gray-600 mb-4">Connect your wallet to start swapping tokens</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
