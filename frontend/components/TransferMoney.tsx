"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Button } from "./ui/button"
import { useTransactionStore } from "@/store/transaction"
import { TSearchedUser } from "@/types"
import { User } from "lucide-react"
import { Spinner } from "./ui/spinner"
import { useRouter } from "next/navigation"
import { useProfileStore } from "@/store/profile"

export default function TransferMoney() {
  const { amount, setAmount, searchUser, getTransactions, setReceiverWalletId, setType, setDescription, transferMoney } = useTransactionStore()
  const [searchLoading, setSearchLoading] = useState(false);
  const [transferLoading, setTransferLoading] = useState(false);
  const [searchString, setSearchString] = useState("");
  const [users, setUsers] = useState<TSearchedUser[] | []>([])
  const [selectedUser, setSelectedUser] = useState<TSearchedUser | null>(null)
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const { getProfile, balance } = useProfileStore()
  const router = useRouter()

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser) return;
    setTransferLoading(true)
    if (selectedUser == null) {
      alert("Please select a user you wish to send money to!")
      return;
    }
    setType("Transfer")
    setDescription(`Transfer to ${selectedUser?.username}`)
    setReceiverWalletId(selectedUser.walletId);
    const responseOk = await transferMoney()
    if (responseOk) {
      // Reset

      resetFields()
      await getProfile()
      await getTransactions()
      alert("transaction completed successfully")
    }
    else {
      console.error("something went wrong")
    }
    setTransferLoading(false);
  }

  async function search() {
    setSearchLoading(true);
    const results = await searchUser(searchString);
    setUsers(results);
    setSearchLoading(false);
  }

  function resetFields() {
    setReceiverWalletId("")
    setAmount(0)
    setDescription("")
  }

  // Set up search for 3 characters or more
  useEffect(() => {
    if (searchString.length >= 3) {
      search();
    }
    else if (searchString.length == 0) {
      setUsers([]);
    }
  }, [searchString])

  return (
    <>
      <Card className="z-10 border-[1px] border-blue-500/30">
        <CardHeader>
          <CardTitle>Transfer Money</CardTitle>
          <CardDescription>Send money to another account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleTransfer}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="recipient">Recipient</Label>
                <div
                  onClick={() => setSearchDialogOpen(true)}
                  className="text-sm text-gray-700 p-2 border rounded-md cursor-pointer border-slate-600/80 hover:bg-slate-800 hover:text-white/35">
                  {selectedUser ? selectedUser?.username : "Search user"}
                </div>
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  required
                  min="0.01"
                  max={balance}
                  step="0.01"
                />
              </div>
            </div>
            <Button type="submit" className="w-full mt-4">
              {transferLoading ? <Spinner className="z-10 text-white" size={"large"} /> : "Transfer"}
            </Button>

          </form>
        </CardContent>
      </Card>
      {
        searchDialogOpen && (
          <div onClick={() => setSearchDialogOpen(false)} className="w-full h-screen absolute left-0 top-0 bg-black/40 z-50 flex justify-center ">
            <div className="flex flex-col max-w-7xl w-full h-full items-center p-10 gap-10">
              <div className="w-fit flex pr-2 rounded-md relative">
                <Input
                  id="searchString"
                  type="text"
                  placeholder="Type username"
                  value={searchString}
                  onChange={(e) => setSearchString(e.target.value)}
                  required
                  className="w-full min-w-[250px] max-w-[500px] pr-[37px]"
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                />
                <div className="flex items-center justify-center absolute right-[15px] top-[8px]">
                  {searchLoading && <Spinner size={"small"} />}
                </div>
              </div>

              {/* User List */}
              <div className="w-full flex flex-col gap-2 items-center max-w-3xl" onClick={(e) => {
                e.stopPropagation()
              }}>
                {
                  users && users.map((user, index) => (
                    <div
                      key={index}
                      onClick={() => {
                        setSelectedUser(user)
                        setSearchDialogOpen(false);
                      }}
                      className="flex gap-2 w-full bg-slate-400/10 p-2 rounded-md cursor-pointer"
                    >
                      <div className="text-blue-400 bg-blue-100 w-fit h-fit p-2 rounded-lg flex justify-center items-center">
                        <User />
                      </div>
                      <div>
                        <h3 className="font-semibold trackign-tight">{user?.username}</h3>
                        <p className="text-xs font-thin">{user?.walletId.slice(0, 10)}******</p>
                      </div>
                    </div>
                  ))
                }

              </div>
            </div>
          </div >
        )
      }
    </>
  )
}

