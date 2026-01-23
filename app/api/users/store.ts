import type { ListItem } from '@/app/type';
import seedList from '@/public/mock/list.json';

const createSeed = () =>
  (seedList as ListItem[]).map((item) => ({
    ...item,
  }));

let db = createSeed();
export const API_DELAY_MS = 500;
export const wait = () => new Promise((resolve) => setTimeout(resolve, API_DELAY_MS));

export const getUsers = () => db;

export const resetUsers = () => {
  db = createSeed();
  return db;
};

export const updateUser = (id: number, changes: Partial<ListItem>) => {
  const exists = db.some((item) => item.id === id);
  if (!exists) return null;

  db = db.map((item) => (item.id === id ? { ...item, ...changes } : item));
  return db.find((item) => item.id === id) ?? null;
};
