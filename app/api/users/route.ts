import { NextResponse } from 'next/server';
import { getUsers, wait } from './store';

export const preferredRegion = 'icn1';

export async function GET() {
  await wait();
  return NextResponse.json(getUsers());
}
