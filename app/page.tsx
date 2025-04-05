"use client"

import HungMan from "@/components/hung-man"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ArrowUp, LucideGithub, LucideLinkedin, MessageCircleQuestion, RefreshCcw, Wrench } from "lucide-react"
import { useEffect, useState } from "react"
import Confetti from "react-dom-confetti"
import ModeToggle from "@/components/mode-toggle"
import { cn, failState } from "@/lib/utils"
import { RenderPhrase } from "@/components/render-phrase"
import RandomWord from "@/data/data"
import Keyboard from "@/components/keyboard"

export default function Home() {

  const [guesses, setGuesses] = useState<Array<string>>([])
  const [guess, setGuess] = useState<string | null>(null)
  const [secretPhrase, setSecretPhrase] = useState<string>("")
  const [customPhrase, setCustomPhrase] = useState<string>("")
  const [confettiTrigger, setConfettiTrigger] = useState<boolean>(false)
  const [numIncorrect, setNumIncorrect] = useState<number>(0)
  const [isVictory, setIsVictory] = useState<boolean>(false)
  const [hintAvailable, setHintAvailable] = useState<boolean>(true)
  const [hintLetters, setHintLetters] = useState<Set<string>>(new Set())
  const [correctLetters, setCorrectLetters] = useState<Set<string>>(new Set())

  useEffect(() => {
    NewWord()
  }, [])

  const launchConfetti = () => {
    setConfettiTrigger(true)
    setTimeout(() => setConfettiTrigger(false), 1000)
  }

  const ResetPuzzle = () => {
    setGuess(null)
    setGuesses([])
    setNumIncorrect(0)
    setIsVictory(false)
    setHintLetters(new Set())
    setCorrectLetters(new Set())
  }

  async function NewWord() {
    const word = await RandomWord()
    ResetPuzzle()
    setSecretPhrase(word.toUpperCase())
  }

  const submitGuess = (letter: string, hint=false) => {
    // add guess to set
    const newGuesses = guesses.concat([letter])
    setGuesses(prevGuesses => newGuesses)
    // increment game state if guess was wrong
    if (!secretPhrase.toUpperCase().includes(letter)) {
      setNumIncorrect(numIncorrect => numIncorrect + 1)
    } else {
      // check for victory
      setCorrectLetters(prev => new Set([...prev, letter]))
      if (hint) {
        setHintLetters(prev => new Set([...prev, letter]))
      }
      if (new Set(secretPhrase).isSubsetOf(new Set(newGuesses))) {
        launchConfetti()
        setIsVictory(true)
      }
    }
    // reset guess back to empty
    setGuess(null)
  }

  const revealHint = () => {
    const possibleLetters = Array.from(new Set(secretPhrase).difference(new Set(guesses)))
    const index = Math.floor(Math.random() * possibleLetters.length);
    const chosen = possibleLetters[index]
    submitGuess(chosen, true)
    setHintAvailable(false)
    setTimeout(() => {
      setHintAvailable(true)
    }, 10000)
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
                      ResetPuzzle();
                      setSecretPhrase(customPhrase.toUpperCase());
                    }
                  }}
                />
                <Button size="icon" onClick={() => {
                  if (customPhrase != "") {
                    ResetPuzzle();
                    setSecretPhrase(customPhrase.toUpperCase());
                  }
                }}>
                  <ArrowUp />
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <HungMan size={135} numIncorrect={numIncorrect} />

      <RenderPhrase phrase={secretPhrase} guesses={guesses} isVictory={isVictory} state={numIncorrect} />

      <Keyboard
        onKeyClick={submitGuess}
        onHintClick={revealHint}
        guesses={new Set(guesses)}
        correctLetters={correctLetters}
        hintLetters={hintLetters}
        hideHint={isVictory || numIncorrect < 4 || !hintAvailable || numIncorrect == failState}
      />
      <div className="flex justify-center">
        <Confetti active={confettiTrigger}/>
      </div>

      {/* {isVictory || numIncorrect < 4 || !hintAvailable || numIncorrect == failState
          ? <></>
          : <div className="flex grow max-w-20">
            <Button
              className="mx-3 fade-in"
              variant="default"
              onClick={revealHint}>
              Hint
            </Button>
          </div>} */}

      {/* <div className="flex items-center justify-center">
        {isVictory || numIncorrect < 4 || !hintAvailable || numIncorrect == failState
          ? <></>
          : <div className="flex grow max-w-20"></div>}
        <div className="flex justify-content-center gap-1">
          <Input
            value={guess ? guess : ''}
            maxLength={1}
            className="max-w-10 text-center dark:border-neutral-500"
            disabled={isVictory || numIncorrect == failState}
            onChange={(event) => {
              const g = event.target.value.toUpperCase()
              guesses.indexOf(g) == -1 && /^[A-Z]$/.test(g) ? setGuess(g) : setGuess(null)
            }}
            onKeyDown={(event) => {
              if (event.key.toUpperCase() == 'ENTER' && guess) {
                submitGuess(guess)
              }
            }}
          />
          <Confetti active={confettiTrigger} />
          <Button
            className="dark:border-neutral-500"
            size="icon"
            variant={!guess ? "outline" : "default"}
            disabled={!guess}
            onClick={() => {
              if (guess) {
                submitGuess(guess)
              }
            }}>
            <MessageCircleQuestion />
          </Button>
        </div>
        {isVictory || numIncorrect < 4 || !hintAvailable || numIncorrect == failState
          ? <></>
          : <div className="flex grow max-w-20">
            <Button
              className="mx-3 fade-in"
              variant="default"
              onClick={revealHint}>
              Hint
            </Button>
          </div>}
      </div>

      <div className="flex justify-center">
        <div className="grid grid-cols-6 justify-center gap-2 min-w-40">
          {Array.from(guesses).map((letter) => {
            if (!secretPhrase.toUpperCase().includes(letter)) {
              return (
                <div key={letter} className="flex justify-center text-xl">
                  {letter}
                </div>
              )
            }
          })}
        </div>
      </div> */}

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
