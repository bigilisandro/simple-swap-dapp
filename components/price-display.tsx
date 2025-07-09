"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RefreshCw, TrendingUp } from "lucide-react"

interface PriceDisplayProps {
  priceAToB: string
  priceBToA: string
  onRefresh: () => void
  loading: boolean
}

export function PriceDisplay({ priceAToB, priceBToA, onRefresh, loading }: PriceDisplayProps) {
  const formatPrice = (price: string) => {
    const num = Number.parseFloat(price)
    if (num === 0) return "0.00"
    if (num < 0.0001) return "< 0.0001"
    return num.toFixed(6)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            Current Prices
          </div>
          <Button variant="outline" size="sm" onClick={onRefresh} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="text-center">
              <p className="text-sm text-green-700 font-medium">1 TKA =</p>
              <p className="text-2xl font-bold text-green-800">{formatPrice(priceAToB)} TKB</p>
            </div>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-center">
              <p className="text-sm text-blue-700 font-medium">1 TKB =</p>
              <p className="text-2xl font-bold text-blue-800">{formatPrice(priceBToA)} TKA</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
