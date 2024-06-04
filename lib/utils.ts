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

export const getRandomEmoji = () => {
  const emojis = [
    "8986",
    "9200",
    "128204",
    "127773",
    "127891",
    "127947",
    "128076",
    "128077",
    "128187",
    "128188",
    "128512",
    "128522",
    "128578",
  ];

  return emojis[Math.floor(Math.random() * emojis.length)];
};

export const convertHexEmojiToDecimal = (emojiUnified: string): string => {
  if (!emojiUnified) return "";

  return emojiUnified
    .split("-")
    .map((e) => parseInt(e, 16))
    .join("-");
};
