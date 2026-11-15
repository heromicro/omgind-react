import { EncryptStorage } from 'encrypt-storage';
import { minutesToMilliseconds } from './datetime';

export const storeKeys = {
  AccessToken: 'Access-Token',
  MenuCache: 'admin-current-user-menu',
};
export const storeType = { localStorage, sessionStorage };
interface StorageOptions { storeType?: Storage }
interface ExpirableItem<T> { value: T; expiry: number }

class BrowserStore {
  private static readonly keyName = 'omgind-storage-key-v1';
  private static readonly prefix = 'omgind:v1:';
  private static cipher: EncryptStorage;

  private static getCipher(): EncryptStorage {
    if (!BrowserStore.cipher) {
      let key = localStorage.getItem(BrowserStore.keyName);
      if (!key) {
        const bytes = new Uint8Array(32);
        crypto.getRandomValues(bytes);
        key = Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
        localStorage.setItem(BrowserStore.keyName, key);
      }
      // This browser-local key conceals stored values; it is not an XSS boundary.
      BrowserStore.cipher = new EncryptStorage(key);
    }
    return BrowserStore.cipher;
  }

  static set(key: string, value: unknown, options: StorageOptions = {}): void {
    const storage = options.storeType || localStorage;
    storage.setItem(key, BrowserStore.prefix + BrowserStore.getCipher().encryptValue(value));
  }

  static get<T = any>(key: string, options: StorageOptions = {}): T | null {
    const storage = options.storeType || localStorage;
    const raw = storage.getItem(key);
    if (raw === null) return null;
    try {
      if (raw.startsWith(BrowserStore.prefix)) {
        return BrowserStore.getCipher().decryptValue<T>(raw.slice(BrowserStore.prefix.length));
      }
      const value: T = JSON.parse(raw);
      BrowserStore.set(key, value, options);
      return value;
    } catch {
      storage.removeItem(key);
      return null;
    }
  }

  static remove(key: string, options: StorageOptions = {}): void {
    (options.storeType || localStorage).removeItem(key);
  }

  static getExpirableItem<T>(name: string): T | null {
    const item = BrowserStore.get<ExpirableItem<T>>(name);
    if (!item) return null;
    if (!Number.isFinite(item.expiry) || item.expiry <= Date.now()) {
      BrowserStore.remove(name);
      return null;
    }
    return item.value;
  }

  static setExpirableItem<T>(name: string, value: T, expiry = 5): void {
    const minutes = Number.isFinite(expiry) ? expiry : 5;
    BrowserStore.set(name, { value, expiry: Date.now() + minutesToMilliseconds(minutes) });
  }
}
export default BrowserStore;
