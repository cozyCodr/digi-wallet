"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useTransactionStore } from "@/store/transaction"
import moment from "moment"
import { useProfileStore } from "@/store/profile"

// Mock data for transactions

export default function TransactionHistory() {
  const { transactions, loading } = useTransactionStore()
  const { walletId } = useProfileStore()

  return (
    <Card className="mt-6 z-10 border-[1px] border-blue-500/30">
      <CardHeader className="">
        <CardTitle className="z-10">Transaction History</CardTitle>
        <CardDescription className="z-10">Your recent account activity</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions && transactions?.map((transaction) => {

              let transactionDescription = transaction.description;
              let transactionType = transaction.type;
              if (transactionType == "Transfer") {
                if (walletId == transaction.receiverWalletId) {
                  transactionType = "Received";
                  transactionDescription = `Received from ${transaction.sender}`
                }
              }

              return (<TableRow key={transaction.id}>
                <TableCell>{moment(transaction.timestamp).fromNow()}</TableCell>
                <TableCell>{transactionDescription}</TableCell>
                <TableCell className={transactionType == "Transfer" ? "text-red-500" : "text-green-500"}>
                  ${Math.abs(transaction.amount).toFixed(2)}
                </TableCell>
                <TableCell className="capitalize">{transactionType}</TableCell>
              </TableRow>)
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

