import { NextResponse } from 'next/server';
import { resetUsers, wait } from '../store';

export const preferredRegion = 'icn1';

export async function POST() {
  await wait();
  return NextResponse.json(resetUsers());
}
