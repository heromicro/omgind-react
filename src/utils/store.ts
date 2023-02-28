import { minutesToMilliseconds } from './datetime';

export const storeKeys = {
  AccessToken: 'Access-Token',
};

export const storeType = {
  localStorage,
  sessionStorage,
};

const defaultStorage = storeType.localStorage;

function set(key, value, ...options:any) {
  const storage = options.storeType || defaultStorage;
  storage.setItem(key, JSON.stringify(value));
}

function get(key, ...options:any) {
  const storage = options.storeType || defaultStorage;
  const value = storage.getItem(key);
  return value ? JSON.parse(value) : null;
}

function remove(key, ...options:any) {
  const storage = options.storeType || defaultStorage;
  storage.removeItem(key);
}

const getExpirableItem = <T>(name: string): T | null => {
	const itemStr = localStorage.getItem(name);
	if (!itemStr) {
		return null;
	}
	const item = JSON.parse(itemStr);

	if (item.expiry < new Date().getTime()) {
		localStorage.removeItem(name);
		return null;
	}
	return item.value;
};


const setExpirableItem = <T>(name: string, value: T, expiry = 5): void | null => {
	const validExpiry = Number.isNaN(Number(expiry)) ? 5 : minutesToMilliseconds(expiry);

	const item = {
		value,
		expiry: new Date().getTime() + validExpiry,
	};

	localStorage.setItem(name, JSON.stringify(item));
};


export default {
  set,
  get,
  remove,
  getExpirableItem,
  setExpirableItem,
};
