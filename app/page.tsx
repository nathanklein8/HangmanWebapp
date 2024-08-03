"use client"

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { dead } from "@/lib/hungmen";
import { LucideCheckCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {

  const [guess, setGuess] = useState<string | null>(null)
  const [guesses, setGuesses] = useState<string[]>([])

  const regex = /^[a-zA-Z]+$/;

  return (
    <>
      <div className="flex justify-between">
        <div className="flex grow max-w-10"></div>

        <div className="flex grow justify-center text-center">
          <h1 className="text-3xl font-bold italic underline">Hangman</h1>
        </div>

        <ModeToggle />
      </div>

      {dead()}

      <div className="flex items-center justify-center gap-2 m-4">
        <Input
          maxLength={1}
          className="max-w-10 text-center "
          onKeyDown={(event) => {
            if (event.key.length == 1) {
              setGuess(event.key.toUpperCase())
            }
          }}
          onBlur={(event) => {
            event.target.value=""
          }}/>
        <Button
          size="icon"
          disabled={!guess}
          onClick={() => {
            if (guess && !guesses.includes(guess) && regex.test(guess)) {
              setGuesses([...guesses, guess])
            } else {
              toast("Invalid Guess")
            }
          }}>
          <LucideCheckCheck />
        </Button>
      </div>

      <div className="flex flex-row justify-center py-4 gap-3">
        {guesses.map((guess) => {
          return (
            <p key={guess}>
              {guess}
            </p>
          )
        })}
      </div>

    </>
  );
}
