import { createContext, useContext } from "react";
import { PEOPLE } from "../data/constants";

export type Person = (typeof PEOPLE)[number];

export const UserContext = createContext<{
  user: Person;
  setUser: (u: Person) => void;
}>({
  user: PEOPLE[0],
  setUser: () => {},
});

export function useUser() {
  return useContext(UserContext);
}

const USER_KEY = "saywhat.user";

export function loadStoredUser(): Person {
  try {
    const v = localStorage.getItem(USER_KEY);
    if (v && (PEOPLE as readonly string[]).includes(v)) return v as Person;
  } catch {
    // ignore
  }
  return PEOPLE[0];
}

export function storeUser(u: Person) {
  try {
    localStorage.setItem(USER_KEY, u);
  } catch {
    // ignore
  }
}
