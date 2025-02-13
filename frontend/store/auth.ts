import { create } from 'zustand';
import { deleteAuthCookie, deleteCookie, loginUser, registerUser, setCookie } from '@/actions/auth';
import { useRouter } from 'next/navigation';
import { ICredentials } from '../types';

interface AuthState {
  user: any | null;
  token: string | null;
  loading: boolean;
  login: (credentials: ICredentials) => Promise<void>;
  register: (credentials: any) => Promise<boolean>;
  logout: () => void;

}


export const useAuthStore = create<AuthState>((set) => ({
  loading: false,
  user: null,
  token: null,
  login: async (credentials) => {
    try {
      set({ loading: true })
      const response: any = await loginUser(credentials);
      if (response?.statusCode != null) {
        const { data: { token } } = response;
        await setCookie(token);
        set({ loading: false })
        return
      }
      throw new Error(response?.message)
    } catch (error: any) {
      alert(error?.message)
      set({ loading: false })
    }
  },
  register: async (credentials: any) => {
    try {
      set({ loading: true })
      const response: any = await registerUser(credentials);
      if (response?.statusCode != null) {
        const { message } = response;
        alert(message);
        set({ loading: false })
        return true;
      }
      throw new Error(response?.message)
    } catch (error: any) {
      alert(error?.message)
      set({ loading: false })
      return false;
    }
  },
  setLoading: (loading: boolean) => {
    set({ loading })
  },
  logout: async () => {
    await deleteAuthCookie();
    set({ user: null, token: null });
  },
}));

export const useAuth = () => {
  const router = useRouter();
  const { token, user, login, logout, register } = useAuthStore();

  return {
    token,
    user,
    login: async (credentials: { username: string; password: string }) => {
      try {
        await login(credentials);
        router.push('/dashboard');
      } catch (error) {
        throw error;
      }
    },
    register: async (credentials: { username: string; email: string, password: string }) => {
      try {
        const responseOk = await register(credentials);
        if (responseOk) router.push('/login');
      } catch (error) {
        throw error;
      }
    },
    logout: () => {
      logout();
      router.push('/login');
    },
  };
};