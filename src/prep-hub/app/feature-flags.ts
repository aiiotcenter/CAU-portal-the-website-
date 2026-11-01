/**
 * CAU English Prep Hub — Feature Flags
 * Section 33 of Enhanced Architecture Specification
 */
import { FeatureFlags, DEFAULT_FEATURE_FLAGS } from "../domain/types";

let currentFlags: FeatureFlags = { ...DEFAULT_FEATURE_FLAGS };

export function getFeatureFlags(): FeatureFlags {
  return { ...currentFlags };
}

export function isFeatureEnabled(flag: keyof FeatureFlags): boolean {
  return !!currentFlags[flag];
}

export function setFeatureFlag(flag: keyof FeatureFlags, enabled: boolean): void {
  currentFlags[flag] = enabled;
  if (typeof localStorage !== "undefined") {
    try {
      localStorage.setItem("cau_feature_flags", JSON.stringify(currentFlags));
    } catch {}
  }
}

export function loadFeatureFlags(): FeatureFlags {
  if (typeof localStorage !== "undefined") {
    try {
      const stored = localStorage.getItem("cau_feature_flags");
      if (stored) {
        currentFlags = { ...DEFAULT_FEATURE_FLAGS, ...JSON.parse(stored) };
      }
    } catch {}
  }
  return getFeatureFlags();
}
