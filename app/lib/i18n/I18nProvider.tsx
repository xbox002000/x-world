"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { en, type Messages } from "./locales/en";
import { zhCN } from "./locales/zh-CN";

export type Locale = "en" | "zh-CN";

const STORAGE_KEY = "xworld.locale";
const catalogs: Record<Locale, Messages> = {
  en,
  "zh-CN": zhCN,
};

type Interp = Record<string, string | number>;

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  messages: Messages;
  t: (key: string, params?: Interp) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function getByPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object" && part in (acc as object)) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, obj);
}

function interpolate(template: string, params?: Interp): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, k: string) =>
    params[k] !== undefined ? String(params[k]) : `{${k}}`
  );
}

function readStoredLocale(): Locale {
  if (typeof window === "undefined") return "en";
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === "zh-CN" || raw === "en") return raw;
  } catch {
    /* ignore */
  }
  return "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLocaleState(readStoredLocale());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      /* ignore */
    }
    document.documentElement.lang = locale === "zh-CN" ? "zh-CN" : "en";
  }, [locale, ready]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
  }, []);

  const toggleLocale = useCallback(() => {
    setLocaleState((prev) => (prev === "en" ? "zh-CN" : "en"));
  }, []);

  const messages = catalogs[locale];

  const t = useCallback(
    (key: string, params?: Interp) => {
      const value = getByPath(messages, key);
      if (typeof value === "string") return interpolate(value, params);
      const fallback = getByPath(en, key);
      if (typeof fallback === "string") return interpolate(fallback, params);
      return key;
    },
    [messages]
  );

  const value = useMemo(
    () => ({ locale, setLocale, toggleLocale, messages, t }),
    [locale, setLocale, toggleLocale, messages, t]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error("useI18n must be used within I18nProvider");
  }
  return ctx;
}
