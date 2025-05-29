// lib/cookies.ts
import { cookies } from 'next/headers';
import { randomUUID } from 'crypto';

const USER_ID_COOKIE = 'anonymous_user_id';
const DAILY_WORD_COOKIE = 'daily_word_guesses';

async function getOrCreateAnonymousId(): Promise<{
  id: string;
  isNew: boolean
}> {
  const store = await cookies(); // async call now
  const existing = store.get(USER_ID_COOKIE);

  if (existing?.value) {
    return { id: existing.value, isNew: false };
  }

  const newId = randomUUID();
  store.set(USER_ID_COOKIE, newId, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: '/',
    sameSite: 'lax',
  });

  return { id: newId, isNew: true };
}

async function getDailyGuesses(): Promise<{
  guesses: Array<string>,
  hintLetters: Array<string>
}> {
  const store = await cookies();
  const existing = store.get(DAILY_WORD_COOKIE);
  if (existing?.value) {
    const [guesses, hintLetters] = existing.value.split('$')
    return {
      guesses: guesses.split(''),
      hintLetters: hintLetters.split('')
    };
  } else {
    throw new Error('No cookie stored!')
  }
}

async function setDailyGuesses(
  guesses: Array<string>,
  hintLetters: Array<string>,
): Promise<void> {
  const store = await cookies();
  const value = guesses.join('') + '$' + hintLetters.join('')
  store.set(DAILY_WORD_COOKIE, value, {
    httpOnly: true,
    maxAge: 60 * 60 * 24,
    path: '/',
    sameSite: 'lax',
  });
}

export {
  getOrCreateAnonymousId,
  getDailyGuesses,
  setDailyGuesses,
}