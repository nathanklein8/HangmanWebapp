// lib/cookies.ts
import { cookies } from 'next/headers';
import { randomUUID } from 'crypto';

const COOKIE_NAME = 'anonymous_user_id';

export async function getOrCreateAnonymousId(): Promise<{ id: string; isNew: boolean }> {
  const store = await cookies(); // async call now
  const existing = store.get(COOKIE_NAME);

  if (existing?.value) {
    return { id: existing.value, isNew: false };
  }

  const newId = randomUUID();
  store.set(COOKIE_NAME, newId, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
    sameSite: 'lax',
  });

  return { id: newId, isNew: true };
}
