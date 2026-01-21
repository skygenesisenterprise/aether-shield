import { useState, useRef, useEffect, useCallback } from "react";

export interface UseLiveDataOptions<T> {
  generateData: (currentData?: T) => T;
  interval: number;
  initialData: T;
  autoPlay?: boolean;
}

export function useLiveData<T>({
  generateData,
  interval,
  initialData,
  autoPlay = true,
}: UseLiveDataOptions<T>) {
  const [data, setData] = useState<T>(initialData);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (autoPlay) {
      setIsPlaying(true);
    }
  }, [autoPlay]);

  const start = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const stop = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const reset = useCallback(() => {
    setData(initialData);
  }, [initialData]);

  const toggle = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  useEffect(() => {
    if (isPlaying && isClient) {
      intervalRef.current = setInterval(() => {
        setData((currentData) => generateData(currentData));
      }, interval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, interval, generateData, isClient]);

  return {
    data,
    isPlaying,
    start,
    stop,
    reset,
    toggle,
  };
}
