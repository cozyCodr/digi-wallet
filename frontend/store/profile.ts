import { getUserProfile } from "@/actions/profile";
import { create } from "zustand";
import { TProfileState, TProfileActions } from "@/types";


const initialState = {
  email: "",
  username: "",
  walletId: "",
  balance: 0,
  loading: false,
  error: false,
  errorMessage: "",
}

export const useProfileStore = create<TProfileState & TProfileActions>((set) => ({
  ...initialState,
  getProfile: async () => {
    try {
      set({ loading: true })
      const { data: { email, username, balance, walletId } } = await getUserProfile();
      set({
        email,
        walletId,
        username,
        balance,
        loading: false
      })

    }
    catch (error: any) {
      set({
        loading: false,
        error: true,
        errorMessage: error?.message
      })
    }
  }
}))