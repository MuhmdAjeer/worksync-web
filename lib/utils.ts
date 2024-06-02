import axios from "axios";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export const isDuplicateError = (error: Error): boolean => {
  if (
    error instanceof Error &&
    axios.isAxiosError(error) &&
    error.response?.status === 409
  ) {
    return true;
  }
  return false;
};

export const isNotFoundError = (error: Error): boolean => {
  if (
    error instanceof Error &&
    axios.isAxiosError(error) &&
    error.response?.status === 404
  ) {
    return true;
  }
  return false;
};

export const is4xxError = (error: Error, errorCode: number): boolean => {
  if (
    error instanceof Error &&
    axios.isAxiosError(error) &&
    error.response?.status === errorCode
  ) {
    return true;
  }
  return false;
};
