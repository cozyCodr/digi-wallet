"use server"

import { getCookie } from './auth';

const API_URL = process.env.API_URL;

export const searchByUsername = async (username: string) => {
  try {
    const token = await getCookie();
    const response = await fetch(`${API_URL}/users/search?username=${username}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      },
    });
    const data = await response.json();
    return data;
  }
  catch (error: any) {
    console.error(error?.message);
    throw new Error(error?.message)
    return {
      error: true,
      errorM: error?.message
    }
  }
};