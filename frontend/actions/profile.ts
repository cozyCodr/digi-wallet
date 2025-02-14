"use server"

import { getCookie } from './auth';

const API_URL = process.env.API_URL;

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second delay between retries


export const getUserProfile = async () => {
  let attempts = 0;

  while (attempts < MAX_RETRIES) {
    try {
      const token = await getCookie();
      const response = await fetch(`${API_URL}/profile`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
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
        throw new Error(`Failed to fetch profile after ${MAX_RETRIES} attempts: ${error?.message}`);
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    }
  }
};