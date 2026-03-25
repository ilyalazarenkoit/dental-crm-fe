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
import { useRouter } from "next/navigation";
import { ROUTES } from "@/constants/routes";

// Task 7: use reactive useSelector instead of store.getState() snapshot.
// store.getState() is not reactive — changes to isAuthenticated after first
// render would never trigger a re-run of the useEffect.
const ThemeAndLanguageInitializer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useAppDispatch();
  const router = useRouter();
  // Track previous value to detect true→false transition only.
  // This prevents redirecting public pages that start with isAuthenticated=false.
  const prevIsAuthRef = useRef<boolean | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    UsersService.getMe()
      .then((response) => {
        dispatch(setUserMeData(response.data));
      })
      .catch((err) => {
        console.error("[users/me] error:", err);
      });
  }, [dispatch, isAuthenticated]);

  // Redirect to signin only when session is lost mid-session (true → false).
  // httpClient dispatches logout() on 401 from refresh — this effect reacts.
  useEffect(() => {
    if (prevIsAuthRef.current === true && !isAuthenticated) {
      router.replace(ROUTES.signin);
    }
    prevIsAuthRef.current = isAuthenticated;
  }, [isAuthenticated, router]);

  return children;
};

// Task 2: Removed mounted/useState/useEffect guard that returned null before
// first client render. That pattern caused a full white flash on every page
// load and disabled SSR completely.
// ThemeProvider handles its own hydration safely via suppressHydrationWarning
// on <html> (set in layout.tsx).
//
// Task 3: Removed <LoadScript> (Google Maps) from global providers.
// ~200KB Google Maps JS was loaded on every page including login/register.
// LoadScript must be placed in the specific component that actually needs a map.
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
