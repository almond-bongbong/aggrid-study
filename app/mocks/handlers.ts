import { delay, http, HttpResponse } from 'msw';
import type { ListItem } from '@/app/type';
import seedList from '@/public/mock/list.json';

const toSeed = () =>
  (seedList as ListItem[]).map((item) => ({
    ...item,
  }));

let db = toSeed();
const API_DELAY_MS = 500;

export const handlers = [
  http.get('/api/users', async () => {
    await delay(API_DELAY_MS);
    return HttpResponse.json(db);
  }),

  http.post('/api/users/:id', async ({ params, request }) => {
    await delay(API_DELAY_MS);
    if (request.headers.get('x-simulate-error') === '1') {
      return HttpResponse.json({ message: 'Simulated error' }, { status: 500 });
    }

    const id = Number(params.id);
    if (Number.isNaN(id)) {
      return new HttpResponse(null, { status: 400 });
    }

    const body = (await request.json()) as Partial<ListItem>;
    const exists = db.some((item) => item.id === id);
    if (!exists) {
      return new HttpResponse(null, { status: 404 });
    }

    db = db.map((item) => (item.id === id ? { ...item, ...body } : item));

    const updated = db.find((item) => item.id === id);
    if (!updated) {
      return new HttpResponse(null, { status: 404 });
    }

    return HttpResponse.json(updated);
  }),

  http.post('/api/users/reset', async () => {
    await delay(API_DELAY_MS);
    db = toSeed();
    return HttpResponse.json(db);
  }),
];
