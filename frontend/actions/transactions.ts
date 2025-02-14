"use server"

import { getCookie } from './auth';
import { TTopup, TTransfer } from '@/types';

const API_URL = process.env.API_URL;

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second delay between retries

export const getUserTransactions = async (page = 1, size = 5) => {
  let attempts = 0;

  while (attempts < MAX_RETRIES) {
    try {
      const token = await getCookie();
      const response = await fetch(`${API_URL}/transactions?page=${page}&size=${size}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        },
        method: "GET",
      });

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      attempts++;
      console.error(`Attempt ${attempts} failed:`, error?.message);

      if (attempts === MAX_RETRIES) {
        throw new Error(`Failed to fetch transactions after ${MAX_RETRIES} attempts: ${error?.message}`);
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    }
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
    return data;
  }
  catch (error: any) {
    console.error(error?.message);
    throw new Error(error?.message)
  }
};