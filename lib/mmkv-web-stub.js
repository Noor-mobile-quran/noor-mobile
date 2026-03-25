// Web stub for react-native-mmkv.
// MMKV is a native-only library; lib/storage.ts uses localStorage on web.
// This stub prevents react-native-nitro-modules from initializing on web.
export class MMKV {
  constructor() {
    throw new Error("MMKV is not available on web. Use lib/storage.ts which falls back to localStorage.");
  }
}
export function createMMKV() {
  return null;
}
export function useMMKV() {
  return null;
}
export function useMMKVString() {
  return [undefined, () => {}];
}
export function useMMKVNumber() {
  return [undefined, () => {}];
}
export function useMMKVBoolean() {
  return [undefined, () => {}];
}
export function useMMKVObject() {
  return [undefined, () => {}];
}
export function useMMKVListener() {}
export function useMMKVKeys() {
  return [];
}
export function existsMMKV() {
  return false;
}
export function deleteMMKV() {}
