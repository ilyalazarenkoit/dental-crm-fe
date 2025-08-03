"use client";

import "@/lib/i18n/i18n";
import i18n from "@/lib/i18n/i18n";
import { LoadScript } from "@react-google-maps/api";
import { persistor, store, useAppDispatch } from "@store/store";
import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";
import { I18nextProvider } from "react-i18next";
import { Provider as ReduxProvider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

const ThemeAndLanguageInitializer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const isAuthenticated = store.getState().auth.isAuthenticated;
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      /** Load app settings/options/.. */
    }
  }, [dispatch, isAuthenticated]);

  return children;
};

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ReduxProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <I18nextProvider i18n={i18n}>
          <ThemeProvider
            attribute="class"
            enableSystem={false}
            disableTransitionOnChange
          >
            <ThemeAndLanguageInitializer>
              <LoadScript
                googleMapsApiKey={
                  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
                }
              >
                {children}
              </LoadScript>
            </ThemeAndLanguageInitializer>
          </ThemeProvider>
        </I18nextProvider>
      </PersistGate>
    </ReduxProvider>
  );
}
