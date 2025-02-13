import { getUserTransactions, topUpAccount, transfer } from "@/actions/transactions";
import { create } from "zustand"
import { TOkResponse, TSearchedUser, TTransactionActions, TTransactionState } from "@/types";
import { searchByUsername } from "@/actions/search";

const initialState = {
  amount: 0,
  type: "",
  description: "",
  currency: "ZMW",
  receiverWalletId: "",
  transactions: [],
  loading: false,
}

export const useTransactionStore = create<TTransactionState & TTransactionActions>((set, get) => ({
  ...initialState,
  getTransactions: async () => {
    try {
      set({ loading: true })
      const { data: { transactions } } = await getUserTransactions();
      set({
        transactions,
        loading: false
      })
    }
    catch (error: any) {
      set({
        loading: false,
      })
      console.error(error?.message)
    }
  },
  topupWallet: async () => {
    try {
      // Create Top Up Object
      const topup = {
        amount: get().amount,
        type: get().type,
        description: get().description
      }
      const response = await topUpAccount(topup);
      return true;
    }
    catch (error: any) {
      console.error(error?.message)
      return false;
    }
  },
  transferMoney: async () => {
    try {
      // Create Transfer Object
      const transferObj = {
        amount: get().amount,
        type: get().type,
        description: get().description,
        currency: get().currency,
        receiverWalletId: get().receiverWalletId
      }
      const response = await transfer(transferObj);
      return true;
    }
    catch (error: any) {
      console.error(error?.message)
      return false;
    }
  },
  searchUser: async (username: string) => {
    try {
      const { data: { users } }: TOkResponse = await searchByUsername(username);
      const userList: TSearchedUser[] = users;
      return userList;
    }
    catch (error: any) {
      console.error(error?.message)
      return [];
    }
  },
  setAmount: (amount: number) => {
    set({ amount })
  },
  setType: (type: string) => {
    set({ type })
  },
  setDescription: (description: string) => {
    set({ description })
  },
  setReceiverWalletId: (receiverWalletId: string) => {
    set({ receiverWalletId })
  }
}))