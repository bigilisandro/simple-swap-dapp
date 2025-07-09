"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ArrowUpDown } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface SwapFormProps {
  onSwapAForB: (amount: string) => Promise<string>
  onSwapBForA: (amount: string) => Promise<string>
  loading: boolean
  onSuccess: () => void
}

export function SwapForm({ onSwapAForB, onSwapBForA, loading, onSuccess }: SwapFormProps) {
  const [amountA, setAmountA] = useState("")
  const [amountB, setAmountB] = useState("")
  const [txHash, setTxHash] = useState<string | null>(null)
  const [localError, setLocalError] = useState<string | null>(null)

  const handleSwapAForB = async () => {
    if (!amountA || Number.parseFloat(amountA) <= 0) {
      setLocalError("Please enter a valid amount")
      return
    }

    setLocalError(null)
    setTxHash(null)

    try {
      const hash = await onSwapAForB(amountA)
      setTxHash(hash)
      setAmountA("")
      onSuccess()
    } catch (error) {
      console.error("Swap failed:", error)
    }
  }

  const handleSwapBForA = async () => {
    if (!amountB || Number.parseFloat(amountB) <= 0) {
      setLocalError("Please enter a valid amount")
      return
    }

    setLocalError(null)
    setTxHash(null)

    try {
      const hash = await onSwapBForA(amountB)
      setTxHash(hash)
      setAmountB("")
      onSuccess()
    } catch (error) {
      console.error("Swap failed:", error)
    }
  }

  return (
    <div className="space-y-6">
      {/* Swap A for B */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <Label className="text-lg font-semibold">Swap Token A → Token B</Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amountA">Amount (TKA)</Label>
          <Input
            id="amountA"
            type="number"
            placeholder="0.0"
            value={amountA}
            onChange={(e) => setAmountA(e.target.value)}
            disabled={loading}
          />
        </div>

        <Button onClick={handleSwapAForB} disabled={loading || !amountA} className="w-full">
          {loading ? "Swapping..." : "Swap A → B"}
        </Button>
      </div>

      <div className="flex items-center justify-center">
        <Separator className="flex-1" />
        <ArrowUpDown className="h-5 w-5 mx-4 text-gray-400" />
        <Separator className="flex-1" />
      </div>

      {/* Swap B for A */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <Label className="text-lg font-semibold">Swap Token B → Token A</Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="amountB">Amount (TKB)</Label>
          <Input
            id="amountB"
            type="number"
            placeholder="0.0"
            value={amountB}
            onChange={(e) => setAmountB(e.target.value)}
            disabled={loading}
          />
        </div>

        <Button
          onClick={handleSwapBForA}
          disabled={loading || !amountB}
          className="w-full bg-transparent"
          variant="outline"
        >
          {loading ? "Swapping..." : "Swap B → A"}
        </Button>
      </div>

      {/* Error Display */}
      {localError && (
        <Alert variant="destructive">
          <AlertDescription>{localError}</AlertDescription>
        </Alert>
      )}

      {/* Success Display */}
      {txHash && (
        <Alert>
          <AlertDescription>
            Transaction successful! Hash:
            <a
              href={`https://sepolia.etherscan.io/tx/${txHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 text-blue-600 hover:underline font-mono"
            >
              {txHash.slice(0, 10)}...
            </a>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
