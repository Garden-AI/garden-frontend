import { auth } from "@globus/sdk";

export interface StorageSystem {
    get(key: string): any | undefined;
    set(key: string, value: any): void;
    remove(key: string): void;
    clear(): void;
}

type GlobusScope = string;

export type FetchOverrides =
  | (Omit<RequestInit, "headers"> & {
      headers?: Record<string, string>;
    })
  | undefined;

export class LocalStorage implements StorageSystem {
  get(key: string) {
    const value = localStorage.getItem(key);
    return value !== null ? JSON.parse(value) : null;
  }

  set(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  remove(key: string) {
    localStorage.removeItem(key);
  }

  clear() {
    localStorage.clear();
  }
}

function isValidToken(check: unknown): check is auth.Token {
    const maybe = check as auth.Token;
    return Boolean(maybe.token_type && maybe.access_token);
  }

export function getTokenForScope(scope: string) {
    const storage = new LocalStorage()
    const token = storage.get(scope);
    if (!token || !isValidToken(token)) {
      return null;
    }
    return `${token.token_type} ${token.access_token}`;
  }

export function fetchWithScope(
    scope: GlobusScope,
    input: RequestInfo | URL,
    fetchOverrides: FetchOverrides = {}
) {
    const headers = fetchOverrides.headers || {};
    /**
     * If an `Authorization` override header was provided, we skip any
     * sort of lookup and use the provided value.
     */
    if (!headers?.["Authorization"]) {
    const token = getTokenForScope(scope);
    if (token) {
        headers["Authorization"] = token;
    }
    }
    return fetch(input, {
    ...fetchOverrides,
    headers,
    });
}