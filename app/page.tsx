"use client"

import HungMan from "@/components/hung-man"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ArrowUp, LucideGithub, LucideLinkedin, MessageCircleQuestion, RefreshCcw, Wrench } from "lucide-react"
import { useEffect, useState } from "react"
import Confetti from "react-dom-confetti"
import ModeToggle from "@/components/mode-toggle"
import { failState } from "@/lib/utils"
import { RenderPhrase } from "@/components/render-phrase"
import RandomWord from "@/data/data"

export default function Home() {

  const [guesses, setGuesses] = useState<Set<string>>(new Set)
  const [guess, setGuess] = useState<string | null>(null)
  const [secretPhrase, setSecretPhrase] = useState<string>("")
  const [customPhrase, setCustomPhrase] = useState<string>("")
  const [confettiTrigger, setConfettiTrigger] = useState<boolean>(false)
  const [numIncorrect, setNumIncorrect] = useState<number>(0)
  const [isVictory, setIsVictory] = useState<boolean>(false)

  useEffect(() => {
    NewWord()
  }, [])

  const launchConfetti = () => {
    setConfettiTrigger(true)
    setTimeout(() => setConfettiTrigger(false), 1000)
  }

  const isGameWon = () => {
    const phrase = secretPhrase.toUpperCase().replace(/[^a-zA-Z]/g, '');
    for (let char of phrase) {
      if (!guesses.has(char)) { return false }
    }
    return true
  }

  const ResetPuzzle = () => {
    setGuess(null)
    setGuesses(new Set)
    setNumIncorrect(0)
    setIsVictory(false)
  }

  async function NewWord() {
    ResetPuzzle()
    setSecretPhrase("") // reset to show loading text
    const word = await RandomWord() // returns as singleton list
    setSecretPhrase(word)
  }

  const submitGuess = () => {
    // add guess to set
    setGuesses(guesses.add(guess!))
    // increment game state if guess was wrong
    if (!secretPhrase.toUpperCase().includes(guess!)) {
      const newNum = numIncorrect + 1
      setNumIncorrect(newNum)
    } else {
      // check if the game was won
      if (isGameWon()) {
        launchConfetti()
        setIsVictory(true)
      }
    }
    // reset guess back to empty
    setGuess(null)
  }

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between p-2 gap-4">
        <div className="flex grow justify-end gap-2">
          <a href="https://github.com/nathanklein8/" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="icon"><LucideGithub /></Button>
          </a>
          <a href="https://linkedin.com/in/nathan-e-klein/" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="icon"><LucideLinkedin /></Button>
          </a>
        </div>
        <div className="flex max-w-fit justify-center">
          <h1 className="text-4xl font-bold italic underline">Hangman</h1>
        </div>
        <div className="flex grow justify-start gap-2">
          <ModeToggle />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="icon"><Wrench /></Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit">
              <div className="flex flex-row gap-2 mb-2">
                <Button
                  className="w-full"
                  variant="destructive"
                  disabled={isVictory || numIncorrect == failState}
                  onClick={() => {
                    setNumIncorrect(failState)
                  }}>Reveal</Button>
                <Button
                  className="w-full"
                  variant="destructive"
                  onClick={() => { ResetPuzzle() }}>Reset</Button>
              </div>
              <div className="flex flex-row gap-2">
                <Input
                  placeholder="Enter Secret Phrase..."
                  onChange={(event) => {
                    setCustomPhrase(event.target.value)
                  }}
                  onKeyDown={(event) => {
                    if (event.key.toUpperCase() == "ENTER") {
                      setSecretPhrase(customPhrase)
                    }
                  }}
                />
                <Button size="icon" onClick={() => { if (customPhrase != "") { setSecretPhrase(customPhrase) } }}>
                  <ArrowUp />
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <HungMan size={135} numIncorrect={numIncorrect} />

      <RenderPhrase phrase={secretPhrase} guesses={guesses} isVictory={isVictory} state={numIncorrect} />

      <div className="flex items-center justify-center gap-1">
        <Input
          value={guess ? guess : ''}
          maxLength={1}
          className="max-w-10 text-center dark:border-neutral-500"
          disabled={isVictory || numIncorrect == failState}
          onChange={(event) => {
            const g = event.target.value.toUpperCase()
            !guesses.has(g) && /^[A-Z]$/.test(g) ? setGuess(g) : setGuess(null)
          }}
          onKeyDown={(event) => {
            if (event.key.toUpperCase() == 'ENTER' && guess) {
              submitGuess()
            }
          }}
        />
        <Confetti active={confettiTrigger} />
        <Button
          className="dark:border-neutral-500"
          size="icon"
          variant={!guess ? "outline" : "default"}
          disabled={!guess}
          onClick={submitGuess}>
          <MessageCircleQuestion />
        </Button>
      </div>

      <div className="flex justify-center">
        <div className="grid grid-cols-6 justify-center gap-2 min-w-40">
          {Array.from(guesses).map((guess) => {
            if (!secretPhrase.toUpperCase().includes(guess)) {
              return (
                <div key={guess} className="flex justify-center text-xl">
                  {guess}
                </div>
              )
            }
          })}
        </div>
      </div>

      {isVictory || numIncorrect == failState ?
        <>
          <div className="flex justify-center gap-2 my-0">
            <Button className="dark:border-neutral-500" variant="outline" onClick={() => { NewWord() }}>
              New Game
            </Button>
          </div>
          <div className="flex flex-row justify-center items-center gap-1 text-sm text-muted-foreground italic">
            Hint: enter a custom secret word/phrase in the
            <Wrench size={16} />
            menu
          </div>
        </>
        : <></>}

    </div>
  )
}
