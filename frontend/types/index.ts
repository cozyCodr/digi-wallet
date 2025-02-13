export type TProfileState = {
  username: string,
  email: string,
  balance: number,
  walletId: string,
  loading: boolean,
  error: boolean,
  errorMessage: string
}

export type TProfileActions = {
  getProfile: () => Promise<void>
}

export interface ICredentials {
  username: string,
  password: string
}

export type TOkResponse = {
  message: string,
  statusCode: number,
  data: any
}

export type TSearchedUser = {
  id: string,
  username: string,
  walletId: string
}

export interface TTopup {
  amount: number,
  type: string,
  description: string,
}

export interface TTransfer extends TTopup {
  currency: string,
  receiverWalletId: string
}

export type TTransactionState = {
  amount: number,
  type: string,
  description: string,
  currency: string,
  receiverWalletId: string
  transactions: TTransaction[] | [],
  loading: boolean,
}

export type TTransactionActions = {
  getTransactions: () => Promise<void>,
  topupWallet: () => Promise<boolean>,
  transferMoney: () => Promise<boolean>,
  searchUser: (username: string) => Promise<TSearchedUser[] | []>,
  setAmount: (amount: number) => void,
  setType: (type: string) => void,
  setDescription: (description: string) => void,
  setReceiverWalletId: (receiverWalletId: string) => void,
}

export type TTransaction = {
  amount: number,
  currency: string,
  description: string,
  id: string,
  receiver: string,
  receiverWalletId: string,
  sender: string,
  timestamp: string
  type: string
}