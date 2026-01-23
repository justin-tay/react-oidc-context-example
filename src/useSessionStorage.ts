import { useState, useEffect } from "react";

/**
 * Custom hook to sync state with sessionStorage
 * @param key - The key under which the value is stored in sessionStorage
 * @param initialValue - The initial value if nothing is stored yet
 */
export function useSessionStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const storedValue = sessionStorage.getItem(key);
      return storedValue !== null ? (JSON.parse(storedValue) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading sessionStorage key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Error setting sessionStorage key "${key}":`, error);
    }
  }, [key, value]);

  return [value, setValue] as const;
}
