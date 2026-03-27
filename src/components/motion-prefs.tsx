"use client";

import { createContext, useContext } from "react";

export const MotionPrefsContext = createContext<{ reducedMotion: boolean }>({
  reducedMotion: false,
});

export function useMotionPrefs() {
  return useContext(MotionPrefsContext);
}
