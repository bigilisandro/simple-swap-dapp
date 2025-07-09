"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, LogOut } from "lucide-react"

interface WalletConnectionProps {
  isConnected: boolean
  account: string | null
  onConnect: () => void
  onDisconnect: () => void
}

export function WalletConnection({ isConnected, account, onConnect, onDisconnect }: WalletConnectionProps) {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Wallet className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium">{isConnected ? "Wallet Connected" : "Wallet Status"}</p>
              {isConnected && account && <p className="text-sm text-gray-600 font-mono">{formatAddress(account)}</p>}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant={isConnected ? "default" : "secondary"}>{isConnected ? "Connected" : "Disconnected"}</Badge>

            {isConnected ? (
              <Button variant="outline" size="sm" onClick={onDisconnect}>
                <LogOut className="h-4 w-4 mr-2" />
                Disconnect
              </Button>
            ) : (
              <Button onClick={onConnect}>
                <Wallet className="h-4 w-4 mr-2" />
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
