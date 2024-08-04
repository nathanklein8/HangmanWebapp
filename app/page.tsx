"use client"

import { CustomConfetti } from "@/components/custom-confetti";
import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { dead } from "@/lib/hungmen";
import { AlertTriangle, CheckCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";


export default function Home() {

  const [guesses, setGuesses] = useState<Set<string>>(new Set)
  const [guess, setGuess] = useState<string | null>(null)
  const [secretPhrase, setSecretPhrase] = useState<string>("I love Applesauce")
  const [victory, setVictory] = useState<boolean>(false)

  const isValid = (guess: string) => {
    return /^[A-Z]$/.test(guess) && !guesses.has(guess)
  }

  const getHiddenPhrase = (phrase: string, show: Set<string>): string => {
    return phrase.toUpperCase().replace(/[A-Z]/g, char => show.has(char) ? char : '_');
  }

  const doConfetti = () => {
    setVictory(true);
    setTimeout(() => setVictory(false), 1000);
  };

  return (
    <>
      <CustomConfetti active={victory}/>

      {/* header */}
      <div className="flex justify-between p-2 px-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="destructive" size="icon"><AlertTriangle /></Button>
          </PopoverTrigger>
          <PopoverContent className="w-fit">
            <div className="flex flex-row gap-2">

              <Button
                variant="destructive"
                onClick={() => {
                  const chars = new Set(secretPhrase.toUpperCase())
                  setGuesses(chars)
                }}>Reveal</Button>
              <Button
                variant="destructive"
                onClick={() => {
                  setGuesses(new Set)
                }}>Reset</Button>
            </div>
          </PopoverContent>
        </Popover>
        <div className="flex grow max-w-fit justify-center text-center animate-pulse rounded-md bg-primary/10">
          <a href="https://github.com/nathanklein8" target="_blank" rel="noopener noreferrer">
            <Button variant='link' className="text-5xl font-bold p-0 m-3">Hangman</Button>
          </a>
        </div>
        <div className="flex grow max-w-10">
          <ModeToggle />
        </div>
      </div>

      {/* graphic */}
      {dead()}

      <div className="flex justify-center my-4 tracking-widest text-2xl">
        {getHiddenPhrase(secretPhrase, guesses)}
      </div>

      {/* input area */}
      <div className="flex items-center justify-center gap-2 m-4">
        <Input
          value={guess ? guess : ''}
          maxLength={1}
          className="max-w-10 text-center border-solid"
          onChange={(event) => {
            const g = event.target.value.toUpperCase()
            if (isValid(g)) {
              setGuess(g)
              console.log('triggering')
            } else {
              setGuess(null)
            }
          }}
        />
        <Button
          size="icon" variant="secondary"
          disabled={!guess}
          onClick={() => {
            if (guess) {
              setGuesses(guesses.add(guess))
              setGuess(null)
            }
          }}>
          <CheckCheck color={guess ? "#00ee00" : "#ee0000"} />
        </Button>
      </div>

      {/* guess history */}
      <div className="flex justify-center mb-2">
        <div className="grid grid-cols-6 min-w-40 justify-center gap-2">
          {Array.from(guesses).map((guess) => {
            return (
              <div key={guess} className="flex justify-center">
                {guess}
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex justify-center my-10">
        <Button onClick={doConfetti}>test confetti</Button>
      </div>

    </>
  );
}
