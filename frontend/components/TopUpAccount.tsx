"use client"

import { useState, useTransition } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Button } from "./ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { useTransactionStore } from "@/store/transaction"
import { Spinner } from "./ui/spinner"
import { useRouter } from "next/navigation"
import { useProfileStore } from "@/store/profile"
import { toast } from "sonner"

export default function TopUpAccount() {

  const { amount, setAmount, setType, setDescription, topupWallet, getTransactions } = useTransactionStore()
  const { getProfile } = useProfileStore()
  const [method, setMethod] = useState("")
  const [topupLoading, setTopupLoading] = useState(false);


  const handleTopUp = async (e: React.FormEvent) => {
    setTopupLoading(true);
    e.preventDefault()
    setType("Topup")
    setDescription(`Top up from ${method}`)
    const responseOk = await topupWallet()
    if (responseOk) {
      // Reset
      await getProfile();
      await getTransactions()
      resetFields()
      toast.success("Topped up successfully")
    }
    else {
      toast.error("something went wrong")
    }
    setTopupLoading(false);
  }

  function resetFields() {
    setMethod("")
    setAmount(0)
    setDescription("")
  }

  return (
    <Card className="z-10 border-[1px] border-blue-500/30">
      <CardHeader>
        <CardTitle>Top Up Account</CardTitle>
        <CardDescription>Add funds to your wallet</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleTopUp}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="topup-amount">Amount</Label>
              <Input
                id="topup-amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                required
                min="0.01"
                step="0.01"
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="topup-method">Payment Method</Label>
              <Select value={method} onValueChange={setMethod} required>
                <SelectTrigger id="topup-method">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="card">Credit/Debit Card</SelectItem>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button type="submit" className="w-full mt-4">
            {topupLoading ? <Spinner className="z-10 text-white" size={"large"} /> : "Top Up"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

