"use client";

import { Provider } from "react-redux";
import { store, persistor } from "@/redux-toolkit/store";
import { PersistGate } from 'redux-persist/integration/react';
import { useEffect } from 'react'


export default function ReduxProvider({ children }) {
  useEffect(() => {
    if (typeof window === 'undefined') return; // Chỉ chạy khi ở client
  }, []);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  )
}
