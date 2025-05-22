import { getOrCreateAnonymousId } from "@/lib/cookies";
import { DailyWord, Word } from "@prisma/client";
import { startOfDay } from "date-fns";

async function GetRandom(): Promise<Word> {

  try {
    const response = await fetch("/api/word/random");
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error(`GetRandom: HTTP error! Status: ${response.status} Error: ${response.json().then(x => x.error)}`);
    }
  } catch (error) {
    console.error('Error making API request:', error);
    throw error;
  }

}

async function GetDaily(): Promise<{
  played: boolean,
  word: Word | null
}> {
  try {
    const response = await fetch("/api/word/daily");
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      throw new Error(`GetDaily: HTTP error! Status: ${response.status} Error: ${response.json().then(x => x.error)}`);
    }
  } catch (error) {
    console.error('Error making API request:', error);
    throw error;
  }

}

async function SubmitStat(
  wordId: number,
  won: boolean,
  mistakes: number,
): Promise<{ success: true, result: any }> {
  try {
    const response = await fetch('/api/word/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        won,
        mistakes,
        wordId,
      }),
    });
    if (response.ok) {
      const data = await response.json()
      return data;
    } else {
      throw new Error(`SubmitStat: HTTP error! Status: ${response.status} Error: ${response.json().then(x => x.error)}`);
    }
  } catch (error) {
    console.error('Error making API request:', error);
    throw error;
  }

}

async function GetStats(wordId: number): Promise<{
  totalAttempts: number,
  totalWins: number,
  winPercentage: number,
  histogram: {},
}> {
  try {
    const response = await fetch("/api/word/stats/?id="+wordId);
    if (response.ok) {
      const data = await response.json();
      console.log(data)
      return data;
    } else {
      throw new Error(`GetStats: HTTP error! Status: ${response.status} Error: ${response.json().then(x => x.error)}`);
    }
  } catch (error) {
    console.error('Error making API request:', error);
    throw error;
  }

}

const failState = 6

const WinDefinitionPhrases = [
  "Big brain energy",
  "Nailed it!",
  "Word master, huh?",
  "You speak fluent wizard ",
  "Wow, big word guy over here?",
  "Flex those syllables",
  "Rolled a nat 20 on vocabulary",
  "You’re a certified wordsmith",
  "Well-read and well-fed",
  "A true lexical legend",
  "The word never stood a chance",
  "You’ve unlocked bonus knowledge",
  "Somebody call Merriam-Webster",
  "Grammatically glorious",
  "You made it look easy",
  "Too smart for this game",
  "Who needs hints anyway?",
  "That word feared you",
  "Yahtzee!"
];

const LoseDefinitionPhrases = [
  "No way that's a word...",
  "Words are hard",
  "I've got questions",
  "Is that really a word?!?",
  "Okay, now you’re just making stuff up",
  "My brain just blue-screened",
  "Sounds suspicious",
  "I'm 87% sure that's fake",
  "Somebody ask a librarian",
  "Check the scrolls",
  "Ancient runes detected",
  "I cast ‘Comprehend Language’",
  "Whomst invented this?",
  "Might be cursed",
  "A wild word appears!",
  "Word alchemy failed",
  "Echoes of forbidden grammar",
  "Straight out of a wizard’s thesaurus ",
  "Not even Google knows that one",
  "You fought the word and the word won",
  "Lost in the linguistic sauce",
  "Should’ve brought a thesaurus",
  "Maybe it’s in Klingon",
  "Definitely Scrabble bait",
  "Who said it would be easy?",
  "I lost a brain cell reading that",
];

export {
  GetRandom,
  GetDaily,
  SubmitStat,
  GetStats,
  WinDefinitionPhrases,
  LoseDefinitionPhrases,
  failState
}