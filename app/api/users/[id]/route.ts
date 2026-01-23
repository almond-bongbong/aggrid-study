import { NextResponse } from 'next/server';
import type { ListItem } from '@/app/type';
import { updateUser, wait } from '../store';

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  await wait();
  if (request.headers.get('x-simulate-error') === '1') {
    return NextResponse.json({ message: 'Simulated error' }, { status: 500 });
  }

  const { id } = await context.params;
  const numericId = Number(id);
  if (Number.isNaN(numericId)) {
    return new NextResponse(null, { status: 400 });
  }

  let body: Partial<ListItem> | null = null;
  try {
    body = (await request.json()) as Partial<ListItem>;
  } catch {
    return new NextResponse(null, { status: 400 });
  }

  const updated = updateUser(numericId, body ?? {});
  if (!updated) {
    return new NextResponse(null, { status: 404 });
  }

  return NextResponse.json(updated);
}
