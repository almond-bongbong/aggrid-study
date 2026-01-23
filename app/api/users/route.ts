import { NextResponse } from 'next/server';
import { getUsers, wait } from './store';

export async function GET() {
  await wait();
  return NextResponse.json(getUsers());
}
