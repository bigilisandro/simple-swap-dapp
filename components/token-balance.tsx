"use client"

interface TokenBalanceProps {
  tokenName: string
  balance: string
  symbol: string
}

export function TokenBalance({ tokenName, balance, symbol }: TokenBalanceProps) {
  const formatBalance = (balance: string) => {
    const num = Number.parseFloat(balance)
    if (num === 0) return "0.00"
    if (num < 0.01) return "< 0.01"
    return num.toFixed(4)
  }

  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-blue-600 font-semibold text-sm">{symbol.charAt(0)}</span>
        </div>
        <div>
          <p className="font-medium">{tokenName}</p>
          <p className="text-sm text-gray-600">{symbol}</p>
        </div>
      </div>

      <div className="text-right">
        <p className="font-semibold text-lg">{formatBalance(balance)}</p>
        <p className="text-sm text-gray-600">{symbol}</p>
      </div>
    </div>
  )
}
