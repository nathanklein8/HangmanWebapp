// utils/hangmanCookies.ts
import Cookies from 'js-cookie';
import { toast } from 'sonner';

type GameState = {
  wordId: number;
  guesses: Array<string>;
};

const COOKIE_NAME = 'CLIENT_SIDE_SAVE';

export function SaveGameState(wordId: number, guesses: string) {
  const cookieData = {
    wordId,
    guesses: guesses, // convert to compact string
  };
  Cookies.set(COOKIE_NAME, JSON.stringify(cookieData), {
    expires: 1, // 1 day
    sameSite: 'Lax',
  });
}

export function FetchGameState(): GameState | null {
  const raw = Cookies.get(COOKIE_NAME);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { wordId: number; guesses: string };
    return {
      wordId: parsed.wordId,
      guesses: parsed.guesses.split(''),
    };
  } catch (err) {
    console.error('Failed to parse save state cookie:', err);
    toast.error('Unable to parse save state cookie!')
    return null;
  }
}

export function ClearGameState() {
  Cookies.remove(COOKIE_NAME);
}
