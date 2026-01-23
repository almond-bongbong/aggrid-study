import { NextResponse } from 'next/server';
import { resetUsers, wait } from '../store';

export async function POST() {
  await wait();
  return NextResponse.json(resetUsers());
}
