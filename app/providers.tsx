"use client";

import "@/lib/i18n/i18n";
import i18n from "@/lib/i18n/i18n";
import { persistor, store, useAppDispatch } from "@store/store";
import {
  selectIsAuthenticated,
  setUserMeData,
} from "@store/features/authSlice";
import { UsersService } from "@/lib/api/users.service";
import { ThemeProvider } from "next-themes";
import { useEffect, useRef } from "react";
import { I18nextProvider } from "react-i18next";
import { Provider as ReduxProvider } from "react-redux";
import { useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ROUTES } from "@/constants/routes";

const ThemeAndLanguageInitializer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useAppDispatch();
  const prevIsAuthRef = useRef<boolean | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    UsersService.getMe()
      .then((response) => {
        dispatch(setUserMeData(response.data));
      })
      .catch((err) => {
        // httpClient already dispatches logout() + clears cookies when the
        // refresh token is invalid (see http-client.ts catch block).
        // Do NOT dispatch logout() here — any transient error (500, network
        // blip, timeout) would otherwise log the user out unnecessarily.
        console.error("[users/me] error:", err);
      });
  }, [dispatch, isAuthenticated]);

  // Session expiry: httpClient dispatches logout() on 401 → isAuthenticated: true → false.
  // Use window.location (full reload) so middleware re-checks cookies and
  // bfcache entries for protected pages are cleared.
  useEffect(() => {
    if (prevIsAuthRef.current === true && !isAuthenticated) {
      window.location.replace(ROUTES.signin);
    }
    prevIsAuthRef.current = isAuthenticated;
  }, [isAuthenticated]);

  // bfcache guard: browser Back button restores pages without HTTP requests,
  // bypassing middleware. pageshow fires with e.persisted=true on bfcache restore.
  useEffect(() => {
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted && !isAuthenticated) {
        window.location.replace(ROUTES.signin);
      }
    };
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, [isAuthenticated]);

  return children;
};

export function Providers({ children }: { children: React.ReactNode }) {
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
              {children}
            </ThemeAndLanguageInitializer>
          </ThemeProvider>
        </I18nextProvider>
      </PersistGate>
    </ReduxProvider>
  );
}
