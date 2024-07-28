'use client';
import React, { useEffect, useRef } from 'react';
import { Provider } from 'react-redux';
import { AppStore, makeStore } from '@/lib/store';
import { setupListeners } from '@reduxjs/toolkit/query';

export default function StoreProvider({ children }: {
  children: React.ReactNode
}) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore();
  }
  useEffect(() => {
    if (storeRef.current != null) {
      // configure listeners using the provided defaults
      // optional, but required for `refetchOnFocus`/`refetchOnReconnect` behaviors
      return setupListeners(storeRef.current!.dispatch);
    }
  }, []);
  
  return <Provider store={storeRef.current!}>{children}</Provider>;
}