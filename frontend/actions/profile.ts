"use server"

import { getCookie } from './auth';

const API_URL = process.env.API_URL;

export const getUserProfile = async () => {
  const token = await getCookie();
  const response = await fetch(`${API_URL}/profile`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  if (response.ok) {
    return await response.json();
  }
  else {
    const { message } = await response.json();
    throw new Error(message);
  }
};