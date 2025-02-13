'use server'

import axios from 'axios';
import { ICredentials } from "@/types"
import { cookies } from 'next/headers';

const API_URL = process.env.API_URL;
const COOKIE_NAME = process.env.COOKIE_NAME || 'dgw-a-tkn'

export const loginUser = async (credentials: ICredentials) => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(credentials)
    });
    const data = await response.json();
    if (response.ok) return data;
    throw new Error(data?.message)
  }
  catch (error: any) {
    return {
      statusCode: null,
      message: error?.message,
      data: null,
    }
  }
};

export const registerUser = async (credentials: any) => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(credentials)
    });
    const data = await response.json();
    if (response.ok) return
    throw new Error(data?.message)
  }
  catch (error: any) {
    console.log(error?.message)
    return {
      statusCode: null,
      message: error?.message,
      data: null,
    }
  }
};

export const setCookie = async (token: string) => {
  const cookieStore = await cookies()
  const expires = new Date()
  expires.setHours(expires.getHours() + 2)

  cookieStore.set(COOKIE_NAME, token, {
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    expires: expires,
    sameSite: 'lax',
  })
}

export const getCookie = async () => {
  const cookieStore = await cookies()
  return cookieStore.get(COOKIE_NAME)?.value;
}

export const deleteCookie = async (cookieName: string) => {
  const cookieStore = await cookies()
  return cookieStore.delete(cookieName);
}

export const deleteAuthCookie = async () => {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME);
  return {}
}