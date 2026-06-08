// Demo auth — always returns the demo user as logged in.
// Replace with real Supabase auth calls when connecting the database.

import { DEMO_USER_ID, MOCK_USERS } from "./mock";

export const DEMO_USER = MOCK_USERS.find((u) => u.id === DEMO_USER_ID)!;

export function getDemoUser() {
  return DEMO_USER;
}

export function isDemoAdmin() {
  return DEMO_USER.role === "admin";
}
