"use client"

import TransferMoney from "@/components/TransferMoney"
import TopUpAccount from "@/components/TopUpAccount"
import TransactionHistory from "@/components/TransactionHistory"
import { useProfileStore } from "@/store/profile"
import { useEffect } from "react"
import { useTransactionStore } from "@/store/transaction"

export default function DashboardPage() {

  const { loading, getProfile, username, walletId, balance } = useProfileStore()
  const { getTransactions } = useTransactionStore()
  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    getProfile()
      .then(() => getTransactions())
  }

  return (
    <>
      <div className="w-full flex justify-between mb-8">
        <div className="font-semibold tracking-tighter z-10">
          <h3 className="">{username}</h3>
          <p className="text-sm font-thin">{walletId?.slice(0, 10)}********</p>
        </div>
        <div className="z-10 flex gap-2 ">
          <p className="text-sm font-bold text-gray-300">Balance:</p>
          <h3 className="text-3xl font-bold">{balance?.toFixed(2)} ZMW</h3>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 z-50">
        <TransferMoney />
        <TopUpAccount />
      </div>
      <TransactionHistory />
    </>
  )
}

