"use server"

import { revalidatePath } from 'next/cache';
import { getCookie } from './auth';
import { TTopup, TTransfer } from '@/types';

const API_URL = process.env.API_URL;

export const getUserTransactions = async (page = 1, size = 5) => {
  try {
    const token = await getCookie();
    const response = await fetch(`${API_URL}/transactions?page=${page}&size=${size}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      },
      method: "GET",
    });
    const data = await response.json();
    return data;
  }
  catch (error: any) {
    console.error(error?.message);
    // throw new Error(error?.message)
  }
};

export const topUpAccount = async (topup: TTopup) => {
  try {
    const token = await getCookie();
    const response = await fetch(`${API_URL}/transactions/topup`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-TYpe": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        ...topup
      })
    });
    const data = await response.json();
    revalidatePath("/dashboard")
    return data;
  }
  catch (error: any) {
    console.error(error?.message);
    throw new Error(error?.message)
  }
};

export const transfer = async (transfer: TTransfer) => {
  try {
    const token = await getCookie();
    const response = await fetch(`${API_URL}/transactions/transfer`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-TYpe": "application/json"
      },
      method: "POST",
      body: JSON.stringify({
        ...transfer
      })
    });
    const data = await response.json();
    revalidatePath("/dashboard")
    return data;
  }
  catch (error: any) {
    console.error(error?.message);
    throw new Error(error?.message)
  }
};